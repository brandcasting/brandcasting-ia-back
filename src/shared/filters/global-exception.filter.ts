import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { MongoServerError } from 'mongodb';
import mongoose from 'mongoose';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected error occurred';
    let location = 'Unknown location';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();
      message = typeof errorResponse === 'string' ? errorResponse : (errorResponse as any).message;
    }

    // 🚨 Manejar errores de MongoDB
    if (exception instanceof MongoServerError) {
      status = HttpStatus.BAD_REQUEST;
      message = this.translateMongoError(exception);
    }

    // 🚨 Manejar errores de Mongoose (CastError)
    if (exception instanceof mongoose.Error.CastError) {
      status = HttpStatus.BAD_REQUEST;
      message = `Invalid value '${exception.value}' for field '${exception.path}'`;
    }

    // 📌 Extraer la ubicación del error desde la stack trace
    if (exception instanceof Error && exception.stack) {
      const stackLines = exception.stack.split('\n');
      const relevantLine = stackLines[1]?.trim(); // Segunda línea suele tener la ubicación
      location = relevantLine || 'Unknown location';
    }

    console.log('🚨 Error capturado:', {
      code: status,
      message,
      location,
    });

    response.status(status).json({
      code: status,
      message,
    });
  }

  /**
   * Traduce errores de MongoDB a mensajes amigables.
   */
  private translateMongoError(error: MongoServerError): string {
    switch (error.code) {
      case 11000:
        return 'Duplicate key error: The provided value already exists.';
      case 121:
        return 'Schema validation failed: Invalid document structure.';
      default:
        return 'A database error occurred.';
    }
  }
}
