interface HistoryItemProps {
  title: string;
  uploadDate: string;
  description: string;
  fileCount: number;
  status: "completed" | "processing" | "failed";
  onDownload: () => void;
  onDelete: () => void;
}

export default function HistoryItem({
  title,
  uploadDate,
  description,
  fileCount,
  status,
  onDownload,
  onDelete,
}: HistoryItemProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                status === "completed"
                  ? "bg-green-100 text-green-800"
                  : status === "processing"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {status === "completed" && <i className="ri-check-line mr-1"></i>}
              {status === "processing" && (
                <i className="ri-loader-4-line mr-1 animate-spin"></i>
              )}
              {status === "failed" && <i className="ri-close-line mr-1"></i>}
              {status === "completed"
                ? "완료"
                : status === "processing"
                ? "분석중"
                : "실패"}
            </span>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            <span className="flex items-center">
              <i className="ri-calendar-line mr-1"></i>
              {uploadDate}
            </span>
            <span className="flex items-center">
              <i className="ri-file-line mr-1"></i>
              {fileCount}개 파일
            </span>
          </div>

          <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={onDownload}
            disabled={status !== "completed"}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              status === "completed"
                ? "text-primary-600 hover:bg-primary-50"
                : "text-gray-400 cursor-not-allowed"
            }`}
            title="리포트 다운로드"
          >
            <i className="ri-download-line text-lg"></i>
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="삭제"
          >
            <i className="ri-delete-bin-line text-lg"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
