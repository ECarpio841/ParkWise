import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service'
import * as bcrypt from 'bcrypt';
import { METHODS } from 'http';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prisma = app.get(PrismaService);
  app.enableCors({
    origin : '*',
    METHODS: 'GET,HEAD,PUT,PATCH,POST,DELETE'
  })

  const adminEmail = 'admin@parking.com';
  const adminPassword = 'admin1987#'; // Cambia esto por una contraseña segura

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    console.log('Admin account created: ', adminEmail);
  }

  await app.listen(3000);
}
bootstrap();
