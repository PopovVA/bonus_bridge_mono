import { Injectable } from '@nestjs/common'
import { FeaturedOfferCreateInput, FeaturedOfferUpdateInput } from '@bonusbridge/shared'
import { PrismaService } from 'src/shared/prisma/prisma.service'
import { serializeEntityDates } from 'src/shared/http/serialize'

@Injectable()
export class FeaturedOffersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findManyWithOffer() {
    const rows = await this.prisma.featuredOffer.findMany({
      include: {
        offer: { include: { service: { include: { category: true } } } }
      },
      orderBy: { sortOrder: 'asc' }
    })
    return rows.map((r) => ({
      ...serializeEntityDates(r),
      offer: r.offer
        ? {
            ...serializeEntityDates(r.offer),
            service: r.offer.service
              ? {
                  ...serializeEntityDates(r.offer.service),
                  category: r.offer.service.category
                    ? serializeEntityDates(r.offer.service.category)
                    : undefined
                }
              : undefined
          }
        : undefined
    }))
  }

  async findMany() {
    const rows = await this.prisma.featuredOffer.findMany({ orderBy: { sortOrder: 'asc' } })
    return rows.map(serializeEntityDates)
  }

  async create(data: FeaturedOfferCreateInput) {
    const row = await this.prisma.featuredOffer.create({ data })
    return serializeEntityDates(row)
  }

  async update(id: string, data: FeaturedOfferUpdateInput) {
    const row = await this.prisma.featuredOffer.update({ where: { id }, data })
    return serializeEntityDates(row)
  }

  delete(id: string) {
    return this.prisma.featuredOffer.delete({ where: { id } })
  }
}
