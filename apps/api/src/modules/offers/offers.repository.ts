import { Injectable } from '@nestjs/common'
import { OfferCreateInput, OffersListQuery, OfferUpdateInput } from '@bonusbridge/shared'
import { Prisma } from '@prisma/client'
import { serializeEntityDates } from 'src/shared/http/serialize'
import { PrismaService } from 'src/shared/prisma/prisma.service'

@Injectable()
export class OffersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(query: OffersListQuery) {
    const where: Prisma.OfferWhereInput = {
      status: query.status,
      title: query.q ? { contains: query.q, mode: 'insensitive' } : undefined,
      country: query.country ? { code: query.country.toUpperCase() } : undefined,
      service: {
        ...(query.service ? { slug: query.service } : {}),
        ...(query.category ? { category: { slug: query.category } } : {})
      }
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.offer.findMany({
        where,
        include: {
          service: { include: { category: true } },
          country: true
        },
        orderBy: query.sort === 'bonus' ? { bonusAmount: 'desc' } : { createdAt: 'desc' },
        skip: query.offset,
        take: query.limit
      }),
      this.prisma.offer.count({ where })
    ])

    return { items: items.map(serializeEntityDates), total, limit: query.limit, offset: query.offset }
  }

  async findById(id: string) {
    const row = await this.prisma.offer.findUnique({
      where: { id },
      include: {
        service: { include: { category: true } },
        country: true
      }
    })

    return row ? serializeEntityDates(row) : null
  }

  async create(data: OfferCreateInput) {
    const row = await this.prisma.offer.create({ data })
    return serializeEntityDates(row)
  }

  async update(id: string, data: OfferUpdateInput) {
    const row = await this.prisma.offer.update({ where: { id }, data })
    return serializeEntityDates(row)
  }

  delete(id: string) {
    return this.prisma.offer.delete({ where: { id } })
  }
}
