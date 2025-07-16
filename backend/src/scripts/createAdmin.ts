import bcrypt from 'bcryptjs'; 
import prisma from '../prismaClient';

async function createAdminUser(name: string, phone: string, rawPassword: string) {
  const existingUser = await prisma.user.findUnique({
    where: { phone: phone },
  });

  if (existingUser) {
    if (existingUser.role === 'ADMIN') {
      console.log(`ℹ️ Admin user with phone ${phone} already exists. Skipping creation.`);
      return; 
    } else {
      console.log(`⚠️ User with phone ${phone} already exists but is not an admin. Please update role manually if needed.`);
      return;
    }
  }

  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const user = await prisma.user.create({
    data: {
      name,
      phone,
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log(`✅ Created role ADMIN: ${user.name} (${user.phone})`);
}

createAdminUser('Tzivi', '0533159763', '0533159763')
  .then(() => {
    console.log('Admin user script finished.');
    process.exit(0); 
  })
  .catch((err) => {
    console.error('❌ Error during admin user creation:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect(); 
  });
