import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './components/users/user/user.module';
import { TokenModule } from './components/users/token/token.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UserModule, TokenModule, CoreModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
