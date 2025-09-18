import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../_shared/layout/Header";
import { PERSONA_QUESTIONS } from "../../mocks";

export default function Home() {
  const navigate = useNavigate();
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPersonaQuestions, setShowPersonaQuestions] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles((prev) => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setShowPersonaQuestions(true);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setAnalysisProgress(0);
  };

  const handleAnswerSubmit = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestionIndex < PERSONA_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      // 질문 진행률 업데이트
      setAnalysisProgress(
        ((currentQuestionIndex + 1) / PERSONA_QUESTIONS.length) * 50
      );
    } else {
      // 모든 질문 완료 - 분석 시작
      console.log("분석 완료:", newAnswers);
      setShowPersonaQuestions(false);

      // 분석 진행률 시뮬레이션
      startAnalysisProgress();
    }
  };

  const startAnalysisProgress = () => {
    setAnalysisProgress(50); // 질문 완료 후 50%부터 시작

    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          // 분석 완료 후 결과 페이지로 이동
          setTimeout(() => {
            setIsAnalyzing(false);
            navigate("/result");
          }, 500);
          return 100;
        }
        return prev + Math.random() * 10; // 랜덤하게 진행률 증가
      });
    }, 300);
  };

  const skipQuestion = () => {
    handleAnswerSubmit("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-primary-100">
      <Header />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            계약서 업로드
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            법적 문서를 쉽게 업로드하여 분석하세요. 다양한 형식을 지원하며
            데이터 보안을 보장합니다.
          </p>
        </div>

        {!showPersonaQuestions && !isAnalyzing ? (
          <>
            {/* Upload Area */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                  isDragOver
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-300 hover:border-primary-400 hover:bg-gray-50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center">
                  <i className="ri-upload-cloud-2-line text-3xl text-primary-600"></i>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  파일을 여기에 끌어다 놓으세요
                </h3>

                <p className="text-gray-600 mb-6">
                  또는 컴퓨터에서 파일을 선택하세요. 지원 형식: PDF, DOCX
                  <br />
                  최대 파일 크기: 10MB
                </p>

                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  multiple
                  accept=".pdf,.docx,.doc"
                  onChange={handleFileSelect}
                />

                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-folder-open-line mr-2"></i>
                  파일 선택
                </label>
              </div>
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  업로드된 파일 ({uploadedFiles.length})
                </h3>

                <div className="space-y-4">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <i className="ri-file-text-line text-primary-600"></i>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {file.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <i className="ri-check-line mr-1"></i>
                          준비됨
                        </span>
                        <button
                          onClick={() => removeFile(index)}
                          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                        >
                          <i className="ri-close-line"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex justify-center">
                  <button
                    onClick={startAnalysis}
                    className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-upload-line mr-2"></i>
                    분석 시작
                  </button>
                </div>
              </div>
            )}
          </>
        ) : showPersonaQuestions ? (
          /* Persona Questions */
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                더 정확한 분석을 위한 질문
              </h2>
              <p className="text-gray-600">
                질문 {currentQuestionIndex + 1} / {PERSONA_QUESTIONS.length}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      ((currentQuestionIndex + 1) / PERSONA_QUESTIONS.length) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {PERSONA_QUESTIONS[currentQuestionIndex]}
                </h3>

                <PersonaQuestionForm
                  onSubmit={handleAnswerSubmit}
                  onSkip={skipQuestion}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Analysis Progress */
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
                  <span>{Math.round(analysisProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-primary-600 h-4 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${analysisProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="max-w-lg mx-auto">
                <div className="space-y-3">
                  <div
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      analysisProgress >= 20
                        ? "bg-green-50 text-green-800"
                        : "bg-gray-50 text-gray-600"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        analysisProgress >= 20 ? "bg-green-200" : "bg-gray-200"
                      }`}
                    >
                      {analysisProgress >= 20 ? (
                        <i className="ri-check-line text-sm"></i>
                      ) : (
                        <i className="ri-loader-4-line text-sm animate-spin"></i>
                      )}
                    </div>
                    <span className="text-sm font-medium">문서 구조 분석</span>
                  </div>

                  <div
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      analysisProgress >= 50
                        ? "bg-green-50 text-green-800"
                        : "bg-gray-50 text-gray-600"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        analysisProgress >= 50 ? "bg-green-200" : "bg-gray-200"
                      }`}
                    >
                      {analysisProgress >= 50 ? (
                        <i className="ri-check-line text-sm"></i>
                      ) : (
                        <i className="ri-loader-4-line text-sm animate-spin"></i>
                      )}
                    </div>
                    <span className="text-sm font-medium">주요 조항 추출</span>
                  </div>

                  <div
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      analysisProgress >= 80
                        ? "bg-green-50 text-green-800"
                        : "bg-gray-50 text-gray-600"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        analysisProgress >= 80 ? "bg-green-200" : "bg-gray-200"
                      }`}
                    >
                      {analysisProgress >= 80 ? (
                        <i className="ri-check-line text-sm"></i>
                      ) : (
                        <i className="ri-loader-4-line text-sm animate-spin"></i>
                      )}
                    </div>
                    <span className="text-sm font-medium">위험 요소 분석</span>
                  </div>

                  <div
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      analysisProgress >= 100
                        ? "bg-green-50 text-green-800"
                        : "bg-gray-50 text-gray-600"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        analysisProgress >= 100 ? "bg-green-200" : "bg-gray-200"
                      }`}
                    >
                      {analysisProgress >= 100 ? (
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
        )}

        {/* Features */}
        {!showPersonaQuestions && !isAnalyzing && (
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
              <p className="text-gray-600">
                고급 AI 기술로 신속하게 문서를 분석합니다
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 bg-primary-100 rounded-lg flex items-center justify-center">
                <i className="ri-file-list-line text-xl text-primary-600"></i>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">다양한 형식</h3>
              <p className="text-gray-600">
                PDF, DOCX 등 다양한 문서 형식을 지원합니다
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function PersonaQuestionForm({
  onSubmit,
  onSkip,
}: {
  onSubmit: (answer: string) => void;
  onSkip: () => void;
}) {
  const [answer, setAnswer] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim()) {
      onSubmit(answer.trim());
      setAnswer("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="답변을 입력해주세요..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          maxLength={500}
        />
        <p className="text-sm text-gray-500 mt-2">{answer.length}/500자</p>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onSkip}
          className="px-6 py-3 text-gray-600 hover:text-gray-800 cursor-pointer whitespace-nowrap"
        >
          건너뛰기
        </button>

        <button
          type="submit"
          disabled={!answer.trim()}
          className={`px-8 py-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            answer.trim()
              ? "bg-primary-600 text-white hover:bg-primary-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          다음
        </button>
      </div>
    </form>
  );
}
