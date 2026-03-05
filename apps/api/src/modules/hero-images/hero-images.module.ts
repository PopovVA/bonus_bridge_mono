import { Module } from '@nestjs/common'
import { HeroImagesController } from './hero-images.controller'
import { HeroImagesRepository } from './hero-images.repository'
import { HeroImagesService } from './hero-images.service'

@Module({
  controllers: [HeroImagesController],
  providers: [HeroImagesRepository, HeroImagesService]
})
export class HeroImagesModule {}
