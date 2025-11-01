import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	getRunResults,
	postDocumentsPresign,
	postEmbedding,
	postIntentCustom,
	postIntentSuggest,
	postPreprocess,
	postProbe,
	postRun,
	postSessions,
} from "./client";
import type {
    RunResultsResponse,
    SessionCreateRequest,
    CustomIntentsRequest,
    SuggestQuestionItem,
} from "./types";

export interface UseDocumentAnalysisOptions {
	role?: string;
	pollIntervalMs?: number;
}

export function useDocumentAnalysis({
	role = "user",
	pollIntervalMs = 1500,
}: UseDocumentAnalysisOptions = {}) {
	const [docId, setDocId] = useState<string | null>(null);
	const [sessionId, setSessionId] = useState<string | null>(null);
	const [runId, setRunId] = useState<string | null>(null);
    const [suggestedIntents, setSuggestedIntents] = useState<string[]>([]);
    const [suggestedRoles, setSuggestedRoles] = useState<string[]>([]);
    const [suggestedQuestions, setSuggestedQuestions] = useState<SuggestQuestionItem[]>([]);
	const [selectedIntents, setSelectedIntents] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [results, setResults] = useState<RunResultsResponse | null>(null);
	const pollTimerRef = useRef<number | null>(null);
	const pollStartTimeRef = useRef<number | null>(null);
	const pollAttemptsRef = useRef<number>(0);
	const [progress, setProgress] = useState(0);

	// 언마운트 시 폴링 중지
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => {
		return () => {
			if (pollTimerRef.current) {
				window.clearInterval(pollTimerRef.current);
				pollTimerRef.current = null;
			}
		};
	}, []);

	const reset = useCallback(() => {
		setDocId(null);
		setSessionId(null);
		setRunId(null);
		setSuggestedIntents([]);
		setSelectedIntents([]);
		setIsLoading(false);
		setError(null);
		setResults(null);
		setProgress(0);
		if (pollTimerRef.current) {
			window.clearInterval(pollTimerRef.current);
			pollTimerRef.current = null;
		}
	}, []);

	const presignAndUpload = useCallback(
		async (file: File) => {
			setIsLoading(true);
			setError(null);
			try {
				// 1) presign
				const { uploadUrl, docId } = await postDocumentsPresign({
					fileName: file.name,
					contentType: file.type || "application/octet-stream",
				});
				setDocId(docId);
				setProgress(10);

				// 2) S3 PUT
				await fetch(uploadUrl, {
                    method: "PUT",
                    headers: {
                      "Content-Type": file.type || "application/octet-stream",
                      "x-amz-acl": "private",  // ✅ presign 서명에 포함된 ACL 헤더 반드시 같이 보내야 함
                    },
                    body: file,
                  });
                  
				setProgress(20);

				// 3) preprocess
				await postPreprocess(docId);
				setProgress(35);


				// 4) embedding (임베딩 먼저)
				await postEmbedding(docId);
				setProgress(45);

				// 5) probe (그 다음 프로브)
				await postProbe(docId);
				setProgress(55);

                // 6) intent suggest (새 스펙 대응)
                const suggest = await postIntentSuggest(docId);
                setSuggestedIntents(suggest?.intents ?? []);
                setSuggestedRoles(suggest?.predictedRole ?? []);
                setSuggestedQuestions(suggest?.questions ?? []);
				setProgress(60);
			} catch (e: any) {
				const msg = e?.response?.data?.message || e?.message || "업로드/전처리 중 오류가 발생했습니다.";
				setError(msg);
				throw e;
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	const submitCustomIntents = useCallback(
		async (intents: string[]) => {
			if (!docId) return;
			const body: CustomIntentsRequest = { intents };
			await postIntentCustom(docId, body);
			setSelectedIntents(intents);
		},
		[docId]
	);

	// 새 스펙: suggest 질문 답변을 서버에 저장
	const submitAnswers = useCallback(
		async (answersMap: Record<string, unknown>) => {
			if (!docId) return;
			const body: CustomIntentsRequest = { answers: answersMap };
			await postIntentCustom(docId, body);
		},
		[docId]
	);

    const startAnalysis = useCallback(
        async (answers: { question: string; focus: string[] }, overrideRole?: string) => {
			if (!docId) throw new Error("docId가 없습니다.");
			setIsLoading(true);
			setError(null);
			try {
				// 7) sessions
                const numericDocId = Number(docId);
                if (!Number.isFinite(numericDocId)) {
                    throw new Error("docId가 숫자가 아닙니다.");
                }
                const sessionBody: SessionCreateRequest = {
                    docId: numericDocId,
                    role: overrideRole || role,
					answers,
				};
				const { sessionId } = await postSessions(sessionBody);
				setSessionId(sessionId);
				setProgress(70);

                // 8) run (바디에 sessionId/docId/role/answers 포함)
                const { runId } = await postRun(sessionId!);
				setRunId(runId);
				setProgress(80);

				// 9) results poll (상태/availableWorkers 기반 종료, 타임아웃 가드)
				await new Promise<void>((resolve) => {
					pollStartTimeRef.current = Date.now();
					pollAttemptsRef.current = 0;
					pollTimerRef.current = window.setInterval(async () => {
						try {
							pollAttemptsRef.current += 1;
							const raw: any = await getRunResults(runId);

							// 진행률 업데이트 (백엔드가 제공 시)
							const p = Number(raw?.run?.progress);
							if (Number.isFinite(p)) {
								setProgress(Math.max(progress, Math.min(99, p)));
							}

							const status = raw?.run?.status;
							const workers: any[] = Array.isArray(raw?.availableWorkers) ? raw.availableWorkers : [];
							const isDone = status === "completed" || workers.length === 0;

							if (isDone) {
								// 결과 표준화 (risk만 도착해도 UI가 그릴 수 있게 변환)
								const normalized = normalizeResults(raw);
								setResults(normalized);
								setProgress(100);
								if (pollTimerRef.current) {
									window.clearInterval(pollTimerRef.current);
									pollTimerRef.current = null;
								}
								resolve();
								return;
							}

							// 타임아웃 가드 (최대 3분 or 300회 시도)
							const elapsed = (Date.now() - (pollStartTimeRef.current || Date.now()));
							if (elapsed > 180_000 || pollAttemptsRef.current > 300) {
								setError("결과 폴링이 지연되고 있습니다. 잠시 후 다시 시도해주세요.");
								if (pollTimerRef.current) {
									window.clearInterval(pollTimerRef.current);
									pollTimerRef.current = null;
								}
								resolve();
							}
						} catch (err) {
							// 네트워크/서버 일시 오류 → 다음 틱에 재시도
						}
					}, pollIntervalMs);
				});
			} catch (e: any) {
				const msg = e?.response?.data?.message || e?.message || "분석 실행 중 오류가 발생했습니다.";
				setError(msg);
				throw e;
			} finally {
				setIsLoading(false);
			}
		},
		[docId, role, pollIntervalMs]
	);

	const state = useMemo(
		() => ({
			docId,
			sessionId,
			runId,
			suggestedIntents,
            suggestedRoles,
            suggestedQuestions,
			selectedIntents,
			isLoading,
			error,
			results,
		}),
        [docId, sessionId, runId, suggestedIntents, suggestedRoles, suggestedQuestions, selectedIntents, isLoading, error, results]
	);

	return {
		...state,
		progress,
		presignAndUpload,
		submitCustomIntents,
		submitAnswers,
		startAnalysis,
		reset,
	};
}

// 백엔드의 임시 결과 포맷을 표준 결과 포맷으로 변환
function normalizeResults(raw: any): RunResultsResponse {
    const riskArr: any[] = Array.isArray(raw?.results?.risk) ? raw.results.risk : [];
    const riskFactors = riskArr.map((r) => ({
        id: String(r?.id ?? ""),
        title: String(r?.type ?? "위험"),
        description: String(r?.summary ?? ""),
        severity: (String(r?.severity ?? "medium").toLowerCase() as any) || "medium",
    }));
    return {
        title: raw?.doc?.name || "분석 결과",
        uploadDate: new Date().toISOString(),
        fileCount: 1,
        clauses: [],
        riskFactors,
        suggestions: [],
    };
}


