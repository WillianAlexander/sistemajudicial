import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from 'src/services/auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(
        @Body() body: { usuario: string; password: string; token?: string },
    ) {
        try {
            const { usuario, password, token } = body;
            return await this.authService.loginUser(usuario, password, token);
        } catch (error) {
            console.log(error);
            throw new HttpException(
                {
                    status: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
                    message: error.message || 'Error interno del servidor',
                    details: error.details || null,
                },
                error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
