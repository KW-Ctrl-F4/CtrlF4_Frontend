import { formatKstDateTime } from "../../../lib/date";

interface TitleProps {
  title: string;
  uploadDate: string;
  activeTab?: "summary" | "risks" | "suggestions";
  onTabChange?: (tab: "summary" | "risks" | "suggestions") => void;
  sections?: { key: "summary" | "risk" | "revision" | "qa"; label: string }[];
  onSectionClick?: (key: "summary" | "risk" | "revision" | "qa") => void;
  onDownload: () => void;
}

export default function Title({
  title,
  uploadDate,
  activeTab,
  onTabChange,
  sections,
  onSectionClick,
  onDownload,
}: TitleProps) {
  // 한국시간 기준 YYYY-MM-DD HH:mm 표시
  const displayDate = formatKstDateTime(uploadDate);
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600">업로드: {displayDate}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onDownload}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-download-line mr-2"></i>
            리포트 다운로드
          </button>
        </div>
      </div>

      {/* 섹션 앵커 네비게이션 (있을 때만) */}
      {Array.isArray(sections) && sections.length > 0 && onSectionClick && (
        <div className="border-b border-gray-200">
          <nav className="flex flex-wrap gap-6">
            {sections.map((s) => (
              <button
                key={s.key}
                onClick={() => onSectionClick(s.key)}
                className="py-3 px-1 text-sm font-medium text-gray-600 hover:text-primary-700 cursor-pointer whitespace-nowrap"
              >
                {s.label}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Tabs (optional, 구형 UI 호환) */}
      {activeTab && onTabChange && (
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
      )}
    </div>
  );
}
