import { Module } from '@nestjs/common';
import { AuthService } from 'src/services/auth.service';
import { AuthController } from 'src/controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '7d' },
    })], controllers: [AuthController], providers: [AuthService], exports: [AuthService]
})
export class AuthModule { }
