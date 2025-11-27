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
  title = "분석 중이에요!",
  description = "AI가 열심히 분석하고 있어요. 조금만 기다려주세요!",
}: SessionProgressProps) {
  const computedDescription =
    typeof attempt === "number" && attempt >= 2
      ? "더 깊이 파고들고 있어요. 조금만 더 기다려주세요!"
      : description;
  const toLabel = (w: string) => {
    if (w === "qa") return "답변 생성";
    if (w === "summarizer") return "요약 생성";
    if (w === "verifier") return "검증";
    if (w === "risk") return "위험 요소 점검";
    return w;
  };
  const discoveredWorkers =
    (availableWorkers || []).length > 0
      ? (availableWorkers as string[])
      : Object.keys(workerStatuses || {});
  const workers =
    discoveredWorkers.length > 0
      ? discoveredWorkers
      : ["qa", "summarizer", "verifier"];
  const steps = workers.map((w: string) => ({
    id: w,
    label: toLabel(w),
    status: (workerStatuses || {})[w] || "pending",
  }));
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-2xl w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {title || "분석 중이에요!"}
        </h2>

        <p className="text-lg text-gray-600 mb-4">
          {computedDescription ||
            "AI가 열심히 분석하고 있어요. 조금만 기다려주세요!"}
        </p>

        {/* 점 애니메이션 */}
        <div className="flex items-center justify-center space-x-1">
          <div
            className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>

      {/* Dynamic Progress Steps with Connection Lines */}
      <div className="max-w-lg mx-auto">
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isDone = step.status === "done";
            const isRunning = step.status === "running";

            return (
              <div key={step.id} className="relative">
                {/* Connection Line with Animated Dots */}
                {index < steps.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-12 -z-10">
                    <div
                      className={`w-full h-full transition-all duration-500 ${
                        isDone ? "bg-primary-300" : "bg-gray-200"
                      }`}
                      style={{
                        height: isDone ? "100%" : "0%",
                        transition: "height 0.5s ease-out",
                      }}
                    />
                    {/* 수직 점 3개 애니메이션 */}
                    {isDone && (
                      <div
                        className="absolute left-1/2 -translate-x-1/2 top-1/3 w-1 h-1 bg-primary-500 rounded-full animate-pulse"
                        style={{ animationDelay: "0s" }}
                      ></div>
                    )}
                    {isDone && (
                      <div
                        className="absolute left-1/2 -translate-x-1/2 top-1/2 w-1 h-1 bg-primary-500 rounded-full animate-pulse"
                        style={{ animationDelay: "0.3s" }}
                      ></div>
                    )}
                    {isDone && (
                      <div
                        className="absolute left-1/2 -translate-x-1/2 top-2/3 w-1 h-1 bg-primary-500 rounded-full animate-pulse"
                        style={{ animationDelay: "0.6s" }}
                      ></div>
                    )}
                  </div>
                )}

                <div
                  className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ${
                    isDone
                      ? "bg-primary-50 text-primary-900 border-2 border-primary-200"
                      : isRunning
                      ? "bg-primary-50/50 text-primary-700 border-2 border-primary-100"
                      : "bg-gray-50 text-gray-600 border-2 border-gray-200"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      isDone
                        ? "bg-primary-500 text-white scale-110"
                        : isRunning
                        ? "bg-primary-300 text-white animate-pulse"
                        : "bg-gray-300 text-gray-500"
                    }`}
                  >
                    {isDone ? (
                      <i className="ri-check-line text-lg"></i>
                    ) : isRunning ? (
                      <i className="ri-loader-4-line text-lg animate-spin"></i>
                    ) : (
                      <i className="ri-time-line text-lg"></i>
                    )}
                  </div>
                  <span
                    className={`text-base font-medium ${
                      isDone
                        ? "text-primary-900"
                        : isRunning
                        ? "text-primary-700"
                        : "text-gray-600"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
