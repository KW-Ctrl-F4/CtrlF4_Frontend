import { http } from "./http";
import type {
    PresignRequest,
    PresignResponse,
    PreprocessResponse,
    ProbeResponse,
    EmbeddingResponse,
    SuggestResponse,
    CustomIntentsRequest,
    SessionCreateRequest,
    SessionCreateResponse,
    RunStartResponse,
    RunResultsResponse,
    RunRevisionResponse,
} from "./types";

// =========================
// PRESIGN (문서 업로드 URL 발급)
// =========================

export async function postDocumentsPresign(body: PresignRequest) {
    const res = await http.post<PresignResponse>(
        "/documents",
        {
            operation: "put",
            fileName: body.fileName,
            contentType: body.contentType,
        },
        {
            headers: { "Content-Type": "application/json" },
        }
    );

    return normalizePresignResponse(res.data);
}

// presign 응답 정규화: uploadUrl + docId + key 필수
function normalizePresignResponse(raw: any): PresignResponse {
    if (!raw || typeof raw !== "object") {
        throw new Error("서버 응답 형식이 올바르지 않습니다 (presign)");
    }

    // presigned URL 후보 키
    const urlKeys = ["uploadUrl", "url", "presignedUrl", "preSignedUrl", "putUrl", "s3PutUrl"];
    const idKeys = ["docId", "documentId", "id"];

    let uploadUrl: string | undefined;
    for (const k of urlKeys) {
        if (typeof raw[k] === "string") {
            uploadUrl = raw[k];
            break;
        }
    }

    let docId: string | number | undefined;
    for (const k of idKeys) {
        if (raw[k] !== undefined) {
            docId = raw[k];
            break;
        }
    }

    if (!uploadUrl || docId === undefined || docId === null) {
        console.error("normalizePresignResponse error:", raw);
        throw new Error("서버 응답에서 uploadUrl/docId가 누락되었습니다");
    }

    // 🔥 핵심: key 반드시 포함
    const key = raw.key ?? raw.s3Key ?? raw.fileName;
    if (!key) {
        console.error("normalizePresignResponse missing key:", raw);
        throw new Error("presign 응답에서 key를 찾을 수 없습니다");
    }

    return {
        uploadUrl,
        docId: String(docId),
        key,
        fileName: raw.fileName,
        bucket: raw.bucket,
    };
}

// =========================
// PREPROCESS
// =========================

export async function postPreprocess(docId: string, s3Key: string) {
    const res = await http.post<PreprocessResponse>(
        `/documents/${docId}/preprocess`,
        { s3Key }
    );
    return res.data;
}

// =========================
// PROBE
// =========================

export async function postProbe(docId: string) {
    const res = await http.post<ProbeResponse>(`/documents/${docId}/probe`);
    return res.data;
}

// =========================
// EMBEDDING
// =========================

export async function postEmbedding(docId: string) {
    const res = await http.post<EmbeddingResponse>(`/documents/${docId}/embedding`);
    return res.data;
}

// =========================
// INTENT SUGGEST
// =========================

export async function postIntentSuggest(docId: string) {
    const res = await http.post<SuggestResponse>(`/documents/${docId}/intent/suggest`);
    return res.data;
}

// 사용자 정의 intent 전송
export async function postIntentCustom(docId: string, body: CustomIntentsRequest) {
    const res = await http.post<void>(`/documents/${docId}/intent/custom`, body);
    return res.data;
}

// =========================
// SESSIONS
// =========================

export async function postSessions(body: SessionCreateRequest) {
    const res = await http.post<SessionCreateResponse>(`/sessions`, body);
    return res.data;
}

// 실행 시작
export async function postRun(sessionId: string) {
    const res = await http.post<RunStartResponse>(`/sessions/${sessionId}/run`);
    return res.data;
}

// 실행 결과 조회
export async function getRunResults(runId: string) {
    const res = await http.get<RunResultsResponse>(`/runs/${runId}/results`);
    return res.data;
}

