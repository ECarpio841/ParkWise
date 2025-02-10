import { Controller,Get, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Post('spaces')
async updateSpace(@Body() data: any) {
  try {
    console.log('Datos recibidos:', data);
    return await this.statsService.updateSpaceData(data);
  } catch (error) {
    console.error('Error al procesar los datos:', error.message);
    throw new HttpException(
      'Error al procesar los datos',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}

  // Endpoint para obtener todos los datos de los espacios
  @Get('spacesall')
  async getAllSpaces() {
    try {
      return await this.statsService.getAllSpaces();
    } catch (error) {
      throw new HttpException(
        'No se pudieron obtener los datos de los espacios',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}