import { Link } from "react-router-dom";

export default function NoItem() {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <i className="ri-file-text-line text-2xl text-gray-400"></i>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        분석 기록이 없습니다
      </h3>
      <p className="text-gray-600 mb-6">첫 번째 계약서를 업로드해보세요</p>
      <Link
        to="/"
        className="inline-flex items-center px-4 py-2 bg-[rgb(255, 98, 26)] text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer whitespace-nowrap"
      >
        <i className="ri-upload-line mr-2"></i>
        계약서 업로드
      </Link>
    </div>
  );
}
