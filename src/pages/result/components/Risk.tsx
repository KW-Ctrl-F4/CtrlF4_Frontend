interface RiskFactor {
  id: string;
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
}

interface RiskProps {
  riskFactors: RiskFactor[];
}

export default function Risk({ riskFactors }: RiskProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">위험 요소 분석</h2>
      <div className="space-y-6">
        {riskFactors.map((risk) => (
          <div key={risk.id} className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  risk.severity === "high"
                    ? "bg-red-100 text-red-600"
                    : risk.severity === "medium"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                <i className="ri-alert-line"></i>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {risk.title}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      risk.severity === "high"
                        ? "bg-red-100 text-red-800"
                        : risk.severity === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {risk.severity === "high"
                      ? "높음"
                      : risk.severity === "medium"
                      ? "중간"
                      : "낮음"}
                  </span>
                </div>
                <p className="text-gray-700">{risk.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
