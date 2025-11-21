const API_BASE_URL = import.meta.env.VITE_BASE_URL || "";

export const dataAPI = {
  getHistory: async ({
    accessToken,
    id,
  }: {
    accessToken: string;
    id: string;
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/history`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error("Get history error:", error);
      return {
        success: false,
        message: "History retrieval failed",
        error: "NETWORK_ERROR",
      };
    }
  },
};
