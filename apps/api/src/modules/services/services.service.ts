import { Injectable } from '@nestjs/common'
import { ServiceCreateInput, ServicesListQuery, ServiceUpdateInput } from '@bonusbridge/shared'
import { notFound } from 'src/shared/http/errors'
import { ServicesRepository } from './services.repository'

@Injectable()
export class ServicesService {
  constructor(private readonly repository: ServicesRepository) {}

  list(query: ServicesListQuery) {
    return this.repository.findMany(query)
  }

  async getBySlug(slug: string) {
    const service = await this.repository.findBySlug(slug)
    if (!service) {
      throw notFound(`Service ${slug} not found`)
    }

    return service
  }

  create(payload: ServiceCreateInput) {
    return this.repository.create(payload)
  }

  update(id: string, payload: ServiceUpdateInput) {
    return this.repository.update(id, payload)
  }

  async remove(id: string) {
    await this.repository.delete(id)
    return { ok: true }
  }
}
