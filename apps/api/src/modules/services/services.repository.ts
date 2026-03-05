import { Injectable } from '@nestjs/common'
import { ServiceCreateInput, ServicesListQuery, ServiceUpdateInput } from '@bonusbridge/shared'
import { Prisma } from '@prisma/client'
import { serializeEntityDates } from 'src/shared/http/serialize'
import { PrismaService } from 'src/shared/prisma/prisma.service'

@Injectable()
export class ServicesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(query: ServicesListQuery) {
    const where: Prisma.ServiceWhereInput = {
      name: query.q ? { contains: query.q, mode: 'insensitive' } : undefined,
      category: query.category ? { slug: query.category } : undefined
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.service.findMany({
        where,
        include: { category: true },
        orderBy: { name: 'asc' },
        skip: query.offset,
        take: query.limit
      }),
      this.prisma.service.count({ where })
    ])

    return { items: items.map(serializeEntityDates), total, limit: query.limit, offset: query.offset }
  }

  async findBySlug(slug: string) {
    const row = await this.prisma.service.findUnique({ where: { slug }, include: { category: true } })
    return row ? serializeEntityDates(row) : null
  }

  async create(data: ServiceCreateInput) {
    const row = await this.prisma.service.create({ data })
    return serializeEntityDates(row)
  }

  async update(id: string, data: ServiceUpdateInput) {
    const row = await this.prisma.service.update({ where: { id }, data })
    return serializeEntityDates(row)
  }

  delete(id: string) {
    return this.prisma.service.delete({ where: { id } })
  }
}
