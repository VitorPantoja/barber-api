import { DAY_MAP } from '../consts';
import { SUBSCRIPTION_STATUS, type SubscriptionStatus } from '../enums';
import { type OperatingHours } from './operating-hours.entity';

export interface BarbershopProps {
  id: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  imageUrl: string;
  phones: string[];
  subscriptionStatus: SubscriptionStatus;
  stripeCustomerId: string | null;
  logoUrl: string | null;
  themeColor: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export class Barbershop {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly description: string;
  readonly address: string;
  readonly imageUrl: string;
  readonly phones: string[];
  readonly subscriptionStatus: SubscriptionStatus;
  readonly stripeCustomerId: string | null;
  readonly logoUrl: string | null;
  readonly themeColor: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date | null;
  readonly operatingHours: OperatingHours[];

  constructor(props: BarbershopProps & { operatingHours?: OperatingHours[]; deletedAt?: Date | null }) {
    this.id = props.id;
    this.name = props.name;
    this.slug = props.slug;
    this.description = props.description;
    this.address = props.address;
    this.imageUrl = props.imageUrl;
    this.phones = props.phones;
    this.subscriptionStatus = props.subscriptionStatus;
    this.stripeCustomerId = props.stripeCustomerId;
    this.logoUrl = props.logoUrl;
    this.themeColor = props.themeColor;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt ?? null;
    this.operatingHours = props.operatingHours ?? [];
  }

  markAsDeleted(): void {
    (this as any).deletedAt = new Date();
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }

  isActive(): boolean {
    return (
      this.subscriptionStatus === SUBSCRIPTION_STATUS.ACTIVE || this.subscriptionStatus === SUBSCRIPTION_STATUS.TRIALING
    );
  }

  canAcceptBookings(): boolean {
    return this.isActive();
  }

  isPastDue(): boolean {
    return this.subscriptionStatus === SUBSCRIPTION_STATUS.PAST_DUE;
  }

  isOpen(date: Date = new Date()): boolean {
    const dayIndex = date.getDay();

    const todayEnum = DAY_MAP[dayIndex];
    if (!todayEnum) return false;

    const todayHours = this.operatingHours.find(oh => oh.dayOfWeek === todayEnum);

    if (!todayHours || !todayHours.isOpen()) {
      return false;
    }

    const currentHours = date.getHours();
    const currentMinutes = date.getMinutes();
    const currentTotalMinutes = currentHours * 60 + currentMinutes;

    const [openH, openM] = todayHours.openTime.split(':').map(Number);
    const [closeH, closeM] = todayHours.closeTime.split(':').map(Number);

    const openTotalMinutes = openH * 60 + openM;
    const closeTotalMinutes = closeH * 60 + closeM;

    return currentTotalMinutes >= openTotalMinutes && currentTotalMinutes < closeTotalMinutes;
  }
}
