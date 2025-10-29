import { useState } from "react";
import { Link } from "react-router-dom";
import { authAPI } from "../../hooks/auth";

export default function SignUp() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!formData.agreeToTerms) {
      alert("이용약관에 동의해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      // 회원가입 API 호출
      const response = await authAPI.signup({
        email: formData.email,
        password: formData.password,
      });

      if (response.success) {
        // 회원가입 성공 시 이메일 전송 완료 상태로 변경
        setIsLoading(false);
        setEmailSent(true);
      } else {
        // 회원가입 실패 시 에러 메시지 표시
        setIsLoading(false);
        alert(response.message || "회원가입에 실패했습니다.");
      }
    } catch (error) {
      setIsLoading(false);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  // 이메일 전송 완료 상태일 때 보여줄 컴포넌트
  if (emailSent) {
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

          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="ri-mail-send-line text-primary-600 text-2xl"></i>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            이메일을 확인해주세요
          </h1>
          <p className="text-gray-600 mb-6">
            <span className="font-medium text-primary-600">
              {formData.email}
            </span>
            로
            <br />
            인증 링크를 발송했습니다.
          </p>

          <div className="bg-primary-50 p-4 rounded-lg mb-6">
            <p className="text-primary-800 text-sm">
              <i className="ri-information-line mr-2"></i>
              이메일이 도착하지 않았다면 스팸함을 확인해주세요.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              to="/signin"
              className="block w-full py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer whitespace-nowrap text-center"
            >
              로그인 페이지로 이동
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <i className="ri-search-line text-white text-xl"></i>
            </div>
            <span className="text-2xl font-bold text-gray-900">CtrlF4</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">회원가입</h1>
          <p className="text-gray-600">새 계정을 만들어 시작하세요</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              이메일 주소
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="이메일을 입력하세요"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              비밀번호 확인
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="비밀번호를 다시 입력하세요"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="agreeToTerms"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              required
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label
              htmlFor="agreeToTerms"
              className="ml-2 text-sm text-gray-600 cursor-pointer"
            >
              <Link
                to="#"
                className="text-primary-600 hover:text-primary-700 cursor-pointer"
              >
                이용약관
              </Link>
              에 동의합니다
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              isLoading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-primary-600 text-white hover:bg-primary-700"
            }`}
          >
            {isLoading ? (
              <>
                <i className="ri-loader-4-line mr-2 animate-spin"></i>
                가입 중...
              </>
            ) : (
              "회원가입"
            )}
          </button>
        </form>

        {/* Sign in link */}
        <p className="mt-8 text-center text-sm text-gray-600">
          이미 계정이 있으신가요?{" "}
          <Link
            to="/signin"
            className="text-primary-600 hover:text-primary-700 font-medium cursor-pointer whitespace-nowrap"
          >
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
