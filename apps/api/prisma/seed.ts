import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
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
      referralUrl: 'https://example.com/r/bonus'
    },
    select: { id: true }
  })

  const heroImagesCount = await prisma.heroImage.count()
  if (heroImagesCount === 0) {
    await prisma.heroImage.createMany({
      data: [
        { imageUrl: 'https://placehold.co/1280x320/22c55e/fff?text=BonusBridge', sortOrder: 0 },
        { imageUrl: 'https://placehold.co/1280x320/0f7a5f/fff?text=Referral+Deals', sortOrder: 1 }
      ]
    })
  }

  const premiumBannerCount = await prisma.premiumBanner.count()
  if (premiumBannerCount === 0) {
    await prisma.premiumBanner.create({
      data: {
        title: 'Join Our Premium Membership',
        description: 'Get exclusive access to higher cashback rates and early access to hot deals',
        priceText: '$9.99/month',
        priceNote: 'First month free',
        ctaText: 'Start Free Trial',
        ctaHref: '#premium'
      }
    })
  }

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
        referralUrl: 'https://example.com/r/bonus',
        status: 'active'
      }
    })
  }

  const offer = await prisma.offer.findFirst({
    where: { serviceId: service.id },
    select: { id: true }
  })

  const featuredStoreCount = await prisma.featuredStore.count()
  if (featuredStoreCount === 0) {
    await prisma.featuredStore.create({
      data: { storeId: service.id, sortOrder: 0 }
    })
  }

  const featuredOfferCount = await prisma.featuredOffer.count()
  if (featuredOfferCount === 0 && offer) {
    await prisma.featuredOffer.create({
      data: { offerId: offer.id, sortOrder: 0 }
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
