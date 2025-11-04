export const dataAPI = {
  getHistory: async ({
    accessToken,
    id,
  }: {
    accessToken: string;
    id: string;
  }) => {
    try {
      const response = await fetch("/api/history", {
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
