import { Controller, Post, Body, Get, UseGuards, Request, ConflictException, InternalServerErrorException} from '@nestjs/common';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '../prisma/prisma.service'; // Importar
import { JwtAuthGuard } from './guards/jwt-auth.guard'; // Importar guardia
import { Request as ExpressRequest } from 'express';
import { Prisma } from '@prisma/client';
interface CustomRequest extends ExpressRequest {
  user: {
    role: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly prisma: PrismaService
  ) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('register')
async register(@Body() registerDto: RegisterDto) {
  try {
    // Verificar si el email ya existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email }
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Crear el usuario si el email no existe
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    return await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        role: 'ADMIN'
      }
    });
    
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') { // Código de error de Prisma para restricciones únicas
        throw new ConflictException('El email ya está registrado');
      }
    }
    throw new InternalServerErrorException('Error al registrar el usuario');
  }
}
  
  @Get('verify')
@UseGuards(JwtAuthGuard)
async verifyToken(@Request() req: Request) { // Especificar tipo
  return { role: req['role'] }; // Usar notación de corchetes
}

  
  @Get('protected')
  @UseGuards(JwtAuthGuard)
  async protectedRoute() {
    return { message: 'Acceso autorizado' };
  }
  

}

