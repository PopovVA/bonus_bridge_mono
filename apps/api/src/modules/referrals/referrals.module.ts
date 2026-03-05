import { Module } from '@nestjs/common'
import { ReferralsController } from './referrals.controller'
import { ReferralsRepository } from './referrals.repository'
import { ReferralsService } from './referrals.service'

@Module({
  controllers: [ReferralsController],
  providers: [ReferralsRepository, ReferralsService]
})
export class ReferralsModule {}
