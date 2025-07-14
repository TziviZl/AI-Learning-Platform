import bcrypt from 'bcrypt';
import prisma from '../prismaClient'; 

async function createAdminUser(name: string, phone: string, rawPassword: string) {
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const user = await prisma.user.create({
    data: {
      name,
      phone,
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log(`✅Created role ADMIN: ${user.name} (${user.phone})`);
}

createAdminUser('Tzivi', '0533159763', '0533159763')
  .then(() => process.exit())
  .catch((err) => {
    console.error('❌error', err);
    process.exit(1);
  });
