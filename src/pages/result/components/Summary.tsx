interface Clause {
  title: string;
  description: string;
}

interface SummaryProps {
  clauses: Clause[];
}

export default function Summary({ clauses }: SummaryProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">주요 조항 요약</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {clauses.map((clause, index) => (
          <div key={index} className="p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {clause.title}
            </h3>
            <p className="text-gray-700">{clause.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
