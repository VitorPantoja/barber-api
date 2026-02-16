import { Type } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from 'class-validator';

export class GuestDetailsDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'guest@example.com' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  image?: string;
}

import { IsOptional } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { CreateBookingDto } from './create-booking.dto';

export class CreateGuestBookingDto extends CreateBookingDto {
  @ApiProperty({ type: GuestDetailsDto })
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => GuestDetailsDto)
  guest: GuestDetailsDto;
}
