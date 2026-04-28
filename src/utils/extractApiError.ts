export const extractApiError = (err: any) => {
  return {
    code: err?.response?.data?.error?.code || "UNKNOWN_ERROR",
    message:
      err?.response?.data?.error?.message ||
      err?.message ||
      "Something went wrong",
  };
};