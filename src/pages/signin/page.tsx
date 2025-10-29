import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../../hooks/auth";
import { useAuth } from "../../contexts/AuthContext";

export default function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 로그인 API 호출
      const response = await authAPI.signin({
        email: formData.email,
        password: formData.password,
      });

      if (response.success && response.data.access_token) {
        // 백엔드에서 반환한 email, nickname을 사용해 사용자 구성
        const userFromResponse = {
          nickname: response.data.nickname || "",
          email: response.data.email || formData.email,
        };

        // Context에 토큰과 사용자 정보 저장
        login(response.data.access_token, userFromResponse);
        // 로그인 성공 시 홈으로 이동
        navigate("/");
      } else {
        // 로그인 실패 시 에러 메시지 표시
        setError(response.message || "로그인에 실패했습니다.");
      }
    } catch (error) {
      setError("로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">로그인</h1>
          <p className="text-gray-600">계정에 로그인하여 계속하세요</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

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

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 text-sm text-gray-600 cursor-pointer"
              >
                로그인 상태 유지
              </label>
            </div>
            <Link
              to="#"
              className="text-sm text-primary-600 hover:text-primary-700 cursor-pointer whitespace-nowrap"
            >
              비밀번호 찾기
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center ${
              isLoading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-primary-600 text-white hover:bg-primary-700"
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                로그인 중...
              </>
            ) : (
              "로그인"
            )}
          </button>
        </form>

        {/* Sign up link */}
        <p className="mt-8 text-center text-sm text-gray-600">
          계정이 없으신가요?{" "}
          <Link
            to="/signup"
            className="text-primary-600 hover:text-primary-700 font-medium cursor-pointer whitespace-nowrap"
          >
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
