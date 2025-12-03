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

type TabType = "qa" | "risk" | "revision" | "summary";

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
  // 사용 가능한 탭 목록 생성 (질의 응답 > 독소 조항 > 수정 제안 > 요약 순서)
  const availableTabs: { type: TabType; label: string; hasContent: boolean }[] =
    [];
  if (hasQA)
    availableTabs.push({ type: "qa", label: "질의 응답", hasContent: true });
  if (hasRisk)
    availableTabs.push({ type: "risk", label: "독소 조항", hasContent: true });
  if (hasRevision)
    availableTabs.push({
      type: "revision",
      label: "수정 제안",
      hasContent: true,
    });
  if (hasSummary)
    availableTabs.push({ type: "summary", label: "요약", hasContent: true });

  // 기본 활성 탭: 첫 번째 사용 가능한 탭
  const defaultTab = availableTabs.length > 0 ? availableTabs[0].type : "qa";
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);

  // 활성 탭에 맞는 컨텐츠 렌더링
  const renderActiveContent = () => {
    switch (activeTab) {
      case "qa":
        if (!hasQA || (!qaQuestion && !qaAnswer)) {
          return (
            <div className="text-center py-12 text-gray-500">
              <p>질의 응답 결과가 없습니다.</p>
            </div>
          );
        }
        return (
          <QACard
            embedded
            title="질의 응답"
            question={qaQuestion}
            answer={qaAnswer}
            focus={qaFocus}
            anchors={qaAnchors}
          />
        );
      case "risk":
        if (!hasRisk || !riskItems || riskItems.length === 0) {
          return (
            <div className="text-center py-12 text-gray-500">
              <p>독소 조항 결과가 없습니다.</p>
            </div>
          );
        }
        return <RiskCard embedded title="독소 조항" items={riskItems} />;
      case "revision":
        if (!hasRevision || !revisions || revisions.length === 0) {
          return (
            <div className="text-center py-12 text-gray-500">
              <p>수정 제안 결과가 없습니다.</p>
            </div>
          );
        }
        return (
          <RevisionCard embedded title="수정 제안" revisions={revisions} />
        );
      case "summary":
        if (!hasSummary || !summaryText) {
          return (
            <div className="text-center py-12 text-gray-500">
              <p>요약 결과가 없습니다.</p>
            </div>
          );
        }
        return (
          <SummaryCard
            embedded
            title="요약"
            summary={summaryText}
            anchors={summaryAnchors}
          />
        );
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
    </div>
  );
}
