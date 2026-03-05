import { Injectable } from '@nestjs/common'
import { ReferralCreateInput, ReferralsListQuery, ReferralUpdateInput } from '@bonusbridge/shared'
import { serializeEntityDates } from 'src/shared/http/serialize'
import { PrismaService } from 'src/shared/prisma/prisma.service'

@Injectable()
export class ReferralsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: ReferralCreateInput) {
    const row = await this.prisma.referral.create({ data })
    return serializeEntityDates(row)
  }

  async findMany(query: ReferralsListQuery) {
    const where = { status: query.status }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.referral.findMany({
        where,
        include: {
          offer: {
            include: {
              service: { include: { category: true } }
            }
          },
          user: true
        },
        orderBy: { createdAt: 'desc' },
        skip: query.offset,
        take: query.limit
      }),
      this.prisma.referral.count({ where })
    ])

    return { items: items.map(serializeEntityDates), total, limit: query.limit, offset: query.offset }
  }

  async update(id: string, data: ReferralUpdateInput) {
    const row = await this.prisma.referral.update({ where: { id }, data })
    return serializeEntityDates(row)
  }
}
