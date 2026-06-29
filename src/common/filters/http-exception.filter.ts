import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponseHelper } from '../helpers/api-response.helper';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
        return response
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json(ApiResponseHelper.internalServerError(exceptionResponse));
      }

      return response
        .status(statusCode)
        .json(this.toErrorResponse(exceptionResponse));
    }

    return response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(ApiResponseHelper.internalServerError(exception));
  }

  private toErrorResponse(exceptionResponse: string | object) {
    if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'status' in exceptionResponse
    ) {
      return exceptionResponse;
    }

    return ApiResponseHelper.error(
      this.getMessage(exceptionResponse),
      exceptionResponse,
    );
  }

  private getMessage(exceptionResponse: string | object) {
    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }

    if (
      'message' in exceptionResponse &&
      typeof exceptionResponse.message === 'string'
    ) {
      return exceptionResponse.message;
    }

    return '';
  }
}
