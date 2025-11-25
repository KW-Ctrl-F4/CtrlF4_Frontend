interface SessionProgressProps {
  progress: number;
  availableWorkers?: string[];
  workerStatuses?: Record<string, "pending" | "running" | "done">;
  attempt?: number | null;
  title?: string;
  description?: string;
}

export default function SessionProgress({
  progress,
  availableWorkers,
  workerStatuses,
  attempt,
  title = "세션 실행 중...",
  description = "AI가 답변/요약/검증/위험 요소 점검 단계를 수행하고 있습니다. 잠시만 기다려주세요.",
}: SessionProgressProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));
  const computedDescription =
    typeof attempt === "number" && attempt >= 2
      ? "좀 더 나은 분석을 위해 재분석 중입니다. 잠시만 기다려주세요."
      : description;
  const toLabel = (w: string) => {
    if (w === "qa") return "답변 생성";
    if (w === "summarizer") return "요약 생성";
    if (w === "verifier") return "검증";
    if (w === "risk") return "위험 요소 점검";
    return w;
  };
  const discoveredWorkers = (availableWorkers || []).length > 0
    ? (availableWorkers as string[])
    : Object.keys(workerStatuses || {});
  const workers = discoveredWorkers.length > 0
    ? discoveredWorkers
    : ["qa", "summarizer", "verifier"];
  const steps = workers.map((w: string) => ({
    id: w,
    label: toLabel(w),
    status: (workerStatuses || {})[w] || "pending",
  }));
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center">
          <i className="ri-robot-line text-3xl text-primary-600 animate-pulse"></i>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>

        <p className="text-gray-600 mb-8">{computedDescription}</p>

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


