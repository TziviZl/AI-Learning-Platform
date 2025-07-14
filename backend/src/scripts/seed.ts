import prisma from '../prismaClient';

async function main() {
  const categoriesData = [
    {
      name: 'Science',
      subCategories: [
        { name: 'Space' },
        { name: 'Biology' },
        { name: 'Physics' },
        { name: 'Chemistry' },
      ],
    },
    {
      name: 'Technology',
      subCategories: [
        { name: 'Programming' },
        { name: 'AI & Machine Learning' },
        { name: 'Cybersecurity' },
        { name: 'Cloud Computing' },
      ],
    },
    {
      name: 'Arts',
      subCategories: [
        { name: 'Painting' },
        { name: 'Music' },
        { name: 'Dance' },
        { name: 'Theater' },
      ],
    },
    {
      name: 'History',
      subCategories: [
        { name: 'Ancient' },
        { name: 'Medieval' },
        { name: 'Modern' },
        { name: 'World Wars' },
      ],
    },
    {
      name: 'Mathematics',
      subCategories: [
        { name: 'Algebra' },
        { name: 'Calculus' },
        { name: 'Geometry' },
        { name: 'Statistics' },
      ],
    },
    {
      name: 'Languages',
      subCategories: [
        { name: 'English' },
        { name: 'Spanish' },
        { name: 'Chinese' },
        { name: 'Arabic' },
      ],
    },
    {
      name: 'Sports',
      subCategories: [
        { name: 'Football' },
        { name: 'Basketball' },
        { name: 'Tennis' },
        { name: 'Swimming' },
      ],
    },
  ];

  for (const category of categoriesData) {
    await prisma.category.create({
      data: {
        name: category.name,
        subCategories: {
          create: category.subCategories,
        },
      },
    });
  }

  console.log('Seed data injected successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
