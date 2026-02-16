import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateBookingDto, CreateGuestBookingDto } from 'src/core/application/dtos';

import { CreateBookingCommand } from '../../../core/application/commands/create-booking.command';
import { IBookingService } from '../../../core/application/ports/booking.service.port';
import { User } from '../../../core/domain/entities';
import { USER_ROLE } from '../../../core/domain/enums';
import { created, RESULT_KIND } from '../../../core/domain/result';
import { AuthService } from '../../auth/services/auth.service';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { Public } from '../../decorators/public.decorator';
import { Roles } from '../../decorators/roles.decorator';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { mapResultToHttp, mapResultWithPresenter, type NestResponseLike } from '../map-result-to-http';
import { BookingPresenter } from '../presenters/booking.presenter';

@ApiTags('Bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('bookings')
export class BookingController {
  constructor(
    private readonly bookingService: IBookingService,
    private readonly authService: AuthService
  ) {}

  @Post()
  @Roles(USER_ROLE.CUSTOMER)
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ description: 'Booking created', status: 201 })
  async create(
    @CurrentUser() user: User,
    @Body() dto: CreateBookingDto,
    @Res({ passthrough: true }) res: NestResponseLike
  ) {
    const command: CreateBookingCommand = {
      ...dto,
      date: new Date(dto.date),
      userId: user.id
    };

    const result = await this.bookingService.create(command);
    return mapResultWithPresenter(res, result, BookingPresenter.toHttp);
  }

  @Post('guest')
  @Public()
  @ApiOperation({ summary: 'Create a new booking (Guest)' })
  @ApiResponse({ description: 'Booking created', status: 201 })
  async createGuest(@Body() dto: CreateGuestBookingDto, @Res({ passthrough: true }) res: NestResponseLike) {
    const authResponse = await this.authService.createGuest({
      email: dto.guest.email,
      image: dto.guest.image,
      name: dto.guest.name
    });

    const command: CreateBookingCommand = {
      ...dto,
      date: new Date(dto.date),
      userId: authResponse.user.id
    };

    const result = await this.bookingService.create(command);

    if (result.kind === RESULT_KIND.CREATED) {
      return mapResultToHttp(
        res,
        created({
          accessToken: authResponse.accessToken,
          booking: BookingPresenter.toHttp(result.data),
          user: authResponse.user
        })
      );
    }

    return mapResultToHttp(res, result);
  }

  @Get('me')
  @Roles(USER_ROLE.CUSTOMER)
  @ApiOperation({ summary: 'List my bookings' })
  async findMyBookings(@CurrentUser() user: User, @Res({ passthrough: true }) res: NestResponseLike) {
    const result = await this.bookingService.findByUser(user.id);
    return mapResultWithPresenter(res, result, BookingPresenter.toHttpList);
  }

  @Post(':id/cancel')
  @Roles(USER_ROLE.CUSTOMER)
  @ApiOperation({ summary: 'Cancel a booking' })
  async cancel(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Res({ passthrough: true }) res: NestResponseLike
  ) {
    const result = await this.bookingService.cancel({
      bookingId: id,
      userId: user.id
    });
    return mapResultWithPresenter(res, result, BookingPresenter.toHttp);
  }
}
