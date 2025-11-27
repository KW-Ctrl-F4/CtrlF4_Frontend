import { useState } from "react";
import SummaryCard from "./SummaryCard";
import RiskCard from "./RiskCard";
import RevisionCard from "./RevisionCard";
import QACard from "./QACard";
import type { AnchorItem, RiskItem, RevisionItem } from "../utils";

interface ResultsCardProps {
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

type TabType = "qa" | "risk" | "summary";

export default function ResultsCard({
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
}: ResultsCardProps) {
  // 사용 가능한 탭 목록 생성 (Q&A, Risk, Summary 순서)
  const availableTabs: { type: TabType; label: string; hasContent: boolean }[] =
    [];
  if (hasQA) availableTabs.push({ type: "qa", label: "Q&A", hasContent: true });
  if (hasRisk)
    availableTabs.push({ type: "risk", label: "Risk", hasContent: true });
  if (hasSummary)
    availableTabs.push({ type: "summary", label: "Summary", hasContent: true });

  // 기본 활성 탭: 첫 번째 사용 가능한 탭
  const defaultTab = availableTabs.length > 0 ? availableTabs[0].type : "qa";
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);

  // 활성 탭에 맞는 컨텐츠 렌더링
  const renderActiveContent = () => {
    switch (activeTab) {
      case "qa":
        return hasQA ? (
          <QACard
            embedded
            title="Q&A"
            question={qaQuestion}
            answer={qaAnswer}
            focus={qaFocus}
            anchors={qaAnchors}
          />
        ) : null;
      case "risk":
        return hasRisk ? (
          <RiskCard embedded title="Risk" items={riskItems} />
        ) : null;
      case "summary":
        return hasSummary ? (
          <SummaryCard
            embedded
            title="Summary"
            summary={summaryText}
            anchors={summaryAnchors}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* 탭 네비게이션 */}
      {availableTabs.length > 0 && (
        <div className="border-b border-gray-200">
          <div className="flex space-x-1 px-4 md:px-6">
            {availableTabs.map((tab) => (
              <button
                key={tab.type}
                onClick={() => setActiveTab(tab.type)}
                className={`px-4 py-3 text-sm font-medium transition-all duration-200 relative ${
                  activeTab === tab.type
                    ? "text-primary-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
                {activeTab === tab.type && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 활성 탭 컨텐츠 */}
      <div className="p-4 md:p-6">{renderActiveContent()}</div>

      {/* Revision은 탭 밖에 별도로 표시 (있는 경우) */}
      {hasRevision && (
        <section id="section-revision" className="border-t border-gray-100">
          <RevisionCard embedded title="Revision" revisions={revisions} />
        </section>
      )}
    </div>
  );
}
