import { formatKstDateTime } from "../../../lib/date";

interface TitleProps {
  title: string;
  uploadDate: string;
  onDownload: () => void;
}

export default function Title({ title, uploadDate, onDownload }: TitleProps) {
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
    </div>
  );
}
