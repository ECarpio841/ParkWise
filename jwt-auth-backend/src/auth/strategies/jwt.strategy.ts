import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Asegura que el token no esté expirado
      secretOrKey: process.env.JWT_SECRET || 'secretKey', // La clave secreta del JWT
    });
  }

  async validate(payload: any) {
    // Aquí puedes realizar validaciones adicionales si es necesario
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
