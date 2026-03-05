import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const us = await prisma.country.upsert({
    where: { code: 'US' },
    update: { name: 'United States' },
    create: { name: 'United States', code: 'US' }
  })

  const fintech = await prisma.category.upsert({
    where: { slug: 'fintech' },
    update: { name: 'Fintech' },
    create: { name: 'Fintech', slug: 'fintech' }
  })

  const service = await prisma.service.upsert({
    where: { slug: 'example-pay' },
    update: { name: 'Example Pay', categoryId: fintech.id },
    create: {
      name: 'Example Pay',
      slug: 'example-pay',
      categoryId: fintech.id,
      website: 'https://example.com'
    }
  })

  const existingOffer = await prisma.offer.findFirst({
    where: {
      serviceId: service.id,
      countryId: us.id,
      referralUrl: 'https://example.com/r/bonus'
    },
    select: { id: true }
  })

  if (existingOffer) {
    await prisma.offer.update({
      where: { id: existingOffer.id },
      data: {
        title: 'Welcome bonus',
        previewText: 'Sign up and enter the code to receive a welcome coupon bonus.',
        couponCode: 'WELCOME10',
        status: 'active'
      }
    })
  } else {
    await prisma.offer.create({
      data: {
        title: 'Welcome bonus',
        previewText: 'Sign up and enter the code to receive a welcome coupon bonus.',
        couponCode: 'WELCOME10',
        serviceId: service.id,
        countryId: us.id,
        referralUrl: 'https://example.com/r/bonus',
        status: 'active'
      }
    })
  }
}

main()
  .finally(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
