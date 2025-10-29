import { useState, useEffect } from "react";
import Header from "../_shared/layout/Header";
import Sidebar from "./components/Sidebar";
import Profile from "./components/Profile";
import Password from "./components/Password";
import Notification from "./components/Notification";
import Account from "./components/Account";
import Title from "./components/Title";
import { useAuth } from "../../contexts/AuthContext";
import { authAPI } from "../../hooks/auth";
import DeleteAccountModal from "./components/DeleteAccountModal";

type TabType = "profile" | "password" | "notifications" | "account";

export default function Settings() {
  const { user, accessToken, login } = useAuth();
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
      alert("인증 정보가 없습니다. 다시 로그인해주세요.");
      return;
    }

    setIsUpdatingProfile(true);
    try {
      const res = await authAPI.updateNickname({
        nickname: formData.name.trim(),
        accessToken,
      });

      if (res.success) {
        // Context의 사용자 정보 갱신 (토큰은 유지)
        if (user) {
          login(accessToken, {
            nickname: res.data?.nickname ?? formData.name.trim(),
            email: user.email,
          });
        }
        alert(res.message || "설정이 저장되었습니다.");
      } else {
        alert(res.message || "닉네임 변경에 실패했습니다.");
      }
    } catch (error) {
      alert("닉네임 변경 중 오류가 발생했습니다.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.currentPassword.trim()) {
      alert("현재 비밀번호를 입력해주세요.");
      return;
    }

    if (!formData.newPassword.trim()) {
      alert("새 비밀번호를 입력해주세요.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!accessToken) {
      alert("인증 정보가 없습니다. 다시 로그인해주세요.");
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await authAPI.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        accessToken,
      });

      if (res.success) {
        alert(res.message || "비밀번호가 변경되었습니다.");
        setFormData({
          ...formData,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        alert(res.message || "비밀번호 변경에 실패했습니다.");
      }
    } catch (error) {
      alert("비밀번호 변경 중 오류가 발생했습니다.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (password: string) => {
    if (!accessToken) {
      alert("인증 정보가 없습니다. 다시 로그인해주세요.");
      return;
    }

    setIsDeleting(true);
    try {
      const res = await authAPI.deleteAccount({
        password,
        accessToken,
      });

      if (res.success) {
        alert(res.message || "계정이 삭제되었습니다.");
        // 로그아웃 처리 (AuthContext의 logout이 홈으로 리다이렉트)
        window.location.href = "/";
      } else {
        alert(res.message || "계정 삭제에 실패했습니다.");
      }
    } catch (error) {
      alert("계정 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
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
                  isLoading={isUpdatingProfile}
                />
              )}

              {activeTab === "password" && (
                <Password
                  formData={formData}
                  onInputChange={handleInputChange}
                  onSubmit={handlePasswordChange}
                  isLoading={isChangingPassword}
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

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
