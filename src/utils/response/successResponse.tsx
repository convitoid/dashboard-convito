interface SuccessReponse<T> {
  status: string;
  message: string;
  data: T;
}

interface ErrorResponse {
  status: string;
  message: string;
  error: string;
}

export function getSuccessReponse<T>(
  data: T,
  message: string = "Success"
): SuccessReponse<T> {
  return {
    status: "success",
    message,
    data,
  };
}

export function getErrorResponse(
  error: string,
  message: string = "Failed"
): ErrorResponse {
  return {
    status: "error",
    message,
    error,
  };
}
