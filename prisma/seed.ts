import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const programs = [
    { code: 'DS-MONTH', intervalDays: 30 },
    { code: 'DS-3MO', intervalDays: 90 },
    { code: 'DS-4MO', intervalDays: 120 },
    { code: 'DS-6MO', intervalDays: 180 },
    { code: 'DS-YEAR', intervalDays: 365 },
  ]

  console.log('🌱 Seeding production program codes...')

  for (const p of programs) {
    await prisma.program.upsert({
      where: { code: p.code },
      update: {}, // If it exists, don't change it
      create: p,  // If it doesn't exist, create it
    })
  }

  console.log('✅ Seeding complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })