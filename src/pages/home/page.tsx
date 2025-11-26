import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import FileUploader from "./components/FileUploader";
import PersonaQuestions from "./components/PersonaQuestions";
import SessionProgress from "./components/SessionProgress";
import Analytics from "./components/Analytics";
import RoleSelector from "./components/RoleSelector";
import { PERSONA_QUESTIONS } from "../../mocks";
import { useDocumentAnalysis } from "../../lib/api/hooks";
import { useAuth } from "../../contexts/AuthContext";
import TopNavigation from "../_shared/components/TopNavigation";

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [showUploadSection, setShowUploadSection] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPersonaQuestions, setShowPersonaQuestions] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [questionKeys, setQuestionKeys] = useState<string[]>([]);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const analysis = useDocumentAnalysis({ role: "user", pollIntervalMs: 5000 });
  const hasNavigatedRef = useRef(false);
  const uploadSectionRef = useRef<HTMLDivElement>(null);
  const confirmSectionRef = useRef<HTMLDivElement>(null);

  // 파일 업로드 핸들러
  const handleFilesChange = (files: File[]) => {
    const wasEmpty = uploadedFiles.length === 0;
    setUploadedFiles(files);
    // 파일이 업로드되면 확인 섹션으로 스크롤
    if (files.length > 0) {
      // 파일이 새로 추가된 경우 또는 파일이 변경된 경우 모두 스크롤
      setTimeout(
        () => {
          if (confirmSectionRef.current) {
            confirmSectionRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        },
        wasEmpty ? 300 : 100
      ); // 처음 업로드 시에는 300ms, 재선택 시에는 100ms
    }
  };

  // 다른 파일 선택하기 버튼 클릭 핸들러
  const handleSelectDifferentFile = () => {
    // 먼저 업로드 섹션으로 부드럽게 스크롤
    if (uploadSectionRef.current) {
      uploadSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      // 스크롤 완료 후 파일 목록 비우기
      setTimeout(() => {
        setUploadedFiles([]);
      }, 500); // 스크롤 애니메이션 시간 고려
    } else {
      // ref가 없으면 즉시 비우기
      setUploadedFiles([]);
    }
  };

  const startAnalysis = async () => {
    setError(null);
    if (uploadedFiles.length === 0) return;
    try {
      setIsAnalyzing(true);
      setShowPersonaQuestions(false);
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setAnalysisProgress(0);
      // 첫 파일만 처리 (확장 시 다중파일 루프)
      await analysis.presignAndUpload(uploadedFiles[0]);
      // suggest 결과는 훅 상태 갱신 후 도착하므로, 별도 effect에서 처리
    } catch (e: any) {
      setError(e?.message ?? "업로드 실패");
      setIsAnalyzing(false);
      setShowPersonaQuestions(false);
    }
  };

  const handleAnswerSubmit = async (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestionIndex < Math.max(questions.length, 1) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      // 질문 진행률 업데이트
      setAnalysisProgress(
        ((currentQuestionIndex + 1) / Math.max(questions.length, 1)) * 50
      );
    } else {
      setShowPersonaQuestions(false);
      // 런 시작 직후에도 로딩이 확실히 보이도록 보장
      setIsAnalyzing(true);
      // 세션 프로세스는 0%부터 시작
      setAnalysisProgress(0);
      // 의도 선택 완료 후 실제 분석 시작
      try {
        const a1 = newAnswers[1] || "";
        const a2 = newAnswers[2] || "";
        const k1 = questionKeys[0] || "question";
        const k2 = questionKeys[1] || "focus";
        const answersMap: Record<string, unknown> = {
          role: selectedRole || newAnswers[0] || "",
          [k1]: a1,
          [k2]: a2
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        };
        await analysis.submitAnswers(answersMap);
        await analysis.startAnalysis(
          {
            question: String(answersMap[k1] || ""),
            focus: (answersMap[k2] as string[]) || [],
          },
          selectedRole || undefined
        );
      } catch (e: any) {
        setError(e?.message ?? "분석 시작 실패");
        setIsAnalyzing(false);
      }
    }
  };

  useEffect(() => {
    setAnalysisProgress(analysis.progress);
    if (analysis.results && !hasNavigatedRef.current) {
      hasNavigatedRef.current = true;
      setIsAnalyzing(false);
      navigate("/result", {
        state: { results: analysis.results, runId: analysis.runId },
      });
    }
  }, [analysis.progress, analysis.results, navigate]);

  // suggest 수신 후 질문/역할 단계 시작
  useEffect(() => {
    if (
      isAnalyzing &&
      !showPersonaQuestions &&
      (analysis.suggestedQuestions?.length || 0) > 0
    ) {
      const filtered = (analysis.suggestedQuestions || []).filter(
        (q: any) => q && q.key !== "role"
      );
      const suggestQs = filtered.map((q: any) => q.text);
      const keys = filtered.map((q: any) => q.key);
      const picked = suggestQs.slice(0, 2);
      setQuestionKeys(
        keys.slice(0, 2).length > 0 ? keys.slice(0, 2) : ["question", "focus"]
      );
      setQuestions(picked.length > 0 ? picked : PERSONA_QUESTIONS.slice(0, 2));
      setShowPersonaQuestions(true);
    }
  }, [isAnalyzing, showPersonaQuestions, analysis.suggestedQuestions]);

  const skipQuestion = () => {
    handleAnswerSubmit("");
  };

  // 파일 크기 포맷팅 함수
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // 랜딩 화면에서 "계약서 분석하러 가기" 버튼 클릭
  const handleStartAnalysis = () => {
    setShowUploadSection(true);
    // 파일 업로드 섹션이 표시된 후 부드럽게 스크롤
    setTimeout(() => {
      if (uploadSectionRef.current) {
        uploadSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  // 로딩 중이면 아무것도 표시하지 않음
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-primary-100 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-primary-100">
      <TopNavigation />

      {/* 랜딩 화면 - 항상 표시 (로그인 상태에서도) */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full text-center">
          {/* 로고 */}
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
              <i className="ri-search-line text-white text-2xl"></i>
            </div>
            <span className="text-3xl font-bold text-gray-900">CtrlF4</span>
          </div>

          {/* 메인 메시지 */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            계약서 분석을 시작해볼까요?
          </h1>
          <p className="text-lg text-gray-600 mb-12">
            AI가 계약서를 분석하여 위험 요소와 개선 사항을 찾아드립니다
          </p>

          {/* 버튼 영역 */}
          {!isAuthenticated ? (
            // 비로그인 상태: 로그인/회원가입 버튼
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/signin")}
                className="px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer whitespace-nowrap text-lg font-medium shadow-lg"
              >
                로그인하고 시작하기
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="px-8 py-4 bg-white text-primary-600 border-2 border-primary-600 rounded-lg hover:bg-primary-50 transition-colors cursor-pointer whitespace-nowrap text-lg font-medium shadow-lg"
              >
                회원가입하기
              </button>
            </div>
          ) : (
            // 로그인 상태: 분석 시작 버튼
            <button
              onClick={handleStartAnalysis}
              className="px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer whitespace-nowrap text-lg font-medium shadow-lg"
            >
              계약서 분석하러 가기
            </button>
          )}
        </div>
      </section>

      {/* 파일 업로드 섹션 - 로그인 상태에서 "계약서 분석하러 가기" 클릭 시 표시 */}
      {isAuthenticated &&
        (showUploadSection || isAnalyzing || showPersonaQuestions) && (
          <section ref={uploadSectionRef} className="min-h-screen py-12">
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4">
                  {error}
                </div>
              )}

              {!isAnalyzing && !showPersonaQuestions ? (
                <>
                  {/* 파일 업로드 단계 */}
                  <FileUploader
                    uploadedFiles={uploadedFiles}
                    onFilesChange={handleFilesChange}
                  />

                  {/* 파일 확인 및 분석 시작 섹션 */}
                  {uploadedFiles.length > 0 && (
                    <section
                      ref={confirmSectionRef}
                      className="min-h-screen flex items-center justify-center py-12"
                    >
                      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-2xl w-full">
                        <div className="text-center mb-8">
                          <div className="w-16 h-16 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center">
                            <i className="ri-file-check-line text-3xl text-primary-600"></i>
                          </div>
                          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            이 문서로 분석을 시작할까요?
                          </h2>
                          <p className="text-lg text-gray-600">
                            업로드된 파일을 확인하고 분석을 시작해주세요
                          </p>
                        </div>

                        {/* 업로드된 파일 정보 */}
                        <div className="bg-gray-50 rounded-xl p-6 mb-8">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <i className="ri-file-text-line text-primary-600 text-xl"></i>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 truncate">
                                {uploadedFiles[0].name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatFileSize(uploadedFiles[0].size)}
                              </p>
                            </div>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex-shrink-0">
                              <i className="ri-check-line mr-1"></i>
                              업로드 완료
                            </span>
                          </div>
                        </div>

                        {/* 분석 시작 버튼 */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <button
                            onClick={startAnalysis}
                            className="px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer whitespace-nowrap text-lg font-medium shadow-lg"
                          >
                            <i className="ri-play-line mr-2"></i>
                            분석 시작하기
                          </button>
                          <button
                            onClick={handleSelectDifferentFile}
                            className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap text-lg font-medium"
                          >
                            다른 파일 선택하기
                          </button>
                        </div>
                      </div>
                    </section>
                  )}
                </>
              ) : showPersonaQuestions && !analysis.runId ? (
                // 역할 선택 또는 질문 응답 단계
                selectedRole === null ? (
                  <RoleSelector
                    roles={
                      (analysis.suggestedRoles || []).length > 0
                        ? analysis.suggestedRoles
                        : ["가맹본부", "가맹점"]
                    }
                    onSelect={(role) => {
                      setSelectedRole(role);
                      setAnswers([role]);
                    }}
                  />
                ) : (
                  <PersonaQuestions
                    questions={questions}
                    currentQuestionIndex={currentQuestionIndex}
                    handleAnswerSubmit={handleAnswerSubmit}
                    skipQuestion={skipQuestion}
                  />
                )
              ) : (
                // 분석 진행 중
                (() => {
                  // 런 시작 전(업로드/전처리/역할·질문 제안 단계)은 기존 Analytics 표시
                  if (!analysis.runId) {
                    return <Analytics progress={analysisProgress} />;
                  }
                  // 런 시작 후에는 세션 단계 진행 표시 (스텝 계산은 컴포넌트 내부에서 수행)
                  return (
                    <SessionProgress
                      progress={analysisProgress}
                      availableWorkers={analysis.availableWorkers}
                      workerStatuses={analysis.workerStatuses}
                      attempt={analysis.runAttempt}
                    />
                  );
                })()
              )}
            </main>
          </section>
        )}
    </div>
  );
}
