import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  private readonly logger = new Logger(StatsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async updateSpaceData(data: { spaceId: string, occupied: boolean, startTime: number, endTime: number, duration: number, dateTime: string }) {
    try {
      const { spaceId, occupied, startTime, endTime, duration, dateTime } = data;
  
      // Validar y convertir la fecha
      const eventDate = new Date(dateTime);
      if (isNaN(eventDate.getTime())) {
        throw new Error("Fecha no válida: " + dateTime);
      }
  
      // Convertir los tiempos a fechas
      const startDate = new Date(startTime); // startTime es un número (milisegundos)
      const endDate = new Date(endTime); // endTime es un número (milisegundos)
  
      // Validar que las fechas sean válidas
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error("Fecha de inicio o fin no válida");
      }
  
      // Actualizar o crear el espacio en la base de datos
      const result = await this.prisma.space.upsert({
        where: { spaceId },
        update: {
          occupied,
          startTime: occupied ? startDate : null,
          endTime: occupied ? null : endDate,
          duration: occupied ? null : duration,
          dateTime: eventDate,
        },
        create: {
          spaceId,
          occupied,
          startTime: occupied ? startDate : null,
          endTime: occupied ? null : endDate,
          duration: occupied ? null : duration,
          dateTime: eventDate,
        },
      });
  
      this.logger.log(`Datos almacenados: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error(`Error al actualizar datos del espacio: ${error.message}`);
      throw new HttpException(
        'Error al actualizar datos del espacio',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Método para obtener todos los datos de los espacios
  async getAllSpaces() {
    try {
      const spaces = await this.prisma.space.findMany();
      this.logger.log(`Datos obtenidos: ${JSON.stringify(spaces)}`);
      return spaces;
    } catch (error) {
      this.logger.error(`Error al obtener los datos de los espacios: ${error.message}`);
      throw new HttpException(
        'Error al obtener los datos de los espacios',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}