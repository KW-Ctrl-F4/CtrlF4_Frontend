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

  // 현재 진행 중인 단계 찾기 (완료되지 않은 첫 번째 단계)
  const getCurrentActiveStep = () => {
    for (let i = 0; i < steps.length; i++) {
      const status = getStepStatus(steps[i].threshold);
      if (status !== "done") {
        return i; // 완료되지 않은 첫 번째 단계가 현재 진행 중
      }
    }
    return steps.length; // 모든 단계 완료
  };

  const currentActiveIndex = getCurrentActiveStep();

  return (
    <>
      <style>{`
        /* 1. 필수: 각도 변수 정의 (브라우저가 각도 변화를 인식하도록 함) */
        @property --border-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }

        @keyframes dotPulse {
          0%, 100% {
            transform: translateX(-50%) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translateX(-50%) scale(1.5);
            opacity: 1;
          }
        }

        /* 2. 필수: 회전 애니메이션 키프레임 */
        @keyframes border-angle-rotate {
          from { --border-angle: 0deg; }
          to { --border-angle: 360deg; }
        }

        /* 3. 회전하는 테두리 스타일 */
        .rotating-border {
          /* 테두리 애니메이션 핵심 설정 */
          border: 2px solid transparent;
          animation: border-angle-rotate 2s infinite linear;

          /* 배경 겹치기 (Masking 기법) */
          background: 
            /* 1) 안쪽 배경 (흰색) - padding-box 영역까지만 칠함 */
            linear-gradient(white, white) padding-box,
            
            /* 2) 테두리 그라데이션 (오렌지 계열) - border-box 영역까지 칠함 */
            conic-gradient(
              from var(--border-angle),
              oklch(65% 0.18 25deg),   /* 어두운 오렌지-레드 */
              oklch(70% 0.20 35deg),   /* 오렌지 */
              oklch(75% 0.22 45deg),   /* 밝은 오렌지 */
              oklch(80% 0.20 55deg),   /* 노란 오렌지 */
              oklch(85% 0.18 65deg),   /* 황금색 */
              oklch(80% 0.20 55deg),   /* 노란 오렌지 */
              oklch(75% 0.22 45deg),   /* 밝은 오렌지 */
              oklch(70% 0.20 35deg),   /* 오렌지 */
              oklch(65% 0.18 25deg)    /* 어두운 오렌지-레드로 돌아옴 */
            ) 
            border-box;
        }
      `}</style>
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-2xl w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            문서를 분석하고 있어요
          </h2>

          <p className="text-lg text-gray-600 mb-4">
            업로드한 문서를 분석하고 있어요. 잠시만 기다려주세요!
          </p>
        </div>

        {/* Progress Steps - 모든 단계 표시 */}
        <div className="max-w-lg mx-auto">
          <div className="space-y-4">
            {steps.map((step, index) => {
              const status = getStepStatus(step.threshold);
              const isDone = status === "done";
              const isActive = index === currentActiveIndex; // 현재 진행 중인 단계

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
                      {/* 수직 점 3개 - 항상 표시, 순서대로 크기 변화 애니메이션 */}
                      {isDone && (
                        <>
                          <div
                            className="absolute left-1/2 -translate-x-1/2 top-1/3 rounded-full bg-primary-500"
                            style={{
                              width: "6px",
                              height: "6px",
                              animation: "dotPulse 1.5s ease-in-out infinite",
                              animationDelay: "0s",
                            }}
                          ></div>
                          <div
                            className="absolute left-1/2 -translate-x-1/2 top-1/2 rounded-full bg-primary-500"
                            style={{
                              width: "6px",
                              height: "6px",
                              animation: "dotPulse 1.5s ease-in-out infinite",
                              animationDelay: "0.5s",
                            }}
                          ></div>
                          <div
                            className="absolute left-1/2 -translate-x-1/2 top-2/3 rounded-full bg-primary-500"
                            style={{
                              width: "6px",
                              height: "6px",
                              animation: "dotPulse 1.5s ease-in-out infinite",
                              animationDelay: "1s",
                            }}
                          ></div>
                        </>
                      )}
                    </div>
                  )}

                  <div
                    className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ${
                      isDone
                        ? "bg-green-50 text-green-900 border-2 border-green-300"
                        : isActive
                        ? "bg-white text-gray-900 rotating-border"
                        : "bg-gray-50 text-gray-600 border-2 border-gray-200"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                        isDone
                          ? "bg-green-500 text-white scale-110"
                          : isActive
                          ? "bg-primary-500 text-white"
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
                          ? "text-green-900"
                          : isActive
                          ? "text-gray-900"
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
    </>
  );
}
