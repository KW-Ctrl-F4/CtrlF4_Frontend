interface TitleProps {
  title: string;
  uploadDate: string;
  activeTab: "summary" | "risks" | "suggestions";
  onTabChange: (tab: "summary" | "risks" | "suggestions") => void;
  onDownload: () => void;
  onShare: () => void;
}

export default function Title({
  title,
  uploadDate,
  activeTab,
  onTabChange,
  onDownload,
  onShare,
}: TitleProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600">업로드: {uploadDate}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onDownload}
            className="flex items-center px-4 py-2 bg-[rgb(255, 98, 26)] text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-download-line mr-2"></i>
            리포트 다운로드
          </button>
          <button
            onClick={onShare}
            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-share-line mr-2"></i>
            공유하기
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => onTabChange("summary")}
            className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer whitespace-nowrap ${
              activeTab === "summary"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            주요 조항 요약
          </button>
          <button
            onClick={() => onTabChange("risks")}
            className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer whitespace-nowrap ${
              activeTab === "risks"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            위험 요소 분석
          </button>
          <button
            onClick={() => onTabChange("suggestions")}
            className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer whitespace-nowrap ${
              activeTab === "suggestions"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            개선 제안사항
          </button>
        </nav>
      </div>
    </div>
  );
}
