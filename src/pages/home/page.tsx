import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import FileUploader from "./components/FileUploader";
import PersonaQuestions from "./components/PersonaQuestions";
import SessionProgress from "./components/SessionProgress";
import Analytics from "./components/Analytics";
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
  const [showCompletionSection, setShowCompletionSection] = useState(false);
  const [showAnalysisCompleteSection, setShowAnalysisCompleteSection] =
    useState(false);

  const analysis = useDocumentAnalysis({ role: "user", pollIntervalMs: 5000 });
  const hasNavigatedRef = useRef(false);
  const uploadSectionRef = useRef<HTMLDivElement>(null);
  const confirmSectionRef = useRef<HTMLDivElement>(null);
  const analysisSectionRef = useRef<HTMLDivElement>(null);
  const completionSectionRef = useRef<HTMLDivElement>(null);
  const questionsSectionRef = useRef<HTMLDivElement>(null);
  const analysisCompleteSectionRef = useRef<HTMLDivElement>(null);

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

  // 분석 섹션이 렌더링된 후 부드럽게 스크롤
  useEffect(() => {
    if (isAnalyzing && analysisSectionRef.current) {
      // 여러 번 시도하여 DOM이 완전히 렌더링된 후 스크롤
      const scrollToAnalysis = () => {
        if (analysisSectionRef.current) {
          analysisSectionRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      };

      // 즉시 시도
      scrollToAnalysis();

      // 약간의 딜레이 후 재시도 (DOM 업데이트 대기)
      const timeout1 = setTimeout(scrollToAnalysis, 100);
      const timeout2 = setTimeout(scrollToAnalysis, 300);

      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
      };
    }
  }, [isAnalyzing]);

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
      // 모든 질문 완료 - 분석 시작
      // 질문 섹션은 유지하고, 아래에 분석 섹션 생성
      // 즉시 분석 상태로 전환하여 딜레이 없이 SessionProgress 표시
      setIsAnalyzing(true);
      // 세션 프로세스는 0%부터 시작
      setAnalysisProgress(0);

      // 분석 섹션으로 즉시 스크롤 (질문 섹션 아래에 생성됨)
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (analysisSectionRef.current) {
            analysisSectionRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 100);
      });

      // 의도 선택 완료 후 실제 분석 시작 (백그라운드에서 실행)
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
        // 비동기로 실행하되 await하지 않음 - 즉시 다음 단계로 진행
        analysis
          .submitAnswers(answersMap)
          .then(() => {
            return analysis.startAnalysis(
              {
                question: String(answersMap[k1] || ""),
                focus: (answersMap[k2] as string[]) || [],
              },
              selectedRole || undefined
            );
          })
          .catch((e: any) => {
            setError(e?.message ?? "분석 시작 실패");
            setIsAnalyzing(false);
          });
      } catch (e: any) {
        setError(e?.message ?? "분석 시작 실패");
        setIsAnalyzing(false);
      }
    }
  };

  useEffect(() => {
    setAnalysisProgress(analysis.progress);
    if (
      analysis.results &&
      !hasNavigatedRef.current &&
      !showAnalysisCompleteSection
    ) {
      // 분석 완료 - 완료 섹션 표시
      setIsAnalyzing(false);
      setShowAnalysisCompleteSection(true);
    }
  }, [analysis.progress, analysis.results, showAnalysisCompleteSection]);

  // 분석 완료 섹션이 표시되면 부드럽게 스크롤
  useEffect(() => {
    if (showAnalysisCompleteSection && analysisCompleteSectionRef.current) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (analysisCompleteSectionRef.current) {
            analysisCompleteSectionRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 100);
      });
    }
  }, [showAnalysisCompleteSection]);

  // 결과보러가기 버튼 클릭 핸들러
  const handleGoToResults = () => {
    if (analysis.results && analysis.runId) {
      hasNavigatedRef.current = true;
      navigate("/result", {
        state: { results: analysis.results, runId: analysis.runId },
      });
    }
  };

  // 분석 세션이 시작되면 (runId가 생성되면) 분석 섹션으로 스크롤
  useEffect(() => {
    if (analysis.runId && analysisSectionRef.current && isAnalyzing) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (analysisSectionRef.current) {
            analysisSectionRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 100);
      });
    }
  }, [analysis.runId, isAnalyzing]);

  // Analytics의 4단계가 모두 완료되면 완료 섹션 표시
  useEffect(() => {
    // Analytics 단계는 progress가 55 이상이면 100%로 표시됨
    if (
      isAnalyzing &&
      !analysis.runId &&
      analysisProgress >= 55 &&
      !showCompletionSection
    ) {
      // 0.3초 후에 완료 섹션 표시
      const timer = setTimeout(() => {
        setShowCompletionSection(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isAnalyzing, analysis.runId, analysisProgress, showCompletionSection]);

  // 완료 섹션이 표시되면 부드럽게 스크롤
  useEffect(() => {
    if (showCompletionSection && completionSectionRef.current) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (completionSectionRef.current) {
            completionSectionRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 100);
      });
    }
  }, [showCompletionSection]);

  // "답변하러 가기" 버튼 클릭 핸들러
  const handleGoToQuestions = () => {
    // suggest가 이미 수신되었으면 PersonaQuestions 표시
    if (analysis.suggestedQuestions && analysis.suggestedQuestions.length > 0) {
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
  };

  // 질문 섹션이 표시되면 부드럽게 스크롤 (완료 섹션과 동일한 방식)
  useEffect(() => {
    if (showPersonaQuestions && questionsSectionRef.current) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (questionsSectionRef.current) {
            questionsSectionRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 100);
      });
    }
  }, [showPersonaQuestions]);

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
            <span className="text-3xl font-bold text-gray-900">ConSure</span>
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

              {/* 파일 업로드 단계 - 항상 표시 */}
              <FileUploader
                uploadedFiles={uploadedFiles}
                onFilesChange={handleFilesChange}
              />

              {/* 파일 확인 및 분석 시작 섹션 - 파일이 업로드된 경우 표시 */}
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

              {/* 분석 진행 중 - 질문 시작 전 Analytics 단계만 표시 */}
              {isAnalyzing && !analysis.runId && !showPersonaQuestions && (
                <section
                  ref={analysisSectionRef}
                  className="min-h-screen flex items-center justify-center py-12"
                >
                  <Analytics progress={analysisProgress} />
                </section>
              )}

              {/* 문서 확인 완료 섹션 - Analytics 4단계 완료 후 표시 */}
              {showCompletionSection && (
                <section
                  ref={completionSectionRef}
                  className="min-h-screen flex items-center justify-center py-12"
                >
                  <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-2xl w-full">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                        <i className="ri-checkbox-circle-line text-3xl text-green-600"></i>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        문서 확인을 완료했어요!
                      </h2>
                      <p className="text-lg text-gray-600 mb-8">
                        더 정확한 분석을 위해 몇 가지 질문을 드릴게요
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <button
                        onClick={handleGoToQuestions}
                        className="px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer whitespace-nowrap text-lg font-medium shadow-lg"
                      >
                        <i className="ri-arrow-right-line mr-2"></i>
                        답변하기
                      </button>
                    </div>
                  </div>
                </section>
              )}

              {/* 역할 선택 또는 질문 응답 단계 */}
              {showPersonaQuestions && (
                <section
                  ref={questionsSectionRef}
                  className="min-h-screen flex items-center justify-center py-12"
                >
                  <PersonaQuestions
                    questions={questions}
                    currentQuestionIndex={currentQuestionIndex}
                    handleAnswerSubmit={handleAnswerSubmit}
                    skipQuestion={skipQuestion}
                    selectedRole={selectedRole}
                    roles={
                      (analysis.suggestedRoles || []).length > 0
                        ? analysis.suggestedRoles
                        : ["가맹본부", "가맹점"]
                    }
                    onRoleSelect={(role) => {
                      setSelectedRole(role);
                      setAnswers([role]);
                    }}
                  />
                </section>
              )}

              {/* 분석 진행 중 - 질문 완료 후 질문 섹션 바로 아래에 생성 */}
              {isAnalyzing && showPersonaQuestions && (
                <section
                  ref={analysisSectionRef}
                  className="min-h-screen flex items-center justify-center py-12"
                >
                  <SessionProgress
                    progress={analysisProgress}
                    availableWorkers={analysis.availableWorkers}
                    workerStatuses={analysis.workerStatuses}
                    attempt={analysis.runAttempt}
                  />
                </section>
              )}

              {/* 분석 완료 섹션 - 분석이 완료되면 맨 밑에 생성 */}
              {showAnalysisCompleteSection && (
                <section
                  ref={analysisCompleteSectionRef}
                  className="min-h-screen flex items-center justify-center py-12"
                >
                  <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-2xl w-full">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                        <i className="ri-checkbox-circle-line text-3xl text-green-600"></i>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        분석 완료! 🎉
                      </h2>
                      <p className="text-lg text-gray-600 mb-8">
                        계약서 분석이 끝났어요! 결과를 확인해볼까요?
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <button
                        onClick={handleGoToResults}
                        className="px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer whitespace-nowrap text-lg font-medium shadow-lg"
                      >
                        <i className="ri-arrow-right-line mr-2"></i>
                        결과보러 가기
                      </button>
                    </div>
                  </div>
                </section>
              )}
            </main>
          </section>
        )}
    </div>
  );
}
