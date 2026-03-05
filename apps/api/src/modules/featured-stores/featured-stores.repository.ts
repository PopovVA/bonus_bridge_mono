import { Injectable } from '@nestjs/common'
import { FeaturedStoreCreateInput, FeaturedStoreUpdateInput } from '@bonusbridge/shared'
import { PrismaService } from 'src/shared/prisma/prisma.service'
import { serializeEntityDates } from 'src/shared/http/serialize'

@Injectable()
export class FeaturedStoresRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findManyWithStore() {
    const rows = await this.prisma.featuredStore.findMany({
      include: { store: { include: { category: true } } },
      orderBy: { sortOrder: 'asc' }
    })
    return rows.map((r) => ({
      ...serializeEntityDates(r),
      store: r.store
        ? {
            ...serializeEntityDates(r.store),
            category: r.store.category ? serializeEntityDates(r.store.category) : undefined
          }
        : undefined
    }))
  }

  async findMany() {
    const rows = await this.prisma.featuredStore.findMany({ orderBy: { sortOrder: 'asc' } })
    return rows.map(serializeEntityDates)
  }

  async create(data: FeaturedStoreCreateInput) {
    const row = await this.prisma.featuredStore.create({ data })
    return serializeEntityDates(row)
  }

  async update(id: string, data: FeaturedStoreUpdateInput) {
    const row = await this.prisma.featuredStore.update({ where: { id }, data })
    return serializeEntityDates(row)
  }

  delete(id: string) {
    return this.prisma.featuredStore.delete({ where: { id } })
  }
}
