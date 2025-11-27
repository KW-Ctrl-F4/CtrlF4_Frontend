import { useState } from "react";

type Severity = "low" | "medium" | "high" | string;

type RiskItem = {
  riskType?: string;
  severity?: Severity;
  reason?: string;
  original_excerpt?: string;
  anchor?: { id?: string | number; title?: string } | null;
};

interface RiskCardProps {
  title?: string;
  items?: RiskItem[];
  embedded?: boolean;
}

function severityBadgeClasses(severity?: Severity) {
  const s = String(severity || "").toLowerCase();
  if (s === "high") return "bg-red-100 text-red-800";
  if (s === "medium") return "bg-yellow-100 text-yellow-800";
  if (s === "low") return "bg-green-100 text-green-800";
  return "bg-gray-100 text-gray-800";
}

export default function RiskCard({
  title = "Risk",
  items = [],
  embedded = false,
}: RiskCardProps) {
  const [expandedIdx, setExpandedIdx] = useState<Set<number>>(new Set());
  const MAX_EXCERPT_LENGTH = 300;

  const toggleExpand = (idx: number) => {
    setExpandedIdx((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(idx)) {
        newSet.delete(idx);
      } else {
        newSet.add(idx);
      }
      return newSet;
    });
  };

  const Content = (
    <div className="relative p-8">
      {!embedded && <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>}
      <div className="space-y-4">
        {items.map((it, idx) => {
          const isLongExcerpt =
            (it.original_excerpt?.length || 0) > MAX_EXCERPT_LENGTH;
          const isExpanded = expandedIdx.has(idx);
          const displayExcerpt =
            isLongExcerpt && !isExpanded
              ? it.original_excerpt?.slice(0, MAX_EXCERPT_LENGTH) + "..."
              : it.original_excerpt;

          return (
            <div
              key={idx}
              className="relative border border-gray-200 rounded-lg p-5"
            >
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {it.riskType || "Risk"}
                </h3>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${severityBadgeClasses(
                    it.severity
                  )}`}
                >
                  {String(it.severity || "unknown")}
                </span>
              </div>
              {it.reason && (
                <p className="mt-2 text-gray-700 whitespace-pre-wrap">
                  {it.reason}
                </p>
              )}
              {it.anchor?.title && (
                <p className="mt-1 text-sm text-gray-500">
                  참조: {it.anchor.title}
                </p>
              )}

              {/* 원문 항상 표시 */}
              {it.original_excerpt && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-gray-600 mb-1">
                    원문
                  </p>
                  <div
                    onClick={
                      isLongExcerpt ? () => toggleExpand(idx) : undefined
                    }
                    className={`bg-gray-50 text-gray-800 rounded-md p-3 text-sm whitespace-pre-wrap transition-colors ${
                      isLongExcerpt
                        ? "cursor-pointer hover:bg-gray-100 hover:border-gray-300 border border-gray-200"
                        : "border border-gray-200"
                    }`}
                  >
                    {displayExcerpt}
                    {isLongExcerpt && !isExpanded && (
                      <span className="block mt-2 text-xs text-gray-500 italic">
                        클릭하여 전체보기
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  if (embedded) return Content;
  return (
    <div className="relative bg-white rounded-2xl shadow-xl">{Content}</div>
  );
}
