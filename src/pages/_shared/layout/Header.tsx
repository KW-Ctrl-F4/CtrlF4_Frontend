import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div
            className="flex items-center space-x-4 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <i className="ri-search-line text-white text-lg"></i>
            </div>
            <span className="text-xl font-semibold text-gray-900">CtrlF4</span>
          </div>
          <div className="flex items-center space-x-6">
            {!isAuthenticated ? (
              <NavLink
                to="/signin"
                className={({ isActive }) =>
                  `cursor-pointer whitespace-nowrap transition-colors duration-200 ${
                    isActive
                      ? "text-primary-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`
                }
              >
                Sign In
              </NavLink>
            ) : (
              <>
                <NavLink
                  to="/history"
                  className={({ isActive }) =>
                    `cursor-pointer whitespace-nowrap transition-colors duration-200 ${
                      isActive
                        ? "text-primary-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`
                  }
                >
                  History
                </NavLink>
                <NavLink
                  to="/settings"
                  className={({ isActive }) =>
                    `cursor-pointer whitespace-nowrap transition-colors duration-200 ${
                      isActive
                        ? "text-primary-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`
                  }
                >
                  Settings
                </NavLink>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={logout}
                    className="text-gray-600 hover:text-gray-900 cursor-pointer whitespace-nowrap transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
            <button className="text-gray-600 hover:text-gray-900 cursor-pointer whitespace-nowrap transition-colors duration-200">
              Help
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
