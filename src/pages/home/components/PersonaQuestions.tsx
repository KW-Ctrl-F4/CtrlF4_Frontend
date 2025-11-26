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
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-2xl w-full">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center">
          <i className="ri-question-line text-3xl text-primary-600"></i>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          잠깐, 이것만 알려주세요!
        </h2>
        <p className="text-lg text-gray-600 mb-4">
          질문 {currentQuestionIndex + 1} / {questions.length}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 max-w-md mx-auto">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${
                ((currentQuestionIndex + 1) / Math.max(1, questions.length)) *
                100
              }%`,
            }}
          ></div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
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
