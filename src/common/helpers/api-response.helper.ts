import {
  RESPONSE_MESSAGES,
  RESPONSE_STATUS,
} from '../constants/response.constants';

export class ApiResponseHelper {
  static ok<T>(message = '', data: T[] = []) {
    return {
      status: RESPONSE_STATUS.OK,
      message,
      data,
    };
  }

  static error(message = '', error: unknown = null) {
    return {
      status: RESPONSE_STATUS.ERROR,
      message,
      error,
    };
  }

  static internalServerError(error: unknown = null) {
    return {
      status: RESPONSE_STATUS.INTERNAL_SERVER_ERROR,
      message: RESPONSE_MESSAGES.SOMETHING_WENT_WRONG,
      error,
    };
  }
}
