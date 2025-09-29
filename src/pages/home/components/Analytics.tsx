interface AnalyticsProps {
  progress: number;
}

export default function Analytics({ progress }: AnalyticsProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center">
          <i className="ri-robot-line text-3xl text-primary-600 animate-pulse"></i>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          계약서 분석 중...
        </h2>

        <p className="text-gray-600 mb-8">
          AI가 계약서를 꼼꼼히 분석하고 있습니다. 잠시만 기다려주세요.
        </p>

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

        {/* Progress Steps */}
        <div className="max-w-lg mx-auto">
          <div className="space-y-3">
            <div
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                clampedProgress >= 20
                  ? "bg-green-50 text-green-800"
                  : "bg-gray-50 text-gray-600"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  clampedProgress >= 20 ? "bg-green-200" : "bg-gray-200"
                }`}
              >
                {clampedProgress >= 20 ? (
                  <i className="ri-check-line text-sm"></i>
                ) : (
                  <i className="ri-loader-4-line text-sm animate-spin"></i>
                )}
              </div>
              <span className="text-sm font-medium">문서 구조 분석</span>
            </div>

            <div
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                clampedProgress >= 50
                  ? "bg-green-50 text-green-800"
                  : "bg-gray-50 text-gray-600"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  clampedProgress >= 50 ? "bg-green-200" : "bg-gray-200"
                }`}
              >
                {clampedProgress >= 50 ? (
                  <i className="ri-check-line text-sm"></i>
                ) : (
                  <i className="ri-loader-4-line text-sm animate-spin"></i>
                )}
              </div>
              <span className="text-sm font-medium">주요 조항 추출</span>
            </div>

            <div
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                clampedProgress >= 80
                  ? "bg-green-50 text-green-800"
                  : "bg-gray-50 text-gray-600"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  clampedProgress >= 80 ? "bg-green-200" : "bg-gray-200"
                }`}
              >
                {clampedProgress >= 80 ? (
                  <i className="ri-check-line text-sm"></i>
                ) : (
                  <i className="ri-loader-4-line text-sm animate-spin"></i>
                )}
              </div>
              <span className="text-sm font-medium">위험 요소 분석</span>
            </div>

            <div
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                clampedProgress >= 100
                  ? "bg-green-50 text-green-800"
                  : "bg-gray-50 text-gray-600"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  clampedProgress >= 100 ? "bg-green-200" : "bg-gray-200"
                }`}
              >
                {clampedProgress >= 100 ? (
                  <i className="ri-check-line text-sm"></i>
                ) : (
                  <i className="ri-loader-4-line text-sm animate-spin"></i>
                )}
              </div>
              <span className="text-sm font-medium">개선 제안 생성</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
