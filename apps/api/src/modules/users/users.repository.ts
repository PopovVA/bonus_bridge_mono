import { Injectable } from '@nestjs/common'
import { serializeEntityDates } from 'src/shared/http/serialize'
import { PrismaService } from 'src/shared/prisma/prisma.service'

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany() {
    const rows = await this.prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
    return rows.map(serializeEntityDates)
  }
}
