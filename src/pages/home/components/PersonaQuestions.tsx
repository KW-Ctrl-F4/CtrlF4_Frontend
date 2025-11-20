import PersonaQuestionForm from "./PersonaQuestionForm";

interface PersonaQuestionsProps {
  questions: string[];
  currentQuestionIndex: number;
  handleAnswerSubmit: (answer: string) => void;
  skipQuestion: () => void;
}

export default function PersonaQuestions({
  questions,
  currentQuestionIndex,
  handleAnswerSubmit,
  skipQuestion,
}: PersonaQuestionsProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          더 정확한 분석을 위한 질문
        </h2>
        <p className="text-gray-600">
          질문 {currentQuestionIndex + 1} / {questions.length}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentQuestionIndex + 1) / Math.max(1, questions.length)) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {questions[currentQuestionIndex]}
          </h3>

          <PersonaQuestionForm
            onSubmit={handleAnswerSubmit}
            onSkip={skipQuestion}
          />
        </div>
      </div>
    </div>
  );
}
