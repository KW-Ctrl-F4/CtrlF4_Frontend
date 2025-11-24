interface WorkerStep {
  id: string;
  label: string;
  status: "pending" | "running" | "done";
}

interface SessionProgressProps {
  progress: number;
  steps: WorkerStep[];
  title?: string;
  description?: string;
}

export default function SessionProgress({
  progress,
  steps,
  title = "세션 실행 중...",
  description = "AI가 질의응답/요약/검증 단계를 수행하고 있습니다. 잠시만 기다려주세요.",
}: SessionProgressProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center">
          <i className="ri-robot-line text-3xl text-primary-600 animate-pulse"></i>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>

        <p className="text-gray-600 mb-8">{description}</p>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>진행률</span>
            <span>{Math.round(clampedProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-4 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${clampedProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Dynamic Progress Steps */}
        <div className="max-w-lg mx-auto">
          <div className="space-y-3">
            {steps.map((step) => {
              const isDone = step.status === "done";
              const isRunning = step.status === "running";
              return (
                <div
                  key={step.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    isDone ? "bg-green-50 text-green-800" : "bg-gray-50 text-gray-600"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isDone ? "bg-green-200" : "bg-gray-200"
                    }`}
                  >
                    {isDone ? (
                      <i className="ri-check-line text-sm"></i>
                    ) : (
                      <i className={`ri-loader-4-line text-sm ${isRunning ? "animate-spin" : ""}`}></i>
                    )}
                  </div>
                  <span className="text-sm font-medium">{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}


