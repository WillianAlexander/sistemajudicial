import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FuncionJudicialModule } from './modules/funcion-judicial/funcion-judicial.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [FuncionJudicialModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
