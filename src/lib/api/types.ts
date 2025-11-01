// API 타입 정의 (OAS/Swagger 기반 + 합리적 추정)

export interface PresignRequest {
	fileName: string;
	contentType: string;
	userId?: number;
	bucket?: string;
	key?: string; // 전달 시 서버가 그대로 사용, 없으면 서버/클라이언트가 생성
}

export interface PresignResponse {
	uploadUrl: string;
	docId: string;
}

export interface PreprocessResponse {
	status?: "queued" | "started" | "completed";
}

export interface ProbeResponse {
	status?: string;
}

export interface EmbeddingResponse {
	status?: string;
}

export interface SuggestQuestionItem {
    key: string;
    text: string;
}

export interface SuggestResponse {
    ok?: boolean;
    predictedRole?: string[];
    questions?: SuggestQuestionItem[];
    // 구버전 호환
    intents?: string[];
}

export interface CustomIntentsRequest {
    // 새 스펙: suggest 응답에 대한 사용자의 입력 저장
    answers?: {
        role?: string;
        question?: string;
        focus?: string[] | string;
        [key: string]: unknown;
    };
    // 구버전 호환: 임의의 intents 전달
    intents?: string[];
}

export interface SessionCreateRequest {
    docId: number;
	role: string;
	answers: {
		question: string;
		focus: string[];
	};
}

export interface SessionCreateResponse {
	sessionId: string;
}

export interface RunStartResponse {
	runId: string;
}



export interface AnalysisClause {
	title: string;
	description: string;
}

export interface AnalysisRisk {
	id: string;
	title: string;
	description: string;
	severity: "low" | "medium" | "high";
}

export interface AnalysisSuggestion {
	id: string;
	title: string;
	description: string;
	example?: string;
}

export interface RunResultsResponse {
	title?: string;
	uploadDate?: string;
	fileCount?: number;
	clauses: AnalysisClause[];
	riskFactors: AnalysisRisk[];
	suggestions: AnalysisSuggestion[];
}

export type ApiErrorPayload = {
	message?: string;
	code?: string | number;
	status?: number;
};


