import { Link } from "react-router-dom";

export default function EmailSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Header */}
        <Link to="/" className="inline-flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <i className="ri-search-line text-white text-xl"></i>
          </div>
          <span className="text-2xl font-bold text-gray-900">CtrlF4</span>
        </Link>

        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="ri-check-line text-green-600 text-2xl"></i>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">인증 성공!</h1>
        <p className="text-gray-600 mb-8">
          이메일 인증이 성공적으로 완료되었습니다.
          <br />
          페이지를 나가도 좋습니다.
        </p>

        <div className="space-y-4">
          <Link
            to="/signin"
            className="block w-full py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer whitespace-nowrap text-center"
          >
            로그인하기
          </Link>

          <Link
            to="/"
            className="block w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap text-center"
          >
            홈으로 이동
          </Link>
        </div>
      </div>
    </div>
  );
}
