
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface HistoryItem {
  id: string;
  title: string;
  uploadDate: string;
  description: string;
  fileCount: number;
  status: 'completed' | 'processing' | 'failed';
}

export default function History() {
  // 더미 히스토리 데이터
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([
    {
      id: '1',
      title: '근로계약서_2024',
      uploadDate: '2024-01-15 14:30',
      description: '근로계약서 검토 및 주요 조항 분석. 급여, 근무시간, 휴가 규정 등 핵심 내용 정리',
      fileCount: 1,
      status: 'completed'
    },
    {
      id: '2',
      title: '부동산 매매계약서',
      uploadDate: '2024-01-12 10:15',
      description: '아파트 매매계약서 리스크 분석. 특약사항 및 대금지급 조건 검토',
      fileCount: 2,
      status: 'completed'
    },
    {
      id: '3',
      title: '프리랜서 업무계약서',
      uploadDate: '2024-01-10 16:45',
      description: '디자인 업무 계약서 분석 중. 저작권 및 수정 범위 조항 검토 진행',
      fileCount: 1,
      status: 'processing'
    },
    {
      id: '4',
      title: '임대차계약서',
      uploadDate: '2024-01-08 09:20',
      description: '상가 임대차계약서 주요 조항 분석. 임대료 인상, 보증금 반환 조건 등',
      fileCount: 3,
      status: 'completed'
    },
    {
      id: '5',
      title: '투자계약서',
      uploadDate: '2024-01-05 13:40',
      description: '스타트업 투자계약서 검토 실패. 파일 형식 오류로 재업로드 필요',
      fileCount: 1,
      status: 'failed'
    }
  ]);

  const deleteHistoryItem = (id: string) => {
    if (confirm('이 분석 기록을 삭제하시겠습니까?')) {
      setHistoryItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const downloadReport = (item: HistoryItem) => {
    if (item.status !== 'completed') {
      alert('분석이 완료된 후 다운로드할 수 있습니다.');
      return;
    }
    // 실제로는 파일 다운로드 로직
    alert(`${item.title} 리포트를 다운로드합니다.`);
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
              <Link to="/history" className="text-primary-600 font-medium cursor-pointer whitespace-nowrap">
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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">분석 히스토리</h1>
          <p className="text-gray-600">업로드한 계약서들의 분석 기록을 확인하세요</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">전체 분석 기록</h2>
              <span className="text-sm text-gray-500">총 {historyItems.length}개</span>
            </div>

            {historyItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <i className="ri-file-text-line text-2xl text-gray-400"></i>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">분석 기록이 없습니다</h3>
                <p className="text-gray-600 mb-6">첫 번째 계약서를 업로드해보세요</p>
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-upload-line mr-2"></i>
                  계약서 업로드
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {historyItems.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : item.status === 'processing'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {item.status === 'completed' && <i className="ri-check-line mr-1"></i>}
                            {item.status === 'processing' && <i className="ri-loader-4-line mr-1 animate-spin"></i>}
                            {item.status === 'failed' && <i className="ri-close-line mr-1"></i>}
                            {item.status === 'completed' ? '완료' : item.status === 'processing' ? '분석중' : '실패'}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center">
                            <i className="ri-calendar-line mr-1"></i>
                            {item.uploadDate}
                          </span>
                          <span className="flex items-center">
                            <i className="ri-file-line mr-1"></i>
                            {item.fileCount}개 파일
                          </span>
                        </div>
                        
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => downloadReport(item)}
                          disabled={item.status !== 'completed'}
                          className={`p-2 rounded-lg transition-colors cursor-pointer ${
                            item.status === 'completed'
                              ? 'text-primary-600 hover:bg-primary-50'
                              : 'text-gray-400 cursor-not-allowed'
                          }`}
                          title="리포트 다운로드"
                        >
                          <i className="ri-download-line text-lg"></i>
                        </button>
                        <button
                          onClick={() => deleteHistoryItem(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="삭제"
                        >
                          <i className="ri-delete-bin-line text-lg"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}