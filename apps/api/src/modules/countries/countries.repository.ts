import { Injectable } from '@nestjs/common'
import { CountryCreateInput, CountryUpdateInput } from '@bonusbridge/shared'
import { PrismaService } from 'src/shared/prisma/prisma.service'
import { serializeEntityDates } from 'src/shared/http/serialize'

@Injectable()
export class CountriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany() {
    const rows = await this.prisma.country.findMany({ orderBy: { name: 'asc' } })
    return rows.map(serializeEntityDates)
  }

  async create(data: CountryCreateInput) {
    const row = await this.prisma.country.create({ data: { ...data, code: data.code.toUpperCase() } })
    return serializeEntityDates(row)
  }

  async update(id: string, data: CountryUpdateInput) {
    const row = await this.prisma.country.update({
      where: { id },
      data: { ...data, code: data.code?.toUpperCase() }
    })

    return serializeEntityDates(row)
  }

  delete(id: string) {
    return this.prisma.country.delete({ where: { id } })
  }
}
