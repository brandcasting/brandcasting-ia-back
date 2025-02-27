import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from '@localInterceptor/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PATCH', 'PUT'],
    credentials: true,
  });
  app.setGlobalPrefix('api/v1', { exclude: [''] });
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const response = {
          code: 400,
          message: errors.map((error) => ({
            property: error.property,
            message: error.constraints
              ? error.constraints[Object.keys(error.constraints)[0]]
              : `Error en el campo ${error.property}`,
          })),
        };
        return new BadRequestException(response);
      },
      stopAtFirstError: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
