import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly adminEmail = 'admin@parking.com';
  private adminPassword: string;

  constructor(private readonly jwtService: JwtService) {
    // Inicializa el password del administrador de forma asíncrona
    this.initAdminPassword();
  }

  private async initAdminPassword() {
    this.adminPassword = await bcrypt.hash('admin123', 10);
  }

  async validateUser(email: string, password: string): Promise<any> {
    // Valida solo al administrador
    if (email === this.adminEmail && (await bcrypt.compare(password, this.adminPassword))) {
      return { email, role: 'ADMIN' };
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(email: string, password: string): Promise<any> {
    const user = await this.validateUser(email, password);
    const payload = { email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
