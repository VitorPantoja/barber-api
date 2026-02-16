import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { IBarbershopService, ICatalogService } from 'src/core/application/ports';

import { USER_ROLE } from '../../../core/domain/enums';
import { Public } from '../../decorators/public.decorator';
import { Roles } from '../../decorators/roles.decorator';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { mapResultToHttp, mapResultWithPresenter } from '../../http/map-result-to-http';
import { CreateBarbershopDto } from '../dtos/create-barbershop.dto';
import { UpdateBarbershopDto } from '../dtos/update-barbershop.dto';
import { NestResponseLike } from '../http.consts';
import { BarbershopServicePresenter } from '../presenters/barbershop-service.presenter';
import { BarbershopPresenter } from '../presenters/barbershop.presenter';
import { UserPresenter } from '../presenters/user.presenter';

@ApiTags('Barbershops')
@Controller('barbershops')
export class BarbershopController {
  constructor(
    private readonly barbershopService: IBarbershopService,
    private readonly catalogService: ICatalogService
  ) {}

  @Public()
  @Get()
  async listActive(@Res({ passthrough: true }) res: NestResponseLike) {
    const result = await this.barbershopService.findActive();
    return mapResultWithPresenter(res, result, BarbershopPresenter.toHttpList);
  }

  @Public()
  @Get(':id')
  async getById(@Param('id', ParseUUIDPipe) id: string, @Res({ passthrough: true }) res: NestResponseLike) {
    const result = await this.barbershopService.findById(id);
    return mapResultWithPresenter(res, result, BarbershopPresenter.toHttp);
  }

  @Public()
  @Get('slug/:slug')
  async getBySlug(@Param('slug') slug: string, @Res({ passthrough: true }) res: NestResponseLike) {
    const result = await this.barbershopService.findBySlug(slug);
    return mapResultWithPresenter(res, result, BarbershopPresenter.toHttp);
  }

  @Public()
  @Get(':id/services')
  async getServices(@Param('id', ParseUUIDPipe) id: string, @Res({ passthrough: true }) res: NestResponseLike) {
    const result = await this.catalogService.findByBarbershop(id);
    return mapResultWithPresenter(res, result, BarbershopServicePresenter.toHttpList);
  }

  @Roles(USER_ROLE.BARBER, USER_ROLE.ADMIN, USER_ROLE.COMPANY_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id/customers')
  async getCustomers(@Param('id', ParseUUIDPipe) id: string, @Res({ passthrough: true }) res: NestResponseLike) {
    const result = await this.barbershopService.getCustomers(id);
    return mapResultWithPresenter(res, result, UserPresenter.toHttpList);
  }

  @Roles(USER_ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() dto: CreateBarbershopDto, @Res({ passthrough: true }) res: NestResponseLike) {
    const result = await this.barbershopService.create(dto);
    return mapResultWithPresenter(res, result, BarbershopPresenter.toHttp);
  }

  @Roles(USER_ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBarbershopDto,
    @Res({ passthrough: true }) res: NestResponseLike
  ) {
    const result = await this.barbershopService.update(id, dto);
    return mapResultWithPresenter(res, result, BarbershopPresenter.toHttp);
  }

  @Roles(USER_ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string, @Res({ passthrough: true }) res: NestResponseLike) {
    const result = await this.barbershopService.delete(id);
    return mapResultToHttp(res, result);
  }
  @Roles(USER_ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id/permanent')
  async erase(@Param('id', ParseUUIDPipe) id: string, @Res({ passthrough: true }) res: NestResponseLike) {
    const result = await this.barbershopService.erase(id);
    return mapResultToHttp(res, result);
  }
}
