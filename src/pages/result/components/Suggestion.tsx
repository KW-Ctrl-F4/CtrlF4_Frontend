interface Suggestion {
  id: string;
  title: string;
  example: string;
  description: string;
}

interface SuggestionProps {
  suggestions: Suggestion[];
}

export default function Suggestion({ suggestions }: SuggestionProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">개선 제안사항</h2>
      <div className="space-y-6">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="border border-gray-200 rounded-lg p-6"
          >
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                <i className="ri-lightbulb-line"></i>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {suggestion.title}
                </h3>
                <p className="text-gray-700 mb-4">{suggestion.example}</p>
                <div className="bg-primary-50 p-4 rounded-lg">
                  <p className="text-primary-800 text-sm font-medium">
                    제안 내용:
                  </p>
                  <p className="text-primary-700 text-sm mt-1">
                    {suggestion.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
