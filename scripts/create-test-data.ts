import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestData() {
  try {
    console.log('Creating test data...');

    // Create a test school
    const school = await prisma.school.create({
      data: {
        name: 'Parkview Elementary School',
        district: 'Sample School District',
      },
    });

    console.log(`✅ Created school: ${school.name} (ID: ${school.id})`);

    // Create a school code
    const schoolCode = await prisma.schoolCode.create({
      data: {
        code: 'PS123-DSCAN',
        schoolId: school.id,
        isActive: true,
        // No expiration date (never expires)
      },
    });

    console.log(`✅ Created school code: ${schoolCode.code}`);

    // Create another school and code for variety
    const school2 = await prisma.school.create({
      data: {
        name: 'Westview Middle School',
        district: 'Sample School District',
      },
    });

    const schoolCode2 = await prisma.schoolCode.create({
      data: {
        code: 'WESTVIEW-SCAN',
        schoolId: school2.id,
        isActive: true,
      },
    });

    console.log(`✅ Created school: ${school2.name} (ID: ${school2.id})`);
    console.log(`✅ Created school code: ${schoolCode2.code}`);

    console.log('\n🎉 Test data created successfully!');
    console.log('\nYou can now test enrollment with these codes:');
    console.log(`  - ${schoolCode.code} (${school.name})`);
    console.log(`  - ${schoolCode2.code} (${school2.name})`);
  } catch (error) {
    console.error('Error creating test data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createTestData();

