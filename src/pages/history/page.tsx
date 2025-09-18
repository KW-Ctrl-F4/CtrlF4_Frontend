import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../_shared/layout/Header";
import { HISTORY_ITEMS } from "../../mocks";

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            분석 히스토리
          </h1>
          <p className="text-gray-600">
            업로드한 계약서들의 분석 기록을 확인하세요
          </p>
        </div>

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
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <i className="ri-file-text-line text-2xl text-gray-400"></i>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  분석 기록이 없습니다
                </h3>
                <p className="text-gray-600 mb-6">
                  첫 번째 계약서를 업로드해보세요
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-upload-line mr-2"></i>
                  계약서 업로드
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {historyItems.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.title}
                          </h3>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : item.status === "processing"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.status === "completed" && (
                              <i className="ri-check-line mr-1"></i>
                            )}
                            {item.status === "processing" && (
                              <i className="ri-loader-4-line mr-1 animate-spin"></i>
                            )}
                            {item.status === "failed" && (
                              <i className="ri-close-line mr-1"></i>
                            )}
                            {item.status === "completed"
                              ? "완료"
                              : item.status === "processing"
                              ? "분석중"
                              : "실패"}
                          </span>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center">
                            <i className="ri-calendar-line mr-1"></i>
                            {item.uploadDate}
                          </span>
                          <span className="flex items-center">
                            <i className="ri-file-line mr-1"></i>
                            {item.fileCount}개 파일
                          </span>
                        </div>

                        <p className="text-gray-700 text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => downloadReport(item)}
                          disabled={item.status !== "completed"}
                          className={`p-2 rounded-lg transition-colors cursor-pointer ${
                            item.status === "completed"
                              ? "text-primary-600 hover:bg-primary-50"
                              : "text-gray-400 cursor-not-allowed"
                          }`}
                          title="리포트 다운로드"
                        >
                          <i className="ri-download-line text-lg"></i>
                        </button>
                        <button
                          onClick={() => deleteHistoryItem(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="삭제"
                        >
                          <i className="ri-delete-bin-line text-lg"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
