import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateGuestDto {
  @ApiProperty({ example: 'Guest User' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'guest@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'http://example.com/avatar.jpg' })
  @IsString()
  @IsOptional()
  image?: string;
}
