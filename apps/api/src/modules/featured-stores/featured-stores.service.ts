import { Injectable } from '@nestjs/common'
import { FeaturedStoreCreateInput, FeaturedStoreUpdateInput } from '@bonusbridge/shared'
import { FeaturedStoresRepository } from './featured-stores.repository'

@Injectable()
export class FeaturedStoresService {
  constructor(private readonly repository: FeaturedStoresRepository) {}

  listForPublic() {
    return this.repository.findManyWithStore()
  }

  list() {
    return this.repository.findMany()
  }

  create(payload: FeaturedStoreCreateInput) {
    return this.repository.create(payload)
  }

  update(id: string, payload: FeaturedStoreUpdateInput) {
    return this.repository.update(id, payload)
  }

  async remove(id: string) {
    await this.repository.delete(id)
    return { ok: true }
  }
}
