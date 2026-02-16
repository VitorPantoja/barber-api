import { Body, Controller, Delete, Get, Param, Patch, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { IUserService } from '../../../core/application/ports';
import { type User } from '../../../core/domain/entities';
import { USER_ROLE } from '../../../core/domain/enums';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { Roles } from '../../decorators/roles.decorator';
import { RolesGuard } from '../../guards/roles.guard';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { type NestResponseLike } from '../http.consts';
import { mapResultToHttp } from '../map-result-to-http';
import { UserPresenter } from '../presenters/user.presenter';

@Controller('users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: IUserService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(USER_ROLE.ADMIN)
  async findAll(@Query() query: PaginationQueryDto, @Res({ passthrough: true }) res: NestResponseLike) {
    const result = await this.userService.findAll(query);
    if (result.kind === 'SUCCESS') {
      res.status(200);
      return {
        data: UserPresenter.toHttpList(result.data.data),
        limit: result.data.limit,
        page: result.data.page,
        total: result.data.total
      };
    }

    return mapResultToHttp(res, result);
  }

  @Get('me')
  getProfile(@CurrentUser() user: User, @Res({ passthrough: true }) res: NestResponseLike) {
    res.status(200);
    return UserPresenter.toHttp(user);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(USER_ROLE.ADMIN)
  async findById(@Param('id') id: string, @Res({ passthrough: true }) res: NestResponseLike) {
    const result = await this.userService.findById(id);
    if (result.kind === 'SUCCESS') {
      res.status(200);
      return UserPresenter.toHttp(result.data);
    }

    return mapResultToHttp(res, result);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() currentUser: User,
    @Res({ passthrough: true }) res: NestResponseLike
  ) {
    const isOwner = currentUser.id === id;
    const isAdmin = currentUser.role === USER_ROLE.ADMIN;

    if (!isOwner && !isAdmin) {
      res.status(403);
      return { error: 'Forbidden', message: 'You can only update your own profile', statusCode: 403 };
    }

    const result = await this.userService.update({ command: dto, id });
    if (result.kind === 'SUCCESS') {
      res.status(200);
      return UserPresenter.toHttp(result.data);
    }

    return mapResultToHttp(res, result);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(USER_ROLE.ADMIN)
  async deleteUser(@Param('id') id: string, @Res({ passthrough: true }) res: NestResponseLike) {
    const result = await this.userService.delete(id);
    return mapResultToHttp(res, result);
  }
}
