import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { StatsController } from './stats/stats.controller';
import { StatsModule } from './stats/stats.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [AuthModule, StatsModule, HttpModule],
  providers: [PrismaService],
  controllers: [StatsController],
})
export class AppModule {}
