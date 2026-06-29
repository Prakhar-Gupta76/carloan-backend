export class ApiResponseHelper {
  static ok<T>(message = '', data: T[] = []) {
    return {
      status: 'ok',
      message,
      data,
    };
  }

  static error(message = '', error: unknown = null) {
    return {
      status: 'error',
      message,
      error,
    };
  }

  static internalServerError(error: unknown = null) {
    return {
      status: 'internal server error',
      message: 'Something went wrong. Please try later',
      error,
    };
  }
}
