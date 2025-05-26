import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as http from 'http';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(user: {
    usuario: string;
    nombres: string;
    identificacion: string;
    correo: string;
  }) {
    const payload = {
      usuario: user.usuario,
      nombres: user.nombres, // Nombre completo del usuario
      correo: user.correo, // Correo electrónico
      identificacion: user.identificacion, // Identificación del usuario
    };

    if (!process.env.JWT_SECRET) {
      throw new Error(
        'JWT_SECRET no está configurado en las variables de entorno',
      );
    }

    const token = this.jwtService.sign(payload, {
      expiresIn: '7d', // Token válido por 7 días
      secret: process.env.JWT_SECRET, // Clave secreta desde las variables de entorno
    });

    const decodedToken = this.jwtService.decode(token);

    return {
      access_token: token,
      expires_at: new Date(decodedToken.exp * 1000),
    };
  }

  validateToken(token: string): any {
    try {
      // Verifica el token usando la clave secreta
      return this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET, // Clave secreta desde las variables de entorno
      });
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  async loginUser(
    usuario: string,
    password: string,
    clientToken?: string,
  ): Promise<any> {
    const data = {
      usuario,
      password,
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: process.env.AUTHORIZATIONLOGIN!,
    };

    try {
      const response = await axios.post(
        'http://192.168.112.133:5000/api/LoginCore',
        data,
        { headers },
      );

      const externalResponse = response.data;

      if (externalResponse.ok) {
        // Si se envió un token desde el frontend, validarlo
        if (clientToken) {
          try {
            const validatedPayload = this.validateToken(clientToken);
            return {
              ...externalResponse,
              token: clientToken,
              validatedPayload,
            };
          } catch (error) {
            throw {
              statusCode: 401,
              message: 'Token inválido o expirado',
              details: error.message,
            };
          }
        } else {
          // Si no se envió un token, generar uno nuevo
          const signedToken = await this.login({
            usuario: usuario,
            nombres: externalResponse.data.nombreLegal,
            identificacion: externalResponse.data.identifiacion,
            correo: externalResponse.data.email,
          });

          return {
            ...externalResponse,
            token: signedToken.access_token,
          };
        }
      } else {
        throw {
          statusCode: 401,
          message: 'Error de autenticación',
          details: externalResponse.messages,
        };
      }
    } catch (error) {
      if (error.response) {
        throw new Error(
          `Error: ${error.response.status} - ${error.response.statusText}. Response: ${JSON.stringify(
            error.response.data,
          )}`,
        );
      }
      throw new Error(`Request error: ${error.message}`);
    }
  }
}
