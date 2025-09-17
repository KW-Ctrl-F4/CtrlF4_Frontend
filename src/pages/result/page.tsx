
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface RiskFactor {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
}

interface Suggestion {
  id: string;
  title: string;
  description: string;
  example: string;
}

interface ClauseItem {
  title: string;
  description: string;
}

export default function Result() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'summary' | 'risks' | 'suggestions'>('summary');

  // 더미 데이터
  const analysisData = {
    title: '근로계약서 분석 결과',
    uploadDate: '2024-01-15 14:30',
    fileCount: 1,
    
    clauses: [
      {
        title: '계약 당사자 및 목적',
        description: '계약 당사자를 명시하고 근로관계의 목적과 범위를 정의합니다.'
      },
      {
        title: '업무 범위',
        description: '제공해야 할 서비스나 업무의 구체적인 내용을 명시합니다.'
      },
      {
        title: '급여 조건',
        description: '급여 지급 일정과 금액을 구체적으로 명시합니다.'
      },
      {
        title: '기밀유지',
        description: '기밀정보에 대한 의무사항을 상세히 규정합니다.'
      },
      {
        title: '계약 해지',
        description: '계약 해지 조건과 절차를 명확히 정의합니다.'
      },
      {
        title: '준거법',
        description: '계약을 규율하는 관할 법률을 명시합니다.'
      }
    ],

    riskFactors: [
      {
        id: '1',
        title: '불명확한 급여 조건',
        description: '급여 지급일과 구체적인 금액이 명확하지 않아 분쟁 가능성이 있습니다. 급여 조건을 보다 구체적으로 명시할 필요가 있습니다.',
        severity: 'high' as const
      },
      {
        id: '2',
        title: '광범위한 기밀유지 조항',
        description: '기밀정보의 범위가 너무 광범위하여 시행하기 어려울 수 있습니다. 기밀정보의 범위를 좁히고 기밀유지 의무 기간을 명시해야 합니다.',
        severity: 'medium' as const
      },
      {
        id: '3',
        title: '계약해지 통지기간 누락',
        description: '계약 해지 시 명확한 통지기간이 누락되어 오해와 법적 분쟁 가능성이 있습니다. 명확한 통지기간을 포함해야 합니다.',
        severity: 'medium' as const
      }
    ],

    suggestions: [
      {
        id: '1',
        title: '급여 조건 개정',
        description: '예시: 계약 체결 시 $5,000 지급, 1단계 완료 시 $10,000, 최종 완료 시 $15,000 지급',
        example: '급여 조건을 각 지급 단계별로 구체적인 날짜와 금액을 포함하여 수정하시기 바랍니다.'
      },
      {
        id: '2',
        title: '기밀유지 조항 개선',
        description: '예시: 기밀정보는 독점 소프트웨어, 고객 목록, 재무 데이터로 한정하며, 의무는 계약 종료 후 5년간 지속',
        example: '기밀정보의 범위를 핵심 사업 기밀로만 한정하고, 기밀유지 의무 기간을 합리적으로 설정하시기 바랍니다.'
      },
      {
        id: '3',
        title: '계약해지 통지기간 추가',
        description: '예시: 계약 당사자는 30일 전 서면 통지로 계약을 해지할 수 있습니다',
        example: '계약 해지 시 30일의 서면 통지기간을 명시하는 조항을 추가하시기 바랍니다.'
      }
    ]
  };

  const downloadReport = () => {
    alert('분석 리포트를 다운로드합니다.');
  };

  const shareReport = () => {
    alert('분석 리포트를 공유합니다.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-primary-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <i className="ri-search-line text-white text-lg"></i>
              </div>
              <span className="text-xl font-semibold text-gray-900">CtrlF4</span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link to="/signin" className="text-gray-600 hover:text-gray-900 cursor-pointer whitespace-nowrap">
                Sign In
              </Link>
              <Link to="/history" className="text-gray-600 hover:text-gray-900 cursor-pointer whitespace-nowrap">
                History
              </Link>
              <Link to="/settings" className="text-gray-600 hover:text-gray-900 cursor-pointer whitespace-nowrap">
                Settings
              </Link>
              <button className="text-gray-600 hover:text-gray-900 cursor-pointer whitespace-nowrap">
                Help
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Result Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{analysisData.title}</h1>
              <p className="text-gray-600">업로드: {analysisData.uploadDate}</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={downloadReport}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-download-line mr-2"></i>
                리포트 다운로드
              </button>
              <button
                onClick={shareReport}
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-share-line mr-2"></i>
                공유하기
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('summary')}
                className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer whitespace-nowrap ${
                  activeTab === 'summary'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                주요 조항 요약
              </button>
              <button
                onClick={() => setActiveTab('risks')}
                className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer whitespace-nowrap ${
                  activeTab === 'risks'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                위험 요소 분석
              </button>
              <button
                onClick={() => setActiveTab('suggestions')}
                className={`py-4 px-1 border-b-2 font-medium text-sm cursor-pointer whitespace-nowrap ${
                  activeTab === 'suggestions'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                개선 제안사항
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'summary' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">주요 조항 요약</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {analysisData.clauses.map((clause, index) => (
                <div key={index} className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{clause.title}</h3>
                  <p className="text-gray-700">{clause.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'risks' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">위험 요소 분석</h2>
            <div className="space-y-6">
              {analysisData.riskFactors.map((risk) => (
                <div key={risk.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      risk.severity === 'high'
                        ? 'bg-red-100 text-red-600'
                        : risk.severity === 'medium'
                          ? 'bg-yellow-100 text-yellow-600'
                          : 'bg-green-100 text-green-600'
                    }`}>
                      <i className="ri-alert-line"></i>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{risk.title}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          risk.severity === 'high'
                            ? 'bg-red-100 text-red-800'
                            : risk.severity === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                        }`}>
                          {risk.severity === 'high' ? '높음' : risk.severity === 'medium' ? '중간' : '낮음'}
                        </span>
                      </div>
                      <p className="text-gray-700">{risk.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'suggestions' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">개선 제안사항</h2>
            <div className="space-y-6">
              {analysisData.suggestions.map((suggestion) => (
                <div key={suggestion.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                      <i className="ri-lightbulb-line"></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{suggestion.title}</h3>
                      <p className="text-gray-700 mb-4">{suggestion.example}</p>
                      <div className="bg-primary-50 p-4 rounded-lg">
                        <p className="text-primary-800 text-sm font-medium">제안 내용:</p>
                        <p className="text-primary-700 text-sm mt-1">{suggestion.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link
            to="/"
            className="flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-arrow-left-line mr-2"></i>
            새로운 분석
          </Link>
          <Link
            to="/history"
            className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-history-line mr-2"></i>
            분석 기록 보기
          </Link>
        </div>
      </main>
    </div>
  );
}