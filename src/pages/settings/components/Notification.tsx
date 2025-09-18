interface NotificationProps {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  onNotificationChange: (type: "email" | "push" | "sms") => void;
}

export default function Notification({
  notifications,
  onNotificationChange,
}: NotificationProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">알림 설정</h2>
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">이메일 알림</h3>
            <p className="text-sm text-gray-600">
              분석 완료 및 중요 업데이트를 이메일로 받습니다
            </p>
          </div>
          <button
            onClick={() => onNotificationChange("email")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
              notifications.email ? "bg-[rgb(255, 98, 26)]" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notifications.email ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">푸시 알림</h3>
            <p className="text-sm text-gray-600">
              브라우저 푸시 알림을 받습니다
            </p>
          </div>
          <button
            onClick={() => onNotificationChange("push")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
              notifications.push ? "bg-[rgb(255, 98, 26)]" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notifications.push ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">SMS 알림</h3>
            <p className="text-sm text-gray-600">
              중요한 알림을 문자로 받습니다
            </p>
          </div>
          <button
            onClick={() => onNotificationChange("sms")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
              notifications.sms ? "bg-[rgb(255, 98, 26)]" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notifications.sms ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
