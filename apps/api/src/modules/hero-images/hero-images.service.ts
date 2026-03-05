import { Injectable } from '@nestjs/common'
import { HeroImageCreateInput, HeroImageUpdateInput } from '@bonusbridge/shared'
import { HeroImagesRepository } from './hero-images.repository'

@Injectable()
export class HeroImagesService {
  constructor(private readonly repository: HeroImagesRepository) {}

  list() {
    return this.repository.findMany()
  }

  create(payload: HeroImageCreateInput) {
    return this.repository.create(payload)
  }

  update(id: string, payload: HeroImageUpdateInput) {
    return this.repository.update(id, payload)
  }

  async remove(id: string) {
    await this.repository.delete(id)
    return { ok: true }
  }
}
