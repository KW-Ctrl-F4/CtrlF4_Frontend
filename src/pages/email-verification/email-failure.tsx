import { Link } from "react-router-dom";

export default function EmailFailure() {
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

        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="ri-close-line text-red-600 text-2xl"></i>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">인증 실패</h1>
        <p className="text-gray-600 mb-6">
          이메일 인증에 실패했습니다.
          <br />
          잘못된 링크이거나 이미 사용된 링크입니다.
        </p>

        <div className="bg-red-50 p-4 rounded-lg mb-6">
          <p className="text-red-800 text-sm">
            <i className="ri-error-warning-line mr-2"></i>
            문제가 지속되면 고객지원팀에 문의해주세요.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/signup"
            className="block w-full py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer whitespace-nowrap text-center"
          >
            회원가입 다시하기
          </Link>

          <Link
            to="/signin"
            className="block w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap text-center"
          >
            로그인 페이지로 이동
          </Link>
        </div>
      </div>
    </div>
  );
}
