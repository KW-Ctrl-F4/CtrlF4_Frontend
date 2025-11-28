import { useMemo, useState } from "react";

type AnchorItem = { id?: string | number; title?: string };

interface QACardProps {
  title?: string;
  question?: string;
  answer?: string;
  focus?: string[];
  anchors?: AnchorItem[];
  embedded?: boolean;
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function useHighlightedAnswer(answer?: string, focus?: string[]) {
  return useMemo(() => {
    if (!answer) return null;
    const uniqueTerms = Array.from(new Set((focus || []).filter(Boolean)));
    if (uniqueTerms.length === 0) return <span>{answer}</span>;
    // 하나의 통합 정규식으로 하이라이트
    const pattern = new RegExp(uniqueTerms.map(escapeRegExp).join("|"), "gi");
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(answer)) !== null) {
      const start = match.index;
      const end = pattern.lastIndex;
      if (start > lastIndex) {
        parts.push(
          <span key={`t-${lastIndex}`}>{answer.slice(lastIndex, start)}</span>
        );
      }
      parts.push(
        <mark
          key={`m-${start}`}
          className="bg-yellow-100 text-gray-900 rounded-sm px-0.5"
        >
          {answer.slice(start, end)}
        </mark>
      );
      lastIndex = end;
    }
    if (lastIndex < answer.length) {
      parts.push(<span key={`t-${lastIndex}`}>{answer.slice(lastIndex)}</span>);
    }
    return <span>{parts}</span>;
  }, [answer, focus]);
}

export default function QACard({
  title = "Q&A",
  question,
  answer,
  focus,
  anchors,
  embedded = false,
}: QACardProps) {
  const highlighted = useHighlightedAnswer(answer, focus);
  const [showAnchors, setShowAnchors] = useState(false);

  const hasAnchors = Boolean(anchors?.length);
  const anchorList = useMemo(() => {
    return (Array.isArray(anchors) ? anchors : [])
      .filter((a) => a && (a.title || a.id !== undefined))
      .slice(0, 10);
  }, [anchors]);

  const Content = (
    <div className="relative p-8">
      {!embedded && (
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      )}
      <div className="space-y-3">
        {question && (
          <div className="rounded-md bg-gray-50 p-3">
            <p className="text-sm font-semibold text-gray-800">질문</p>
            <p className="text-gray-800">{question}</p>
          </div>
        )}
        <div className="relative rounded-md bg-primary-50 p-3">
          <div className="flex items-start justify-between mb-1">
            <p className="text-sm font-semibold text-primary-900">답변</p>
            {hasAnchors && (
              <button
                onClick={() => setShowAnchors(!showAnchors)}
                className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                <i
                  className={`ri-anchor-line ${
                    showAnchors ? "text-primary-700" : ""
                  }`}
                ></i>
                참조 앵커 {showAnchors ? "숨기기" : "보기"}
              </button>
            )}
          </div>
          <p className="text-primary-900 leading-relaxed">{highlighted}</p>
          {showAnchors && hasAnchors && (
            <div className="mt-4 p-4 bg-white border-l-4 border-primary-500 rounded-r-lg">
              <p className="text-sm font-semibold text-primary-900 mb-2">
                <i className="ri-anchor-line mr-1"></i>
                참조 앵커
              </p>
              <ul className="space-y-2">
                {anchorList.map((anchor, anchorIdx) => (
                  <li
                    key={String(anchor.id ?? anchorIdx)}
                    className="text-sm text-gray-700 flex items-start"
                  >
                    <span className="inline-block w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">
                        {anchor.title || "제목 없음"}
                      </span>
                      {anchor.id !== undefined && (
                        <span className="text-xs text-gray-500 ml-2">
                          #{anchor.id}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {(focus?.length ?? 0) > 0 && (
          <p className="text-xs text-gray-500">
            강조 키워드: {focus!.join(", ")}
          </p>
        )}
      </div>
    </div>
  );

  if (embedded) return Content;
  return (
    <div className="relative bg-white rounded-2xl shadow-xl">{Content}</div>
  );
}
