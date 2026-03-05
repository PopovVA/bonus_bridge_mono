import { Module } from '@nestjs/common'
import { FeaturedStoresController } from './featured-stores.controller'
import { FeaturedStoresRepository } from './featured-stores.repository'
import { FeaturedStoresService } from './featured-stores.service'

@Module({
  controllers: [FeaturedStoresController],
  providers: [FeaturedStoresRepository, FeaturedStoresService]
})
export class FeaturedStoresModule {}
