interface AccountProps {
  onDeleteAccount: () => void;
}

export default function Account({ onDeleteAccount }: AccountProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">계정 관리</h2>
      <div className="space-y-6">
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 mb-4">
            계정을 삭제하면 모든 데이터가 영구적으로 삭제되며, 이 작업은 되돌릴
            수 없습니다.
          </p>
          <button
            onClick={onDeleteAccount}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            계정 삭제
          </button>
        </div>
      </div>
    </div>
  );
}
