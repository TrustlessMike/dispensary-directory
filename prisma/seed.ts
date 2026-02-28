import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    // Purge old data
    await prisma.royaltyPayment.deleteMany()
    await prisma.subscription.deleteMany()
    await prisma.dispensary.deleteMany()
    await prisma.user.deleteMany()

    console.log("Deleted old data.")

    // Create a Scout
    const scout = await prisma.user.create({
        data: {
            email: 'scout1@example.com',
            name: 'Joe Scout',
            referralCode: 'JOE500',
            totalEarnings: 345.50
        }
    })

    // Create Dispensaries assigned to the Scout
    const disp1 = await prisma.dispensary.create({
        data: {
            name: 'Green Wellness Center',
            licenseNumber: 'L-2026-MI-991',
            address: '123 Main St, Ann Arbor, MI',
            verified: true,
            scoutId: scout.id,
            lastMenuUpdateAt: new Date(),
        }
    })

    const disp2 = await prisma.dispensary.create({
        data: {
            name: 'Elevate Provisioning',
            licenseNumber: 'L-2026-CA-042',
            address: '420 Higher Way, Los Angeles, CA',
            verified: true,
            scoutId: scout.id,
            lastMenuUpdateAt: new Date(Date.now() - 3600 * 1000 * 12), // 12 hours ago
        }
    })

    // Create Subscriptions
    await prisma.subscription.create({
        data: {
            dispensaryId: disp1.id,
            monthlyFee: 149.00,
            royaltyPercentage: 15.0,
            status: 'active'
        }
    })

    await prisma.subscription.create({
        data: {
            dispensaryId: disp2.id,
            monthlyFee: 299.00,
            royaltyPercentage: 10.0,
            status: 'active'
        }
    })

    // Create some past Royalty Payments
    await prisma.royaltyPayment.create({
        data: {
            scoutId: scout.id,
            dispensaryId: disp1.id,
            amount: 45.00,
            status: 'paid',
            paidAt: new Date(Date.now() - 3600 * 1000 * 24 * 5)
        }
    })

    console.log("Database seeded successfully!")
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
