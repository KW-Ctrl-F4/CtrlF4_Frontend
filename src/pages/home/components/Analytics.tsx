interface AnalyticsProps {
  progress: number;
}

export default function Analytics({ progress }: AnalyticsProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));
  // 백엔드 내부 단계 값(20,35,45,55)을 4단계(25/50/75/100)로 정규화
  const displayProgress = (() => {
    if (clampedProgress < 20) {
      return (clampedProgress / 20) * 25;
    }
    if (clampedProgress < 35) {
      return 25 + ((clampedProgress - 20) / 15) * 25;
    }
    if (clampedProgress < 45) {
      return 50 + ((clampedProgress - 35) / 10) * 25;
    }
    if (clampedProgress < 55) {
      return 75 + ((clampedProgress - 45) / 10) * 25;
    }
    return 100;
  })();
  // 단계별 상태 계산
  const steps = [
    { id: 1, label: "계약서 업로드", threshold: 25 },
    { id: 2, label: "텍스트 추출", threshold: 50 },
    { id: 3, label: "조항 추출", threshold: 75 },
    { id: 4, label: "질문 생성", threshold: 100 },
  ];

  const getStepStatus = (threshold: number) => {
    if (displayProgress >= threshold) return "done";
    if (displayProgress >= threshold - 10) return "active";
    return "pending";
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-2xl w-full">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center relative">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          문서를 준비하고 있어요
        </h2>

        <p className="text-lg text-gray-600 mb-4">
          업로드한 문서를 분석할 수 있도록 준비 중이에요. 잠시만 기다려주세요
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

      {/* Progress Steps with Connection Lines */}
      <div className="max-w-lg mx-auto">
        <div className="space-y-4">
          {steps.map((step, index) => {
            const status = getStepStatus(step.threshold);
            const isDone = status === "done";
            const isActive = status === "active";

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
                      : isActive
                      ? "bg-primary-50/50 text-primary-700 border-2 border-primary-100"
                      : "bg-gray-50 text-gray-600 border-2 border-gray-200"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      isDone
                        ? "bg-primary-500 text-white scale-110"
                        : isActive
                        ? "bg-primary-300 text-white animate-pulse"
                        : "bg-gray-300 text-gray-500"
                    }`}
                  >
                    {isDone ? (
                      <i className="ri-check-line text-lg"></i>
                    ) : isActive ? (
                      <i className="ri-loader-4-line text-lg animate-spin"></i>
                    ) : (
                      <i className="ri-time-line text-lg"></i>
                    )}
                  </div>
                  <span
                    className={`text-base font-medium ${
                      isDone
                        ? "text-primary-900"
                        : isActive
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
