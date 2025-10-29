export const authAPI = {
  signup: async ({
    nickname,
    email,
    password,
  }: {
    nickname: string;
    email: string;
    password: string;
  }) => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          nickname,
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      return {
        success: true,
        message: data.message || "회원가입이 완료되었습니다.",
        data: data,
      };
    } catch (error) {
      console.error("Signup error:", error);
      console.error("Error type:", typeof error);
      console.error(
        "Error name:",
        error instanceof Error ? error.name : "Unknown"
      );

      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "회원가입 중 오류가 발생했습니다.",
        error: error instanceof Error ? error.name : "NETWORK_ERROR",
      };
    }
  },

  signin: async ({ email, password }: { email: string; password: string }) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      console.log("Login response data:", data);

      return {
        success: true,
        message: data.message || "로그인이 완료되었습니다.",
        data: data,
      };
    } catch (error) {
      console.error("Signin error:", error);
      console.error("Error type:", typeof error);
      console.error(
        "Error name:",
        error instanceof Error ? error.name : "Unknown"
      );

      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "로그인 중 오류가 발생했습니다.",
        error: error instanceof Error ? error.name : "NETWORK_ERROR",
      };
    }
  },

  // 로그아웃 API
  logout: async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include", // 쿠키 포함
      });

      return {
        success: true,
        message: "로그아웃되었습니다.",
      };
    } catch (error) {
      return {
        success: false,
        message: "로그아웃 중 오류가 발생했습니다.",
        error: "NETWORK_ERROR",
      };
    }
  },

  // 닉네임 변경 API (Authorization: Bearer access_token)
  updateNickname: async ({
    nickname,
    accessToken,
  }: {
    nickname: string;
    accessToken: string;
  }) => {
    try {
      const response = await fetch("/api/account/nickname", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ nickname }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      return {
        success: true,
        message: data.message || "닉네임이 변경되었습니다.",
        data,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "닉네임 변경 중 오류가 발생했습니다.",
        error: "NETWORK_ERROR",
      };
    }
  },

  // 계정 삭제 API
  deleteAccount: async ({
    password,
    accessToken,
  }: {
    password: string;
    accessToken: string;
  }) => {
    try {
      const response = await fetch("/api/account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      return {
        success: true,
        message: data.message || "계정이 삭제되었습니다.",
        data,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "계정 삭제 중 오류가 발생했습니다.",
        error: "NETWORK_ERROR",
      };
    }
  },
};
