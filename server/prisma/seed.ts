import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting clean slate seed...');

  const hashedPassword = await bcrypt.hash('owner123', 10);

  const owner = await prisma.user.upsert({
    where: { email: 'owner@apexmobile.com' },
    update: {},
    create: {
      email: 'owner@apexmobile.com',
      password: hashedPassword,
      name: 'Plant Owner / MD',
      role: 'TOP_MANAGEMENT',
    },
  });

  console.log(`Seed complete. Root admin created: ${owner.email} (ID: ${owner.id})`);
  console.log('All other operational tables are empty and ready for live data.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
