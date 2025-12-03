type Revision = {
  anchor?: { id?: string | number; title?: string } | null;
  original_excerpt?: string;
  issues?: { risk?: string } | null;
  suggestions?: { safe_alternative?: string } | null;
};

interface RevisionCardProps {
  title?: string;
  revisions?: Revision[];
  embedded?: boolean;
}

export default function RevisionCard({
  title = "수정 제안",
  revisions = [],
  embedded = false,
}: RevisionCardProps) {
  const Content = (
    <div className="relative p-8">
      {!embedded && <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>}
      <div className="space-y-5">
        {revisions.map((rev, idx) => {
          return (
            <div
              key={idx}
              className="relative border border-gray-200 rounded-lg p-5"
            >
              {rev.anchor?.title && (
                <p className="text-sm text-gray-500 mb-2">
                  참조: {rev.anchor.title}
                </p>
              )}
              {rev.original_excerpt && (
                <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-800 whitespace-pre-wrap">
                  {rev.original_excerpt}
                </div>
              )}
              {rev.issues?.risk && (
                <div className="mt-3">
                  <p className="text-sm font-semibold text-gray-800 mb-1">
                    이슈
                  </p>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {rev.issues.risk}
                  </p>
                </div>
              )}
              {rev.suggestions?.safe_alternative && (
                <div className="mt-3">
                  <p className="text-sm font-semibold text-gray-800 mb-1">
                    개정안
                  </p>
                  <div className="bg-primary-50 rounded-md p-3 text-sm text-primary-900 whitespace-pre-wrap">
                    {rev.suggestions.safe_alternative}
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
