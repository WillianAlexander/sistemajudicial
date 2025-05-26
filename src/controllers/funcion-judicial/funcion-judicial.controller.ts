import { Controller, Post, Body } from '@nestjs/common';
import { FuncionJudicialService } from 'src/services/funcion-judicial/funcion-judicial.service';
import { BuscarCausasRequest } from 'src/services/funcion-judicial/funcion-judicial.service';

@Controller('funcion-judicial')
export class FuncionJudicialController {
    constructor(private readonly funcionJudicialService: FuncionJudicialService) { }

    @Post('buscar-causas')
    buscarCausas(@Body() params: BuscarCausasRequest) {
        return this.funcionJudicialService.buscarCausas(params);
    }
}
