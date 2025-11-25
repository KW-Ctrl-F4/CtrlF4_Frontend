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
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center">
          <i className="ri-robot-line text-3xl text-primary-600 animate-pulse"></i>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          문서 준비 단계 진행 중...
        </h2>

        <p className="text-gray-600 mb-8">
          업로드한 문서를 분석할 수 있도록 준비 중입니다. 잠시만 기다려주세요.
        </p>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>진행률</span>
            <span>{Math.round(displayProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-4 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${displayProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="max-w-lg mx-auto">
          <div className="space-y-3">
            <div
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                displayProgress >= 25
                  ? "bg-green-50 text-green-800"
                  : "bg-gray-50 text-gray-600"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  displayProgress >= 25 ? "bg-green-200" : "bg-gray-200"
                }`}
              >
                {displayProgress >= 25 ? (
                  <i className="ri-check-line text-sm"></i>
                ) : (
                  <i className="ri-loader-4-line text-sm animate-spin"></i>
                )}
              </div>
              <span className="text-sm font-medium">계약서 업로드 완료</span>
            </div>

            <div
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                displayProgress >= 50
                  ? "bg-green-50 text-green-800"
                  : "bg-gray-50 text-gray-600"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  displayProgress >= 50 ? "bg-green-200" : "bg-gray-200"
                }`}
              >
                {displayProgress >= 50 ? (
                  <i className="ri-check-line text-sm"></i>
                ) : (
                  <i className="ri-loader-4-line text-sm animate-spin"></i>
                )}
              </div>
              <span className="text-sm font-medium">텍스트 추출 완료</span>
            </div>

            <div
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                displayProgress >= 75
                  ? "bg-green-50 text-green-800"
                  : "bg-gray-50 text-gray-600"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  displayProgress >= 75 ? "bg-green-200" : "bg-gray-200"
                }`}
              >
                {displayProgress >= 75 ? (
                  <i className="ri-check-line text-sm"></i>
                ) : (
                  <i className="ri-loader-4-line text-sm animate-spin"></i>
                )}
              </div>
              <span className="text-sm font-medium">조항 추출 완료</span>
            </div>

            <div
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                displayProgress >= 100
                  ? "bg-green-50 text-green-800"
                  : "bg-gray-50 text-gray-600"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  displayProgress >= 100 ? "bg-green-200" : "bg-gray-200"
                }`}
              >
                {displayProgress >= 100 ? (
                  <i className="ri-check-line text-sm"></i>
                ) : (
                  <i className="ri-loader-4-line text-sm animate-spin"></i>
                )}
              </div>
              <span className="text-sm font-medium">질문 생성 완료</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
