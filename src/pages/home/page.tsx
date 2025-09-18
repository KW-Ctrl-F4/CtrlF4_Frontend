import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../_shared/layout/Header";
import FileUploader from "./components/FileUploader";
import PersonaQuestions from "./components/PersonaQuestions";
import Analytics from "./components/Analytics";
import Info from "./components/Info";
import Title from "./components/Title";
import { PERSONA_QUESTIONS } from "../../mocks";

export default function Home() {
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPersonaQuestions, setShowPersonaQuestions] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  // 파일 업로드 핸들러
  const handleFilesChange = (files: File[]) => {
    setUploadedFiles(files);
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
        <Title />

        {!showPersonaQuestions && !isAnalyzing ? (
          <FileUploader
            uploadedFiles={uploadedFiles}
            onFilesChange={handleFilesChange}
            onStartAnalysis={startAnalysis}
          />
        ) : showPersonaQuestions ? (
          <PersonaQuestions
            currentQuestionIndex={currentQuestionIndex}
            handleAnswerSubmit={handleAnswerSubmit}
            skipQuestion={skipQuestion}
          />
        ) : (
          <Analytics progress={analysisProgress} />
        )}

        {/* Features */}
        {!showPersonaQuestions && !isAnalyzing && <Info />}
      </main>
    </div>
  );
}
