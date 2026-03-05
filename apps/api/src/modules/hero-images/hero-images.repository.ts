import { Injectable } from '@nestjs/common'
import { HeroImageCreateInput, HeroImageUpdateInput } from '@bonusbridge/shared'
import { PrismaService } from 'src/shared/prisma/prisma.service'
import { serializeEntityDates } from 'src/shared/http/serialize'

@Injectable()
export class HeroImagesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany() {
    const rows = await this.prisma.heroImage.findMany({ orderBy: { sortOrder: 'asc' } })
    return rows.map(serializeEntityDates)
  }

  async create(data: HeroImageCreateInput) {
    const row = await this.prisma.heroImage.create({ data })
    return serializeEntityDates(row)
  }

  async update(id: string, data: HeroImageUpdateInput) {
    const row = await this.prisma.heroImage.update({ where: { id }, data })
    return serializeEntityDates(row)
  }

  delete(id: string) {
    return this.prisma.heroImage.delete({ where: { id } })
  }
}
