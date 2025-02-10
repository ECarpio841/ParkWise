import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service'; // PrismaService configurado en tu proyecto

@Module({
  imports : [HttpModule],
  controllers: [StatsController],
  providers: [StatsService, PrismaService],
  exports : [StatsService]
})
export class StatsModule {}
