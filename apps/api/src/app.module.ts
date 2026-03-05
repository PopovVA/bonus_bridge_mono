import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { CategoriesModule } from './modules/categories/categories.module'
import { HealthModule } from './modules/health/health.module'
import { OffersModule } from './modules/offers/offers.module'
import { FeaturedOffersModule } from './modules/featured-offers/featured-offers.module'
import { FeaturedStoresModule } from './modules/featured-stores/featured-stores.module'
import { HeroImagesModule } from './modules/hero-images/hero-images.module'
import { PremiumBannerModule } from './modules/premium-banner/premium-banner.module'
import { ReferralsModule } from './modules/referrals/referrals.module'
import { ServicesModule } from './modules/services/services.module'
import { UsersModule } from './modules/users/users.module'
import { parseEnv } from './shared/config/env'
import { PrismaModule } from './shared/prisma/prisma.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: parseEnv
    }),
    AuthModule,
    PrismaModule,
    HealthModule,
    CategoriesModule,
    HeroImagesModule,
    PremiumBannerModule,
    FeaturedStoresModule,
    FeaturedOffersModule,
    ServicesModule,
    OffersModule,
    UsersModule,
    ReferralsModule
  ]
})
export class AppModule {}
