import http from "./http";
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

// 문서 업로드 사전 서명 URL 발급 (Lambda 요구 스키마 대응)
// 문서 업로드 presign
export async function postDocumentsPresign(body: PresignRequest) {
    const res = await http.post<PresignResponse>(
      "/documents",
      {
        operation: "put",
        fileName: body.fileName,        // ✅ 수정됨
        contentType: body.contentType,
        userId: body.userId ?? 1,       // optional
      },
      { headers: { "Content-Type": "application/json" } } // ✅ 꼭 추가
    );
    return normalizePresignResponse(res.data as any);
  }
  
  function normalizePresignResponse(raw: any): PresignResponse {
    if (!raw || typeof raw !== "object") {
      throw new Error("서버 응답 형식이 올바르지 않습니다 (presign)");
    }
  
    const urlKeys = ["uploadUrl", "url", "presignedUrl", "preSignedUrl", "putUrl", "s3PutUrl"];
    const idKeys = ["docId", "documentId", "id"];
  
    let uploadUrl: string | undefined;
    for (const key of urlKeys) {
      if (typeof raw[key] === "string") {
        uploadUrl = raw[key];
        break;
      }
    }
  
    let docId: string | number | undefined;
    for (const key of idKeys) {
      if (raw[key] !== undefined) {
        docId = raw[key];
        break;
      }
    }
  
    if (!uploadUrl || docId === undefined || docId === null) {
      console.error("normalizePresignResponse error:", raw);
      throw new Error("서버 응답에서 uploadUrl/docId를 찾을 수 없습니다");
    }
  
    return {
      uploadUrl,
      docId: String(docId), // ✅ 숫자도 문자열로 통일
    };
  }
  

// 전처리
export async function postPreprocess(docId: string) {
	const res = await http.post<PreprocessResponse>(`/documents/${docId}/preprocess`);
	return res.data;
}

// 프로브
export async function postProbe(docId: string) {
	const res = await http.post<ProbeResponse>(`/documents/${docId}/probe`);
	return res.data;
}

// 임베딩
export async function postEmbedding(docId: string) {
	const res = await http.post<EmbeddingResponse>(`/documents/${docId}/embedding`);
	return res.data;
}

// 의도 추천
export async function postIntentSuggest(docId: string) {
    const res = await http.post<SuggestResponse>(`/documents/${docId}/intent/suggest`);
	return res.data;
}

// 사용자 정의 의도 전송
export async function postIntentCustom(docId: string, body: CustomIntentsRequest) {
	const res = await http.post<void>(`/documents/${docId}/intent/custom`, body);
	return res.data;
}

// 세션 생성
export async function postSessions(body: SessionCreateRequest) {
	const res = await http.post<SessionCreateResponse>(`/sessions`, body);
	return res.data;
}

// 실행 시작
export async function postRun(sessionId: string) {
	const res = await http.post<RunStartResponse>(`/sessions/${sessionId}/run`);
	return res.data;
}

// 결과 조회
export async function getRunResults(runId: string) {
	const res = await http.get<RunResultsResponse>(`/runs/${runId}/results`);
	return res.data;
}


