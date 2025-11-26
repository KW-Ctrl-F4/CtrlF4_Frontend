import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../_shared/layout/Header";
import Title from "./components/Title";
import Footer from "./components/Footer";
import { formatKstDateTime } from "../../lib/date";
import { getRunResults, postRunRevision } from "../../lib/api/client";
import ResultsCard from "./components/ResultsCard";
import { extractResultSections } from "./utils";

export default function Result() {
  const location = useLocation();
  const baseRunId: string | undefined =
    (location.state as any)?.runId ||
    (() => {
      try {
        return window.sessionStorage.getItem("ctrlf4:lastRunId") || undefined;
      } catch {
        return undefined;
      }
    })();
  const [raw, setRaw] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isReanalyzing, setIsReanalyzing] = useState<boolean>(false);

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

  const downloadReport = () => {
    alert("분석 리포트를 다운로드합니다.");
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-primary-100">
      <Header />

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
