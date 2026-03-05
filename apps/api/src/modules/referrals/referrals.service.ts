import { Injectable } from '@nestjs/common'
import { ReferralCreateInput, ReferralsListQuery, ReferralUpdateInput } from '@bonusbridge/shared'
import { ReferralsRepository } from './referrals.repository'

@Injectable()
export class ReferralsService {
  constructor(private readonly repository: ReferralsRepository) {}

  async create(payload: ReferralCreateInput) {
    const referral = await this.repository.create(payload)
    return { id: referral.id, status: referral.status }
  }

  list(query: ReferralsListQuery) {
    return this.repository.findMany(query)
  }

  update(id: string, payload: ReferralUpdateInput) {
    return this.repository.update(id, payload)
  }
}
