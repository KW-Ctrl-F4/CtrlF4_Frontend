import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

export default function EmailVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<
    "pending" | "success" | "failed" | "expired"
  >("pending");
  const [isLoading, setIsLoading] = useState(true);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const token = searchParams.get("token");
  const email = searchParams.get("email") || "user@example.com";
  const forcedStatus = searchParams.get("status") as
    | "success"
    | "failed"
    | "expired"
    | null;

  useEffect(() => {
    if (token) {
      // 토큰이 있으면 인증 처리
      verifyEmail(token);
    } else {
      // 토큰이 없으면 이메일 발송 대기 상태
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, token]);

  const verifyEmail = async (_verificationToken: string) => {
    setIsLoading(true);

    // 쿼리 파라미터로 상태를 직접 지정 (테스트용)
    if (forcedStatus) {
      setTimeout(() => {
        setStatus(forcedStatus);
        setIsLoading(false);
      }, 500);
      return;
    }
  };

  const resendEmail = () => {
    setCountdown(60);
    setCanResend(false);
    // 이메일 재발송 로직
    setTimeout(() => {
      alert("인증 이메일이 재발송되었습니다.");
    }, 500);
  };

  const goToLogin = () => {
    navigate("/signin");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-primary-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="ri-loader-4-line text-primary-600 text-2xl animate-spin"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            인증 처리 중...
          </h1>
          <p className="text-gray-600">잠시만 기다려주세요.</p>
        </div>
      </div>
    );
  }

  // 이메일 발송 대기 상태 (토큰이 없을 때)
  if (!token) {
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
            <span className="font-medium text-primary-600">{email}</span>로
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
            <button
              onClick={resendEmail}
              disabled={!canResend}
              className={`w-full py-3 px-4 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                canResend
                  ? "bg-primary-600 text-white hover:bg-primary-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {canResend ? "이메일 재발송" : `재발송 가능 (${countdown}초)`}
            </button>

            <Link
              to="/signin"
              className="block w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap text-center"
            >
              로그인 페이지로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 인증 성공
  if (status === "success") {
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

          <h1 className="text-2xl font-bold text-gray-900 mb-4">인증 완료!</h1>
          <p className="text-gray-600 mb-8">
            이메일 인증이 성공적으로 완료되었습니다.
            <br />
            이제 모든 서비스를 이용하실 수 있습니다.
          </p>

          <div className="space-y-4">
            <button
              onClick={goToLogin}
              className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              로그인하기
            </button>

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

  // 인증 실패
  if (status === "failed") {
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
            <button
              onClick={resendEmail}
              className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              새 인증 이메일 발송
            </button>

            <Link
              to="/signup"
              className="block w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap text-center"
            >
              회원가입 다시하기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 인증 만료
  if (status === "expired") {
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

          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="ri-time-line text-yellow-600 text-2xl"></i>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            링크가 만료되었습니다
          </h1>
          <p className="text-gray-600 mb-6">
            인증 링크의 유효시간이 지났습니다.
            <br />
            새로운 인증 이메일을 요청해주세요.
          </p>

          <div className="bg-yellow-50 p-4 rounded-lg mb-6">
            <p className="text-yellow-800 text-sm">
              <i className="ri-information-line mr-2"></i>
              인증 링크는 24시간 동안만 유효합니다.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={resendEmail}
              className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              새 인증 이메일 발송
            </button>

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

  return null;
}
