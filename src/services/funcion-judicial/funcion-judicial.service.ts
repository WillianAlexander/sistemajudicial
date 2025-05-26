import { Injectable } from '@nestjs/common';
import axios from 'axios';
import 'dotenv/config';

export interface BuscarCausasRequest {
  numeroCausa?: string;
  actor?: {
    cedulaActor?: string;
    nombreActor?: string;
  };
  demandado?: {
    cedulaDemandado?: string;
    nombreDemandado?: string;
  };
  provincia?: string;
  numeroFiscalia?: string;
  recaptcha?: string;
  first?: number;
  pageSize?: number;
}

@Injectable()
export class FuncionJudicialService {
  private readonly API_URL = process.env.URLCAUSAS;
  private readonly API_URL_INCIDENTE = process.env.URL_INCIDENTE;
  private readonly API_URL_INFO_JUICIO = process.env.URL_INF_JUICIO;
  private readonly API_URL_ACTUACIONES = process.env.URL_ACTUACIONES;

  async buscarCausas(params: BuscarCausasRequest = {}) {
    try {
      const defaultParams: BuscarCausasRequest = {
        numeroCausa: '',
        actor: {
          cedulaActor: '',
          nombreActor: '',
        },
        demandado: {
          cedulaDemandado: '',
          nombreDemandado: '',
        },
        provincia: '',
        numeroFiscalia: '',
        recaptcha: 'verdad',
        first: 1,
        pageSize: 10,
      };

      // Merge default params with provided params
      const requestParams = { ...defaultParams, ...params };

      // Handle pagination parameters
      const page = params.first || 1;
      const size = params.pageSize || 10;

      // Headers para simular una petición desde un navegador
      const headers = {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
        Origin: 'https://procesosjudiciales.funcionjudicial.gob.ec',
        Referer: 'https://procesosjudiciales.funcionjudicial.gob.ec/',
        'Content-Type': 'application/json',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        Connection: 'keep-alive',
      };

      const response = await axios.post(
        `${this.API_URL}?page=${page}&size=${size}`,
        requestParams,
        { headers },
      );

      return response.data;
    } catch (error) {
      console.error('Error al consultar causas:', error);
      throw error;
    }
  }

  async buscarCausasPorCedula(
    cedula: string,
    page: number = 1,
    size: number = 10,
  ) {
    return this.buscarCausas({
      actor: {
        cedulaActor: cedula,
        nombreActor: '',
      },
      first: page,
      pageSize: size,
    });
  }

  async consultarIncidenteJudicatura(numeroCausa: string) {
    try {
      const url = `${this.API_URL_INCIDENTE}/${numeroCausa}`;
      const headers = {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
        Origin: 'https://procesosjudiciales.funcionjudicial.gob.ec',
        Referer: 'https://procesosjudiciales.funcionjudicial.gob.ec/',
        Connection: 'keep-alive',
      };
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      console.error('Error al consultar incidente judicatura:', error);
      throw error;
    }
  }

  async consultarInformacionJuicio(numeroCausa: string) {
    try {
      const url = `${this.API_URL_INFO_JUICIO}/${numeroCausa}`;
      const headers = {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
        Origin: 'https://procesosjudiciales.funcionjudicial.gob.ec',
        Referer: 'https://procesosjudiciales.funcionjudicial.gob.ec/',
        Connection: 'keep-alive',
      };
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      console.error('Error al obtener informacion de juicio:', error);
      throw error;
    }
  }

  async consultarActuaciones(body: {
    idMovimientoJuicioIncidente: number;
    idJuicio: string;
    idJudicatura: string;
    idIncidenteJudicatura: number;
    aplicativo: string;
    nombreJudicatura: string;
    incidente: number;
  }) {
    try {
      const url = this.API_URL_ACTUACIONES;
      const headers = {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
        Origin: 'https://procesosjudiciales.funcionjudicial.gob.ec',
        Referer: 'https://procesosjudiciales.funcionjudicial.gob.ec/',
        'Content-Type': 'application/json',
        Connection: 'keep-alive',
      };
      const response = await axios.post(url!, body, { headers });
      return response.data;
    } catch (error) {
      console.error('Error al obtener actuaciones:', error);
      throw error;
    }
  }
}
