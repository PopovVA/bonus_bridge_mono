import { Module } from '@nestjs/common'
import { PremiumBannerController } from './premium-banner.controller'
import { PremiumBannerRepository } from './premium-banner.repository'
import { PremiumBannerService } from './premium-banner.service'

@Module({
  controllers: [PremiumBannerController],
  providers: [PremiumBannerRepository, PremiumBannerService]
})
export class PremiumBannerModule {}
