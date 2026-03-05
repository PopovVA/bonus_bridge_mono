import { Injectable } from '@nestjs/common'
import { CountryCreateInput, CountryUpdateInput } from '@bonusbridge/shared'
import { CountriesRepository } from './countries.repository'

@Injectable()
export class CountriesService {
  constructor(private readonly repository: CountriesRepository) {}

  list() {
    return this.repository.findMany()
  }

  create(payload: CountryCreateInput) {
    return this.repository.create(payload)
  }

  update(id: string, payload: CountryUpdateInput) {
    return this.repository.update(id, payload)
  }

  async remove(id: string) {
    await this.repository.delete(id)
    return { ok: true }
  }
}
