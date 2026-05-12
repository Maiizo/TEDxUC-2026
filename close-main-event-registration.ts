import { prisma } from './lib/db';

async function closeMainEventRegistration() {
  try {
    const mainEvent = await prisma.event.findFirst({
      where: {
        type: {
          contains: 'main event',
          mode: 'insensitive',
        },
      },
    });

    if (!mainEvent) {
      console.log('❌ Main event not found');
      return;
    }

    if (!mainEvent.isActive) {
      console.log('⚠️  Main event is already closed for registration');
      return;
    }

    const updated = await prisma.event.update({
      where: { id: mainEvent.id },
      data: { isActive: false },
    });

    console.log('✅ Registration closed for main event');
    console.log(`   Event: ${updated.name}`);
    console.log(`   Type: ${updated.type}`);
    console.log(`   Current registrations: ${updated.registeredCount}`);
  } catch (error) {
    console.error('❌ Error closing registration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

closeMainEventRegistration();
