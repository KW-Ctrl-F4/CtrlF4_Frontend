const API_BASE_URL = import.meta.env.VITE_BASE_URL || "";

// TypeScript 타입 정의
export interface HistoryItem {
  s3_key: string;
  title: string;
  summary_line: string;
}

export interface HistoryResponse {
  history: HistoryItem[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export const dataAPI = {
  getHistory: async (
    accessToken: string
  ): Promise<ApiResponse<HistoryResponse>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/history`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include", // 쿠키 포함
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // 401 에러 처리
        if (response.status === 401) {
          return {
            success: false,
            message: errorData.message || "인증이 필요합니다.",
            error: "UNAUTHORIZED",
          };
        }

        // 기타 에러 처리
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      return {
        success: true,
        data: data,
        message: "히스토리를 성공적으로 불러왔습니다.",
      };
    } catch (error) {
      console.error("Get history error:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "히스토리 조회 중 오류가 발생했습니다.",
        error: "NETWORK_ERROR",
      };
    }
  },
};
