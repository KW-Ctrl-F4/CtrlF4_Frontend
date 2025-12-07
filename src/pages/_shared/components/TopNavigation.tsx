import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

export default function TopNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // 홈페이지에서만 스크롤 감지
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    if (!isHomePage) {
      setIsVisible(true);
      return;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 스크롤이 랜딩 화면 높이(100vh) 이상 내려가면 숨김
      const shouldHide = currentScrollY > window.innerHeight * 0.8;

      // 맨 위로 돌아오면 표시
      if (currentScrollY < 100) {
        setIsVisible(true);
      } else if (shouldHide && currentScrollY > lastScrollY) {
        // 아래로 스크롤할 때 숨김
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // 위로 스크롤할 때 표시
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage, lastScrollY]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`fixed top-4 right-4 z-50 flex items-center gap-2 transition-all duration-500 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-4 pointer-events-none"
      }`}
    >
      <button
        onClick={() => navigate("/")}
        className={`px-4 py-2 rounded-lg transition-all duration-200 shadow-md text-sm font-medium ${
          isActive("/")
            ? "bg-primary-600 text-white hover:bg-primary-700"
            : "bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white hover:text-primary-600"
        }`}
        title="홈"
      >
        <i className="ri-home-line mr-1"></i>
        Home
      </button>
      {isAuthenticated && (
        <>
          <button
            onClick={() => navigate("/history")}
            className={`px-4 py-2 rounded-lg transition-all duration-200 shadow-md text-sm font-medium ${
              isActive("/history")
                ? "bg-primary-600 text-white hover:bg-primary-700"
                : "bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white hover:text-primary-600"
            }`}
            title="히스토리"
          >
            <i className="ri-history-line mr-1"></i>
            History
          </button>
          <button
            onClick={() => navigate("/settings")}
            className={`px-4 py-2 rounded-lg transition-all duration-200 shadow-md text-sm font-medium ${
              isActive("/settings")
                ? "bg-primary-600 text-white hover:bg-primary-700"
                : "bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white hover:text-primary-600"
            }`}
            title="설정"
          >
            <i className="ri-settings-line mr-1"></i>
            Settings
          </button>
        </>
      )}
      <a
        href="https://consure.notion.site/"
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-700 rounded-lg hover:bg-white hover:text-primary-600 transition-all duration-200 shadow-md text-sm font-medium"
        title="도움말"
      >
        <i className="ri-question-line mr-1"></i>
        Help
      </a>
      {isAuthenticated ? (
        <button
          onClick={logout}
          className="px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-700 rounded-lg hover:bg-white hover:text-red-600 transition-all duration-200 shadow-md text-sm font-medium"
          title="로그아웃"
        >
          <i className="ri-logout-box-line mr-1"></i>
          Logout
        </button>
      ) : (
        <button
          onClick={() => navigate("/signin")}
          className="px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-700 rounded-lg hover:bg-white hover:text-primary-600 transition-all duration-200 shadow-md text-sm font-medium"
          title="로그인"
        >
          <i className="ri-login-box-line mr-1"></i>
          Sign In
        </button>
      )}
    </nav>
  );
}
