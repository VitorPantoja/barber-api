import { SUBSCRIPTION_STATUS, type SubscriptionStatus } from '../enums';

interface BarbershopProps {
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

  constructor(props: BarbershopProps) {
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
}
