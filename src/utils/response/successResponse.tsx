interface SuccessReponse<T> {
    status: number;
    message: string;
    data: T;
}

interface ErrorResponse {
    status: number;
    message: string;
    error: string;
}

export function getSuccessReponse<T>(
    data: T,
    status: number,
    message: string = 'Success'
): SuccessReponse<T> {
    return {
        status,
        message,
        data,
    };
}

export function getErrorResponse(
    error: string,
    status: number,
    message: string = 'Failed'
): ErrorResponse {
    return {
        status,
        message,
        error,
    };
}
