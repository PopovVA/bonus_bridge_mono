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

  await prisma.offer.create({
    data: {
      title: 'Welcome bonus',
      serviceId: service.id,
      countryId: us.id,
      referralUrl: 'https://example.com/r/bonus',
      status: 'active'
    }
  })
}

main()
  .finally(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
