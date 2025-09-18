import { useState } from "react";

interface PersonaQuestionFormProps {
  onSubmit: (answer: string) => void;
  onSkip: () => void;
}

export default function PersonaQuestionForm({
  onSubmit,
  onSkip,
}: PersonaQuestionFormProps) {
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
