import PersonaQuestionForm from "./PersonaQuestionForm";

interface PersonaQuestionsProps {
  questions: string[];
  currentQuestionIndex: number;
  handleAnswerSubmit: (answer: string) => void;
  skipQuestion: () => void;
  selectedRole: string | null;
  roles: string[];
  onRoleSelect: (role: string) => void;
}

export default function PersonaQuestions({
  questions,
  currentQuestionIndex,
  handleAnswerSubmit,
  skipQuestion,
  selectedRole,
  roles,
  onRoleSelect,
}: PersonaQuestionsProps) {
  const isRoleSelection = selectedRole === null;
  const totalQuestions = questions.length + 1; // role 선택 포함
  const currentStep = isRoleSelection ? 1 : currentQuestionIndex + 2; // role이 1번째, 질문들이 2번째부터

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
          {isRoleSelection
            ? "역할 선택"
            : `질문 ${currentQuestionIndex + 1} / ${questions.length}`}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 max-w-md mx-auto">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(currentStep / totalQuestions) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {isRoleSelection ? (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              당신의 역할/직책은 무엇인가요?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => onRoleSelect(r)}
                  className="text-left p-4 border-2 border-gray-200 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-colors cursor-pointer"
                >
                  <div className="font-medium text-gray-900 text-center">
                    {r}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              {questions[currentQuestionIndex]}
            </h3>

            <PersonaQuestionForm
              onSubmit={handleAnswerSubmit}
              onSkip={skipQuestion}
            />
          </div>
        )}
      </div>
    </div>
  );
}
