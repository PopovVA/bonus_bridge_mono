import { Injectable } from '@nestjs/common'
import { CategoryCreateInput, CategoryUpdateInput } from '@bonusbridge/shared'
import { CategoriesRepository } from './categories.repository'

@Injectable()
export class CategoriesService {
  constructor(private readonly repository: CategoriesRepository) {}

  list() {
    return this.repository.findMany()
  }

  create(payload: CategoryCreateInput) {
    return this.repository.create(payload)
  }

  update(id: string, payload: CategoryUpdateInput) {
    return this.repository.update(id, payload)
  }

  async remove(id: string) {
    await this.repository.delete(id)
    return { ok: true }
  }
}
