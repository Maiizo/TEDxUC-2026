import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

// Hash password function (simple SHA-256 hash)
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
  console.log('Starting database seeding...');

  // Create admin user
  const adminEmail = 'admin@ted.com';
  const adminPassword = 'TEDxUC2026adminpass';
  
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    await prisma.admin.create({
      data: {
        email: adminEmail,
        password: hashPassword(adminPassword),
      }
    });
    console.log('✅ Admin user created successfully');
    console.log('   Email:', adminEmail);
    console.log('   Password:', adminPassword);
  } else {
    console.log('⚠️ Admin user already exists');
  }

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
