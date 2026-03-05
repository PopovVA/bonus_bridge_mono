import { Injectable } from '@nestjs/common'
import { PremiumBannerCreateInput, PremiumBannerUpdateInput } from '@bonusbridge/shared'
import { PrismaService } from 'src/shared/prisma/prisma.service'
import { serializeEntityDates } from 'src/shared/http/serialize'

@Injectable()
export class PremiumBannerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findFirst() {
    const row = await this.prisma.premiumBanner.findFirst({ orderBy: { createdAt: 'desc' } })
    return row ? serializeEntityDates(row) : null
  }

  async findMany() {
    const rows = await this.prisma.premiumBanner.findMany({ orderBy: { createdAt: 'desc' } })
    return rows.map(serializeEntityDates)
  }

  async create(data: PremiumBannerCreateInput) {
    const row = await this.prisma.premiumBanner.create({ data })
    return serializeEntityDates(row)
  }

  async update(id: string, data: PremiumBannerUpdateInput) {
    const row = await this.prisma.premiumBanner.update({ where: { id }, data })
    return serializeEntityDates(row)
  }

  delete(id: string) {
    return this.prisma.premiumBanner.delete({ where: { id } })
  }
}
