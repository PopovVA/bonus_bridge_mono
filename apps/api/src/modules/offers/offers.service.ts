import { Injectable } from '@nestjs/common'
import { OfferCreateInput, OffersListQuery, OfferUpdateInput } from '@bonusbridge/shared'
import { notFound } from 'src/shared/http/errors'
import { OffersRepository } from './offers.repository'

@Injectable()
export class OffersService {
  constructor(private readonly repository: OffersRepository) {}

  list(query: OffersListQuery) {
    return this.repository.findMany(query)
  }

  async getById(id: string) {
    const offer = await this.repository.findById(id)
    if (!offer) {
      throw notFound(`Offer ${id} not found`)
    }

    return offer
  }

  create(payload: OfferCreateInput) {
    return this.repository.create(payload)
  }

  update(id: string, payload: OfferUpdateInput) {
    return this.repository.update(id, payload)
  }

  async remove(id: string) {
    await this.repository.delete(id)
    return { ok: true }
  }
}
