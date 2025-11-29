import { useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import TopNavigation from "../_shared/components/TopNavigation";
import Title from "./components/Title";
import Footer from "./components/Footer";
import { formatKstDateTime } from "../../lib/date";
import {
  getRunResults,
  postRunRevision,
  postRunReport,
  fetchRunReport,
} from "../../lib/api/client";
import ResultsCard from "./components/ResultsCard";
import { extractResultSections } from "./utils";

export default function Result() {
  const location = useLocation();
  const baseRunId: string | undefined =
    (location.state as any)?.runId ||
    (() => {
      try {
        return window.sessionStorage.getItem("consure:lastRunId") || undefined;
      } catch {
        return undefined;
      }
    })();
  const [raw, setRaw] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isReanalyzing, setIsReanalyzing] = useState<boolean>(false);
  const [reportId, setReportId] = useState<string | null>(null);
  const lastReportRunIdRef = useRef<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!baseRunId) return;
      setIsLoading(true);
      setError(null);
      try {
        const res: any = await getRunResults(baseRunId);
        if (!mounted) return;
        setRaw(res);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || "결과 로딩 중 오류가 발생했습니다.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [baseRunId]);

  // 결과를 불러온 뒤 해당 runId 기준으로 리포트를 확인 (이미 있으면 사용, 없으면 생성하지 않음)
  useEffect(() => {
    const currentRunId = String((raw as any)?.run?.id ?? baseRunId ?? "");
    if (!currentRunId) return;
    if (lastReportRunIdRef.current === currentRunId) return;
    lastReportRunIdRef.current = currentRunId;
    setReportId(null);

    // sessionStorage에서 이전에 생성한 리포트 ID 확인
    const storageKey = `consure:reportId:${currentRunId}`;
    try {
      const savedReportId = window.sessionStorage.getItem(storageKey);
      if (savedReportId) {
        // 저장된 리포트 ID가 유효한지 확인
        fetchRunReport(currentRunId, savedReportId)
          .then(() => {
            setReportId(savedReportId);
          })
          .catch(() => {
            // 유효하지 않으면 삭제하고 새로 생성
            window.sessionStorage.removeItem(storageKey);
          });
        return;
      }
    } catch (e) {
      // sessionStorage 접근 실패 시 무시
    }

    // 리포트가 없으면 다운로드 버튼 클릭 시 생성하도록 함 (자동 생성하지 않음)
  }, [baseRunId, raw]);

  const downloadReport = async () => {
    const targetRunId = String((raw as any)?.run?.id ?? baseRunId ?? "");
    if (!targetRunId) {
      alert("유효한 실행 ID(runId)를 찾을 수 없습니다.");
      return;
    }
    try {
      // 리포트 ID가 없으면 생성
      let currentReportId = reportId;
      if (!currentReportId) {
        const storageKey = `consure:reportId:${targetRunId}`;
        try {
          const savedReportId = window.sessionStorage.getItem(storageKey);
          if (savedReportId) {
            // 저장된 리포트 ID가 유효한지 확인
            try {
              await fetchRunReport(targetRunId, savedReportId);
              currentReportId = savedReportId;
              setReportId(savedReportId);
            } catch {
              // 유효하지 않으면 삭제하고 새로 생성
              window.sessionStorage.removeItem(storageKey);
            }
          }
        } catch (e) {
          // sessionStorage 접근 실패 시 무시
        }

        // 여전히 리포트 ID가 없으면 새로 생성
        if (!currentReportId) {
          const res = await postRunReport(targetRunId);
          currentReportId = String(res.reportId);
          setReportId(currentReportId);
          // sessionStorage에 저장
          try {
            window.sessionStorage.setItem(storageKey, currentReportId);
          } catch (e) {
            // sessionStorage 저장 실패 시 무시
          }
        }
      }

      // 리포트 다운로드 정보 조회(GET)
      const result = await fetchRunReport(targetRunId, currentReportId);

      if (result.kind === "url") {
        // 서명 URL 등 직접 접근 가능한 경우 새 탭 열기
        window.open(result.url, "_blank", "noopener,noreferrer");
        return;
      }

      // blob 응답인 경우 클라이언트에서 저장
      const blobUrl = URL.createObjectURL(result.blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download =
        result.fileName ||
        `report_${baseRunId}${
          result.contentType?.includes("pdf") ? ".pdf" : ""
        }`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (e: any) {
      console.error(e);
      alert(e?.message || "리포트 다운로드에 실패했습니다.");
    }
  };

  const pageTitle: string =
    (raw?.doc?.name as string) ||
    (raw?.run?.id ? `Run #${raw.run.id}` : "분석 결과");
  const uploadedAt: string = formatKstDateTime(
    raw?.doc?.uploadedAt ? new Date(raw.doc.uploadedAt) : new Date()
  );

  // 섹션 데이터 매핑
  const {
    summaryText,
    summaryAnchors,
    riskItems,
    revisions,
    qaQuestion,
    qaAnswer,
    qaFocus,
    qaAnchors,
    hasSummary,
    hasRisk,
    hasRevision,
    hasQA,
  } = extractResultSections(raw);

  const onReanalyze = async () => {
    if (!baseRunId || isReanalyzing) return;
    setIsReanalyzing(true);
    try {
      const { runId } = await postRunRevision(baseRunId);
      // 간단 폴링: 완료될 때까지 N초 간격으로 재시도
      let attempts = 0;
      const maxAttempts = 300; // ~5분 (1s 간격)
      await new Promise<void>((resolve) => {
        const timer = window.setInterval(async () => {
          try {
            attempts += 1;
            const next = await getRunResults(runId);
            const status = (next as any)?.run?.status;
            if (status === "completed") {
              setRaw(next);
              window.clearInterval(timer);
              resolve();
            } else if (attempts >= maxAttempts) {
              window.clearInterval(timer);
              resolve();
            }
          } catch {
            // 일시 오류 무시하고 다음 틱
          }
        }, 1000);
      });
    } finally {
      setIsReanalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-primary-100 pt-10">
      <TopNavigation />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Title
          title={pageTitle}
          uploadDate={uploadedAt}
          onDownload={downloadReport}
        />

        {isLoading && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <p className="text-gray-600">결과를 불러오는 중입니다...</p>
          </div>
        )}
        {error && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}
        {!isLoading && !error && (
          <ResultsCard
            hasSummary={hasSummary}
            hasRisk={hasRisk}
            hasRevision={hasRevision}
            hasQA={hasQA}
            summaryText={summaryText}
            summaryAnchors={Array.isArray(summaryAnchors) ? summaryAnchors : []}
            riskItems={riskItems}
            revisions={revisions}
            qaQuestion={qaQuestion}
            qaAnswer={qaAnswer}
            qaFocus={qaFocus}
            qaAnchors={Array.isArray(qaAnchors) ? qaAnchors : []}
          />
        )}

        <Footer
          onReanalyze={baseRunId ? onReanalyze : undefined}
          isReanalyzing={isReanalyzing}
        />
      </main>
    </div>
  );
}
