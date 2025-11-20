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
            userId: body.userId ?? 1,
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
