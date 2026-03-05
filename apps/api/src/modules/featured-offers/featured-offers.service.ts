import { Injectable } from '@nestjs/common'
import { FeaturedOfferCreateInput, FeaturedOfferUpdateInput } from '@bonusbridge/shared'
import { FeaturedOffersRepository } from './featured-offers.repository'

@Injectable()
export class FeaturedOffersService {
  constructor(private readonly repository: FeaturedOffersRepository) {}

  listForPublic() {
    return this.repository.findManyWithOffer()
  }

  list() {
    return this.repository.findMany()
  }

  create(payload: FeaturedOfferCreateInput) {
    return this.repository.create(payload)
  }

  update(id: string, payload: FeaturedOfferUpdateInput) {
    return this.repository.update(id, payload)
  }

  async remove(id: string) {
    await this.repository.delete(id)
    return { ok: true }
  }
}
