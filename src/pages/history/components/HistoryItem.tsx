import { useNavigate } from "react-router-dom";

interface HistoryItemProps {
  s3_key: string;
  title: string;
  uploadDate: string;
  description: string;
  fileCount: number;
  runId: string;
  onDownload: () => void;
  onDelete: () => void;
}

export default function HistoryItem({
  s3_key,
  title,
  uploadDate,
  description,
  fileCount,
  runId,
  onDownload,
  onDelete,
}: HistoryItemProps) {
  const navigate = useNavigate();

  return (
    <div
      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
      onClick={() => navigate("/result", { state: { runId } })}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
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
            onClick={(e) => {
              e.stopPropagation();
              onDownload();
            }}
            className="p-2 rounded-lg transition-colors cursor-pointer text-primary-600 hover:bg-primary-50"
            title="리포트 다운로드"
          >
            <i className="ri-download-line text-lg"></i>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
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
