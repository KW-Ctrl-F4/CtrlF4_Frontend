import { useState, useEffect, useRef } from "react";
import HistoryItem from "./components/HistoryItem";
import NoItem from "./components/NoItem";
import Title from "./components/Title";
import { useAuth } from "../../contexts/AuthContext";
import { dataAPI, type HistoryItem as ApiHistoryItem } from "../../hooks/data";
import TopNavigation from "../_shared/components/TopNavigation";
import { postRunReport, fetchRunReport } from "../../lib/api/client";

interface HistoryItem {
  s3_key: string;
  runId: string;
  title: string;
  uploadDate: string;
  description: string;
  fileCount: number;
}

export default function History() {
  const { accessToken } = useAuth();
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportIds, setReportIds] = useState<Record<string, string>>({});
  const lastReportRunIdsRef = useRef<Set<string>>(new Set());

  // API에서 히스토리 데이터 가져오기
  useEffect(() => {
    const fetchHistory = async () => {
      if (!accessToken) {
        setIsLoading(false);
        setError("로그인이 필요합니다.");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await dataAPI.getHistory(accessToken);

        if (response.success && response.data) {
          // API 응답을 UI 형식으로 변환
          const transformedItems: HistoryItem[] = response.data.history.map(
            (item: ApiHistoryItem) => ({
              s3_key: item.s3_key,
              runId: item.run_id,
              title: item.title,
              uploadDate: new Date().toLocaleDateString(),
              description: item.summary_line,
              fileCount: 1,
            })
          );
          setHistoryItems(transformedItems);
        } else {
          setError(response.message || "히스토리를 불러오는데 실패했습니다.");

          // 401 에러인 경우 로그인 페이지로 리다이렉트
          if (response.error === "UNAUTHORIZED") {
            alert("세션이 만료되었습니다. 다시 로그인해주세요.");
            window.location.href = "/signin";
          }
        }
      } catch (err) {
        setError("히스토리를 불러오는 중 오류가 발생했습니다.");
        console.error("History fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [accessToken]);

  const deleteHistoryItem = async (runId: string) => {
    if (!confirm("이 분석 기록을 삭제하시겠습니까?")) {
      return;
    }

    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await dataAPI.deleteHistory(accessToken, runId);

      if (response.success) {
        // 삭제 성공 시 UI에서 해당 항목 제거
        setHistoryItems((prev) => prev.filter((item) => item.runId !== runId));
        alert(response.message || "히스토리가 삭제되었습니다.");
      } else {
        // 에러 처리
        if (response.error === "UNAUTHORIZED") {
          alert("세션이 만료되었습니다. 다시 로그인해주세요.");
          window.location.href = "/signin";
        } else if (response.error === "NOT_FOUND") {
          alert("해당 히스토리를 찾을 수 없습니다.");
          // 히스토리 목록 다시 불러오기
          window.location.reload();
        } else {
          alert(response.message || "히스토리 삭제에 실패했습니다.");
        }
      }
    } catch (err) {
      console.error("Delete history error:", err);
      alert("히스토리 삭제 중 오류가 발생했습니다.");
    }
  };

  // 히스토리 아이템별 리포트 생성 (다운로드 시 필요하면 생성)
  const ensureReportId = async (runId: string): Promise<string | null> => {
    // 이미 생성된 리포트 ID가 있으면 반환
    if (reportIds[runId]) {
      return reportIds[runId];
    }

    // 이미 생성 요청이 진행 중이면 대기
    if (lastReportRunIdsRef.current.has(runId)) {
      return null;
    }

    // 리포트 생성 요청
    lastReportRunIdsRef.current.add(runId);
    try {
      const res = await postRunReport(runId);
      const reportId = String(res.reportId);
      setReportIds((prev) => ({ ...prev, [runId]: reportId }));
      return reportId;
    } catch (e) {
      console.error("Report generation error:", e);
      lastReportRunIdsRef.current.delete(runId);
      return null;
    }
  };

  const downloadReport = async (item: HistoryItem) => {
    const targetRunId = item.runId;
    if (!targetRunId) {
      alert("유효한 실행 ID(runId)를 찾을 수 없습니다.");
      return;
    }

    try {
      // 리포트 ID 확보 (없으면 생성)
      let reportId = reportIds[targetRunId];
      if (!reportId) {
        const newReportId = await ensureReportId(targetRunId);
        if (!newReportId) {
          alert("리포트를 생성 중입니다. 잠시 후 다시 시도해주세요.");
          return;
        }
        reportId = newReportId;
      }

      // 리포트 다운로드 정보 조회(GET)
      const result = await fetchRunReport(targetRunId, reportId);

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
        `report_${targetRunId}${
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-primary-100">
      <TopNavigation />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Title />

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                전체 분석 기록
              </h2>
              <span className="text-sm text-gray-500">
                총 {historyItems.length}개
              </span>
            </div>

            {/* 로딩 상태 */}
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-600">
                  히스토리를 불러오는 중...
                </span>
              </div>
            ) : error ? (
              /* 에러 상태 */
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-error-warning-line text-red-600 text-2xl"></i>
                </div>
                <p className="text-gray-600">{error}</p>
              </div>
            ) : historyItems.length === 0 ? (
              /* 빈 상태 */
              <NoItem />
            ) : (
              /* 히스토리 목록 */
              <div className="space-y-4">
                {historyItems.map((item) => (
                  <HistoryItem
                    key={item.runId}
                    s3_key={item.s3_key}
                    title={item.title}
                    uploadDate={item.uploadDate}
                    description={item.description}
                    fileCount={item.fileCount}
                    onDownload={() => downloadReport(item)}
                    onDelete={() => deleteHistoryItem(item.runId)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
