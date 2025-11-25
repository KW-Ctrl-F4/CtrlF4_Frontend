import { useMemo, useState } from "react";

type AnchorItem = { id?: string | number; title?: string };

interface SummaryCardProps {
  title?: string;
  summary?: string;
  anchors?: AnchorItem[];
  embedded?: boolean;
}

function splitIntoSentences(text?: string): string[] {
  if (!text) return [];
  // 간단한 문장 분리: 마침표/물음표/느낌표 기준으로 분리 후 트림
  const parts = text
    .split(/(?<=[.!?])\s+/g)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length ? parts : [text];
}

export default function SummaryCard({
  title = "Summary",
  summary,
  anchors,
  embedded = false,
}: SummaryCardProps) {
  const sentences = useMemo(() => splitIntoSentences(summary), [summary]);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);

  const hasAnchors = Boolean(anchors?.length);
  const anchorList = useMemo(() => {
    return (Array.isArray(anchors) ? anchors : [])
      .filter((a) => a && (a.title || a.id !== undefined))
      .slice(0, 10);
  }, [anchors]);

  const handleSentenceClick = (idx: number) => {
    if (!hasAnchors) return;
    setClickedIndex((current) => (current === idx ? null : idx));
  };

  const Content = (
    <div className="relative p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      <div className="space-y-3">
        {sentences.map((sentence, idx) => {
          const isClicked = clickedIndex === idx;
          const showAnchors = isClicked && hasAnchors;

          return (
            <div key={idx} className="relative">
              <p
                onClick={() => handleSentenceClick(idx)}
                className={`leading-relaxed transition-colors ${
                  hasAnchors
                    ? "cursor-pointer hover:text-primary-600"
                    : "text-gray-800"
                } ${
                  isClicked ? "text-primary-700 font-medium" : "text-gray-800"
                }`}
              >
                {sentence}
              </p>

              {showAnchors && (
                <div className="mt-3 ml-4 p-4 bg-primary-50 border-l-4 border-primary-500 rounded-r-lg animate-fade-in">
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
