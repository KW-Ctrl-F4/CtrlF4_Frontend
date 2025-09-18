import { useState } from "react";
import Header from "../_shared/layout/Header";
import HistoryItem from "./components/HistoryItem";
import NoItem from "./components/NoItem";
import { HISTORY_ITEMS } from "../../mocks";
import Title from "./components/Title";

interface HistoryItem {
  id: string;
  title: string;
  uploadDate: string;
  description: string;
  fileCount: number;
  status: "completed" | "processing" | "failed";
}

export default function History() {
  // 더미 히스토리 데이터
  const [historyItems, setHistoryItems] =
    useState<HistoryItem[]>(HISTORY_ITEMS);

  const deleteHistoryItem = (id: string) => {
    if (confirm("이 분석 기록을 삭제하시겠습니까?")) {
      setHistoryItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const downloadReport = (item: HistoryItem) => {
    if (item.status !== "completed") {
      alert("분석이 완료된 후 다운로드할 수 있습니다.");
      return;
    }
    // 실제로는 파일 다운로드 로직
    alert(`${item.title} 리포트를 다운로드합니다.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-primary-100">
      <Header />

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

            {historyItems.length === 0 ? (
              <NoItem />
            ) : (
              <div className="space-y-4">
                {historyItems.map((item) => (
                  <HistoryItem
                    key={item.id}
                    title={item.title}
                    uploadDate={item.uploadDate}
                    description={item.description}
                    fileCount={item.fileCount}
                    status={item.status}
                    onDownload={() => downloadReport(item)}
                    onDelete={() => deleteHistoryItem(item.id)}
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
