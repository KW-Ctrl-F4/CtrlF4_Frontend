import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../_shared/layout/Header";
import FileUploader from "./components/FileUploader";
import PersonaQuestions from "./components/PersonaQuestions";
import Analytics from "./components/Analytics";
import RoleSelector from "./components/RoleSelector";
import Info from "./components/Info";
import Title from "./components/Title";
import { PERSONA_QUESTIONS } from "../../mocks";
import { useDocumentAnalysis } from "../../lib/api/hooks";

export default function Home() {
  const navigate = useNavigate();
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

  const analysis = useDocumentAnalysis({ role: "user" });
  const hasNavigatedRef = useRef(false);

  // 파일 업로드 핸들러
  const handleFilesChange = (files: File[]) => {
    setUploadedFiles(files);
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
      setAnalysisProgress((p) => (p < 70 ? 70 : p));
      // 의도 선택 완료 후 실제 분석 시작
      try {
        const a1 = newAnswers[1] || "";
        const a2 = newAnswers[2] || "";
        const k1 = questionKeys[0] || "question";
        const k2 = questionKeys[1] || "focus";
        const answersMap: Record<string, unknown> = {
          role: selectedRole || newAnswers[0] || "",
          [k1]: a1,
          [k2]: a2.split(",").map((s) => s.trim()).filter(Boolean),
        };
        await analysis.submitAnswers(answersMap);
        await analysis.startAnalysis({
          question: String(answersMap[k1] || ""),
          focus: (answersMap[k2] as string[]) || [],
        }, selectedRole || undefined);
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
      navigate("/result", { state: { results: analysis.results } });
    }
  }, [analysis.progress, analysis.results, navigate]);

  // suggest 수신 후 질문/역할 단계 시작
  useEffect(() => {
    if (
      isAnalyzing &&
      !showPersonaQuestions &&
      (analysis.suggestedQuestions?.length || 0) > 0
    ) {
      const filtered = (analysis.suggestedQuestions || []).filter((q: any) => q && q.key !== "role");
      const suggestQs = filtered.map((q: any) => q.text);
      const keys = filtered.map((q: any) => q.key);
      const picked = suggestQs.slice(0, 2);
      setQuestionKeys(keys.slice(0, 2).length > 0 ? keys.slice(0, 2) : ["question", "focus"]);
      setQuestions(picked.length > 0 ? picked : PERSONA_QUESTIONS.slice(0, 2));
      setShowPersonaQuestions(true);
    }
  }, [isAnalyzing, showPersonaQuestions, analysis.suggestedQuestions]);

  const skipQuestion = () => {
    handleAnswerSubmit("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-primary-100">
      <Header />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Title />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4">{error}</div>
        )}
        {!showPersonaQuestions && !isAnalyzing ? (
          <FileUploader
            uploadedFiles={uploadedFiles}
            onFilesChange={handleFilesChange}
            onStartAnalysis={startAnalysis}
          />
        ) : showPersonaQuestions ? (
          selectedRole === null ? (
            <RoleSelector
              roles={(analysis.suggestedRoles || []).length > 0 ? analysis.suggestedRoles : ["가맹본부", "가맹점"]}
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
          <Analytics progress={analysisProgress} />
        )}

        {/* Features */}
        {!showPersonaQuestions && !isAnalyzing && <Info />}
      </main>
    </div>
  );
}
