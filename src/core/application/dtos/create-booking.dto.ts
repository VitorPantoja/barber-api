import { IsDateString, IsNotEmpty, IsUUID, Matches } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: '2023-12-25T00:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ example: '10:00' })
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'startTime must be in HH:MM format'
  })
  startTime: string;

  @ApiProperty({ example: 'uuid-service' })
  @IsUUID()
  @IsNotEmpty()
  serviceId: string;

  @ApiProperty({ example: 'uuid-barber' })
  @IsUUID()
  @IsNotEmpty()
  barberId: string;

  @ApiProperty({ example: 'uuid-barbershop' })
  @IsUUID()
  @IsNotEmpty()
  barbershopId: string;
}
