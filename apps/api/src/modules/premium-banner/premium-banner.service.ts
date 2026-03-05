import { Injectable } from '@nestjs/common'
import { PremiumBannerCreateInput, PremiumBannerUpdateInput } from '@bonusbridge/shared'
import { PremiumBannerRepository } from './premium-banner.repository'

@Injectable()
export class PremiumBannerService {
  constructor(private readonly repository: PremiumBannerRepository) {}

  getActive() {
    return this.repository.findFirst()
  }

  list() {
    return this.repository.findMany()
  }

  create(payload: PremiumBannerCreateInput) {
    return this.repository.create(payload)
  }

  update(id: string, payload: PremiumBannerUpdateInput) {
    return this.repository.update(id, payload)
  }

  async remove(id: string) {
    await this.repository.delete(id)
    return { ok: true }
  }
}
