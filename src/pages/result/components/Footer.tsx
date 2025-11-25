import { Link } from "react-router-dom";

interface FooterProps {
  onReanalyze?: () => void;
  isReanalyzing?: boolean;
}

export default function Footer({ onReanalyze, isReanalyzing = false }: FooterProps) {
  return (
    <div className="mt-8 flex justify-center space-x-4">
      {onReanalyze && (
        <button
          onClick={onReanalyze}
          disabled={isReanalyzing}
          className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap"
        >
          {isReanalyzing ? (
            <>
              <i className="ri-loader-4-line mr-2 animate-spin"></i>
              재분석 중...
            </>
          ) : (
            <>
              <i className="ri-refresh-line mr-2"></i>
              다시 분석하기
            </>
          )}
        </button>
      )}
      <Link
        to="/history"
        className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer whitespace-nowrap"
      >
        <i className="ri-history-line mr-2"></i>
        분석 기록 보기
      </Link>
    </div>
  );
}
