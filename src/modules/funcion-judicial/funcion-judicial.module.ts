import { Module } from '@nestjs/common';
import { FuncionJudicialService } from 'src/services/funcion-judicial/funcion-judicial.service';
import { FuncionJudicialController } from 'src/controllers/funcion-judicial/funcion-judicial.controller';

@Module({ imports: [], controllers: [FuncionJudicialController], providers: [FuncionJudicialService], exports: [FuncionJudicialService] })
export class FuncionJudicialModule { }
