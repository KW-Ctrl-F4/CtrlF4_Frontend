type TabType = "profile" | "password" | "notifications" | "account";

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const menuItems: Array<{ id: TabType; label: string; icon: string }> = [
    {
      id: "profile",
      label: "프로필",
      icon: "ri-user-line",
    },
    {
      id: "password",
      label: "비밀번호",
      icon: "ri-lock-line",
    },
    {
      id: "notifications",
      label: "알림",
      icon: "ri-notification-line",
    },
    {
      id: "account",
      label: "계정",
      icon: "ri-settings-line",
    },
  ];

  return (
    <div className="w-64 bg-gray-50 p-6">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === item.id
                ? "bg-primary-100 text-primary-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <i className={`${item.icon} mr-3`}></i>
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
