interface ProfileProps {
  formData: {
    name: string;
    email: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isDirty: boolean;
  isLoading: boolean;
}

export default function Profile({
  formData,
  onInputChange,
  onSubmit,
  isDirty,
  isLoading,
}: ProfileProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">프로필 설정</h2>
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            이름
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            이메일
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            readOnly
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
          />
        </div>
        <div className="pt-4">
          <button
            type="submit"
            disabled={!isDirty || isLoading}
            className={`px-6 py-3 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center ${
              isDirty && !isLoading
                ? "bg-primary-600 text-white hover:bg-primary-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                저장 중...
              </>
            ) : (
              "저장하기"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
