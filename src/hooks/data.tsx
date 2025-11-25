const API_BASE_URL = import.meta.env.VITE_BASE_URL || "";

export interface HistoryItem {
  s3_key: string;
  run_id: string;
  title: string;
  summary_line: string;
}

export interface HistoryResponse {
  history: HistoryItem[];
}

export interface DeleteHistoryRequest {
  run_id: string;
}

export interface DeleteHistoryResponse {
  message: string;
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

  deleteHistory: async (
    accessToken: string,
    runId: string
  ): Promise<ApiResponse<DeleteHistoryResponse>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/history`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include", // 쿠키 포함
        body: JSON.stringify({ run_id: runId }),
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

        // 400 에러 처리
        if (response.status === 400) {
          return {
            success: false,
            message: errorData.message || "잘못된 요청입니다.",
            error: "BAD_REQUEST",
          };
        }

        // 404 에러 처리
        if (response.status === 404) {
          return {
            success: false,
            message: errorData.message || "해당 히스토리를 찾을 수 없습니다.",
            error: "NOT_FOUND",
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
        message: data.message || "히스토리가 삭제되었습니다.",
      };
    } catch (error) {
      console.error("Delete history error:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "히스토리 삭제 중 오류가 발생했습니다.",
        error: "NETWORK_ERROR",
      };
    }
  },
};
