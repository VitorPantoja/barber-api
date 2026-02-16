import { IsArray, IsHexColor, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBarbershopDto {
  @ApiProperty({ example: 'Barber King' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'barber-king' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'Best cuts in town' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '123 Main St' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  @IsUrl()
  imageUrl: string;

  @ApiPropertyOptional({ example: 'https://example.com/logo.jpg' })
  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @ApiProperty({ example: ['123-456-7890'] })
  @IsArray()
  @IsString({ each: true })
  phones: string[];

  @ApiPropertyOptional({ example: '#000000' })
  @IsOptional()
  @IsHexColor()
  themeColor?: string;
}
