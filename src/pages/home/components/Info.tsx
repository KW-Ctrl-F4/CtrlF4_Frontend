export default function Info() {
  return (
    <div className="mt-16 grid md:grid-cols-3 gap-8">
      <div className="text-center p-6">
        <div className="w-12 h-12 mx-auto mb-4 bg-primary-100 rounded-lg flex items-center justify-center">
          <i className="ri-robot-line text-xl text-primary-600"></i>
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">AI 에이전트</h3>
        <p className="text-gray-600">
          사용자 요구사항에 맞게 문서를 분석하고 처리합니다
        </p>
      </div>

      <div className="text-center p-6">
        <div className="w-12 h-12 mx-auto mb-4 bg-primary-100 rounded-lg flex items-center justify-center">
          <i className="ri-speed-line text-xl text-primary-600"></i>
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">빠른 처리</h3>
        <p className="text-gray-600">전처리→프로브→임베딩→의도추천까지 자동으로 진행됩니다</p>
      </div>

      <div className="text-center p-6">
        <div className="w-12 h-12 mx-auto mb-4 bg-primary-100 rounded-lg flex items-center justify-center">
          <i className="ri-file-list-line text-xl text-primary-600"></i>
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">다양한 형식</h3>
        <p className="text-gray-600">PDF, DOCX 등 다양한 문서 형식을 지원합니다</p>
      </div>
    </div>
  );
}
