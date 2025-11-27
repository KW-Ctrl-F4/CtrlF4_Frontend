import { useMemo } from "react";

interface QACardProps {
  title?: string;
  question?: string;
  answer?: string;
  focus?: string[];
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
  embedded = false,
}: QACardProps) {
  const highlighted = useHighlightedAnswer(answer, focus);

  const Content = (
    <div className="relative p-8">
      {!embedded && <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>}
      <div className="space-y-3">
        {question && (
          <div className="rounded-md bg-gray-50 p-3">
            <p className="text-sm font-semibold text-gray-800">질문</p>
            <p className="text-gray-800">{question}</p>
          </div>
        )}
        <div className="relative rounded-md bg-primary-50 p-3">
          <p className="text-sm font-semibold text-primary-900 mb-1">답변</p>
          <p className="text-primary-900 leading-relaxed">{highlighted}</p>
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
