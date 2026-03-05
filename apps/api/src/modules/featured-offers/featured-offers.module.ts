import { Module } from '@nestjs/common'
import { FeaturedOffersController } from './featured-offers.controller'
import { FeaturedOffersRepository } from './featured-offers.repository'
import { FeaturedOffersService } from './featured-offers.service'

@Module({
  controllers: [FeaturedOffersController],
  providers: [FeaturedOffersRepository, FeaturedOffersService]
})
export class FeaturedOffersModule {}
