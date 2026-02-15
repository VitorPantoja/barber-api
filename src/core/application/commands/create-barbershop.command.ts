export interface CreateBarbershopCommand {
  name: string;
  slug: string;
  description: string;
  address: string;
  imageUrl: string;
  phones: string[];
  logoUrl?: string;
  themeColor?: string;
}
