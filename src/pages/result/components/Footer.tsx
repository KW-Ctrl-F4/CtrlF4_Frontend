import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className="mt-8 flex justify-center space-x-4">
      <Link
        to="/"
        className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
      >
        <i className="ri-arrow-left-line mr-2"></i>
        새로운 분석
      </Link>
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
