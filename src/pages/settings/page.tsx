import { useState, useEffect } from "react";
import Header from "../_shared/layout/Header";
import Sidebar from "./components/Sidebar";
import Profile from "./components/Profile";
import Password from "./components/Password";
import Notification from "./components/Notification";
import Account from "./components/Account";
import Title from "./components/Title";
import { useAuth } from "../../contexts/AuthContext";

type TabType = "profile" | "password" | "notifications" | "account";

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isDirty, setIsDirty] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // AuthContext의 사용자 정보로 초기값 설정
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: (user as any).nickname ?? (user as any).name ?? "",
        email: user.email || "",
      }));
    }
  }, [user]);

  // 변경 사항 감지 (이름만 편집 가능)
  useEffect(() => {
    if (user) {
      const originalName = (user as any).nickname ?? (user as any).name ?? "";
      setIsDirty(formData.name !== originalName);
    } else {
      setIsDirty(false);
    }
  }, [formData.name, user]);

  const handleNotificationChange = (type: keyof typeof notifications) => {
    setNotifications({
      ...notifications,
      [type]: !notifications[type],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 여기에 실제 업데이트 로직 구현
    alert("설정이 저장되었습니다.");
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }
    // 여기에 비밀번호 변경 로직 구현
    alert("비밀번호가 변경되었습니다.");
    setFormData({
      ...formData,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleDeleteAccount = () => {
    if (
      confirm("정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")
    ) {
      // 여기에 계정 삭제 로직 구현
      alert("계정이 삭제되었습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-primary-100">
      <Header />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Title />

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex">
            {/* Sidebar */}
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Content */}
            <div className="flex-1 p-8">
              {activeTab === "profile" && (
                <Profile
                  formData={formData}
                  onInputChange={handleInputChange}
                  onSubmit={handleSubmit}
                  isDirty={isDirty}
                />
              )}

              {activeTab === "password" && (
                <Password
                  formData={formData}
                  onInputChange={handleInputChange}
                  onSubmit={handlePasswordChange}
                />
              )}

              {activeTab === "notifications" && (
                <Notification
                  notifications={notifications}
                  onNotificationChange={handleNotificationChange}
                />
              )}

              {activeTab === "account" && (
                <Account onDeleteAccount={handleDeleteAccount} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
