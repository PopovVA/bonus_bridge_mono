import { Injectable } from '@nestjs/common'
import { CategoryCreateInput, CategoryUpdateInput } from '@bonusbridge/shared'
import { PrismaService } from 'src/shared/prisma/prisma.service'
import { serializeEntityDates } from 'src/shared/http/serialize'

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany() {
    const rows = await this.prisma.category.findMany({ orderBy: { name: 'asc' } })
    return rows.map(serializeEntityDates)
  }

  async create(data: CategoryCreateInput) {
    const row = await this.prisma.category.create({ data })
    return serializeEntityDates(row)
  }

  async update(id: string, data: CategoryUpdateInput) {
    const row = await this.prisma.category.update({ where: { id }, data })
    return serializeEntityDates(row)
  }

  delete(id: string) {
    return this.prisma.category.delete({ where: { id } })
  }
}