// 재분석
export async function postRunRevision(runId: string) {
    const res = await http.post(`/runs/${runId}/reanalyze`);
    const raw = res?.data ?? {};

    // 응답 바디 우선 시도 (string + number 모두 허용)
    let nextRunId =
        (raw?.runId !== undefined && raw.runId !== null && String(raw.runId)) ||
        (raw?.id !== undefined && raw.id !== null && String(raw.id)) ||
        (raw?.newRunId !== undefined && raw.newRunId !== null && String(raw.newRunId)) ||
        null;

    // 헤더 보조 시도
    if (!nextRunId) {
        const headers: any = res?.headers || {};
        const fromHeader = headers["x-run-id"] || headers["X-Run-Id"];
        if (fromHeader) nextRunId = String(fromHeader);

        const location = headers["location"] || headers["Location"];
        if (!nextRunId && typeof location === "string") {
            const m = location.match(/\/runs\/([^/]+)/);
            if (m && m[1]) nextRunId = m[1];
        }
    }

    if (!nextRunId) {
        throw new Error("reanalyze 응답에서 runId를 찾을 수 없습니다.");
    }

    return { runId: String(nextRunId) } as RunRevisionResponse;
}

// =========================
// REPORTS (리포트 생성/다운로드)
// =========================

// 리포트 생성: /runs/{runId}/reports (POST) → reportId 반환 형태를 최대한 정규화
export async function postRunReport(runId: string): Promise<{ reportId: string }> {
    const res = await http.post(`/runs/${runId}/reports`);
    const raw = res?.data ?? {};

    // 바디에서 reportId 후보 탐색
    let reportId: string | null =
        (raw?.reportId !== undefined && raw.reportId !== null && String(raw.reportId)) ||
        (raw?.id !== undefined && raw.id !== null && String(raw.id)) ||
        null;

    // 헤더에서 보조 탐색
    if (!reportId) {
        const headers: any = res?.headers || {};
        const fromHeader = headers["x-report-id"] || headers["X-Report-Id"];
        if (fromHeader) reportId = String(fromHeader);

        // Location: /runs/{runId}/reports/{reportId}
        const location = headers["location"] || headers["Location"];
        if (!reportId && typeof location === "string") {
            const m = location.match(/\/runs\/[^/]+\/reports\/([^/]+)/);
            if (m && m[1]) reportId = m[1];
        }
    }

    if (!reportId) {
        throw new Error("리포트 생성 응답에서 reportId를 찾을 수 없습니다.");
    }
    return { reportId };
}

// 리포트 조회: 우선 JSON으로 presigned URL을 기대하고, 없으면 blob으로 재시도
export async function fetchRunReport(
    runId: string,
    reportId: string
): Promise<
    | { kind: "url"; url: string }
    | { kind: "blob"; blob: Blob; fileName?: string; contentType?: string }
> {
    // 1차: JSON으로 URL 탐색
    try {
        const jsonRes = await http.get(`/runs/${runId}/reports/${reportId}`);
        const data: any = jsonRes?.data ?? {};
        const url: string | undefined =
            data?.url || data?.downloadUrl || data?.fileUrl || data?.presignedUrl;
        if (typeof url === "string" && url.length > 0) {
            return { kind: "url", url };
        }
    } catch {
        // 무시하고 blob 시도
    }

    // 2차: blob으로 직접 다운로드 시도
    const blobRes = await http.get(`/runs/${runId}/reports/${reportId}`, {
        responseType: "blob",
    } as any);
    const blob: Blob = blobRes?.data as any;
    const headers: any = blobRes?.headers || {};
    const contentType: string | undefined =
        headers["content-type"] || headers["Content-Type"];

    // 파일명 추출 (content-disposition)
    let fileName: string | undefined;
    const cd: string | undefined =
        headers["content-disposition"] || headers["Content-Disposition"];
    if (cd && typeof cd === "string") {
        const m = cd.match(/filename\*?=(?:UTF-8''|")?([^";\n]+)/);
        if (m && m[1]) {
            try {
                fileName = decodeURIComponent(m[1].replace(/^"+|"+$/g, ""));
            } catch {
                fileName = m[1].replace(/^"+|"+$/g, "");
            }
        }
    }
    return { kind: "blob", blob, fileName, contentType };
}
