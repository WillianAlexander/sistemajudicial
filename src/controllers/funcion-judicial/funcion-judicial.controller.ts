import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { FuncionJudicialService } from 'src/services/funcion-judicial/funcion-judicial.service';
import { BuscarCausasRequest } from 'src/services/funcion-judicial/funcion-judicial.service';

@Controller('funcion-judicial')
export class FuncionJudicialController {
  constructor(
    private readonly funcionJudicialService: FuncionJudicialService,
  ) {}

  @Post('buscar-causas')
  buscarCausas(@Body() params: BuscarCausasRequest) {
    return this.funcionJudicialService.buscarCausas(params);
  }

  @Get('incidente/:numeroCausa')
  getIncidenteJudicatura(@Param('numeroCausa') numeroCausa: string) {
    return this.funcionJudicialService.consultarIncidenteJudicatura(
      numeroCausa,
    );
  }

  @Get('informacion-juicio/:numeroCausa')
  getInformacionJuicio(@Param('numeroCausa') numeroCausa: string) {
    return this.funcionJudicialService.consultarInformacionJuicio(numeroCausa);
  }

  @Post('actuaciones')
  consultarActuaciones(
    @Body()
    body: {
      idMovimientoJuicioIncidente: number;
      idJuicio: string;
      idJudicatura: string;
      idIncidenteJudicatura: number;
      aplicativo: string;
      nombreJudicatura: string;
      incidente: number;
    },
  ) {
    return this.funcionJudicialService.consultarActuaciones(body);
  }
}
