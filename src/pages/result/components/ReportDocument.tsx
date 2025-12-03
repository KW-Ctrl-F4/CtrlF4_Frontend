import SummaryCard from "./SummaryCard";
import RiskCard from "./RiskCard";
import RevisionCard from "./RevisionCard";
import QACard from "./QACard";
import type { AnchorItem, RiskItem, RevisionItem } from "../utils";

interface ReportDocumentProps {
  title: string;
  uploadDate: string;
  hasSummary: boolean;
  hasRisk: boolean;
  hasRevision: boolean;
  hasQA: boolean;
  summaryText?: string;
  summaryAnchors?: AnchorItem[];
  riskItems?: RiskItem[];
  revisions?: RevisionItem[];
  qaQuestion?: string;
  qaAnswer?: string;
  qaFocus?: string[];
  qaAnchors?: AnchorItem[];
}

export default function ReportDocument({
  title,
  uploadDate,
  hasSummary,
  hasRisk,
  hasRevision,
  hasQA,
  summaryText,
  summaryAnchors = [],
  riskItems = [],
  revisions = [],
  qaQuestion,
  qaAnswer,
  qaFocus = [],
  qaAnchors = [],
}: ReportDocumentProps) {
  return (
    <div className="bg-white text-gray-900">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-gray-600">업로드: {uploadDate}</p>
      </div>

      {hasSummary && summaryText && (
        <div className="mb-6">
          <SummaryCard embedded title="요약" summary={summaryText} anchors={summaryAnchors} />
        </div>
      )}

      {hasRisk && riskItems.length > 0 && (
        <div className="mb-6">
          <RiskCard embedded title="독소 조항" items={riskItems} />
        </div>
      )}

      {hasRevision && revisions.length > 0 && (
        <div className="mb-6">
          <RevisionCard embedded title="수정 제안" revisions={revisions} />
        </div>
      )}

      {hasQA && (qaQuestion || qaAnswer) && (
        <div className="mb-6">
          <QACard embedded title="질의 응답" question={qaQuestion} answer={qaAnswer} focus={qaFocus} anchors={qaAnchors} />
        </div>
      )}
    </div>
  );
}


