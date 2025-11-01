interface RoleSelectorProps {
  roles: string[];
  onSelect: (role: string) => void;
}

export default function RoleSelector({ roles, onSelect }: RoleSelectorProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">당신의 역할/직책은 무엇인가요?</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {roles.map((r) => (
          <button
            key={r}
            onClick={() => onSelect(r)}
            className="text-left p-4 border rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-colors cursor-pointer"
          >
            <div className="font-medium text-gray-900">{r}</div>
            <div className="text-sm text-gray-600">추천 역할</div>
          </button>
        ))}
      </div>
    </div>
  );
}


