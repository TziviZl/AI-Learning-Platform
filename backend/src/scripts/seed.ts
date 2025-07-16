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
        { name: 'Geology' },
        { name: 'Environmental Science' },
      ],
    },
    {
      name: 'Technology',
      subCategories: [
        { name: 'Programming' },
        { name: 'AI & Machine Learning' },
        { name: 'Cybersecurity' },
        { name: 'Cloud Computing' },
        { name: 'Web Development' },
        { name: 'Mobile Development' },
      ],
    },
    {
      name: 'Arts',
      subCategories: [
        { name: 'Painting' },
        { name: 'Music' },
        { name: 'Dance' },
        { name: 'Theater' },
        { name: 'Sculpture' },
        { name: 'Photography' },
      ],
    },
    {
      name: 'History',
      subCategories: [
        { name: 'Ancient' },
        { name: 'Medieval' },
        { name: 'Modern' },
        { name: 'World Wars' },
        { name: 'American History' },
        { name: 'European History' },
      ],
    },
    {
      name: 'Mathematics',
      subCategories: [
        { name: 'Algebra' },
        { name: 'Calculus' },
        { name: 'Geometry' },
        { name: 'Statistics' },
        { name: 'Discrete Math' },
        { name: 'Linear Algebra' },
      ],
    },
    {
      name: 'Languages',
      subCategories: [
        { name: 'English' },
        { name: 'Spanish' },
        { name: 'Chinese' },
        { name: 'Arabic' },
        { name: 'French' },
        { name: 'German' },
        { name: 'Hebrew' },
      ],
    },
    {
      name: 'Sports',
      subCategories: [
        { name: 'Football' },
        { name: 'Basketball' },
        { name: 'Tennis' },
        { name: 'Swimming' },
        { name: 'Athletics' },
        { name: 'Gymnastics' },
      ],
    },
    {
      name: 'Business',
      subCategories: [
        { name: 'Marketing' },
        { name: 'Finance' },
        { name: 'Economics' },
        { name: 'Management' },
        { name: 'Entrepreneurship' },
      ],
    },
    {
      name: 'Philosophy',
      subCategories: [
        { name: 'Ethics' },
        { name: 'Metaphysics' },
        { name: 'Epistemology' },
        { name: 'Political Philosophy' },
      ],
    },
    {
      name: 'Health & Wellness',
      subCategories: [
        { name: 'Nutrition' },
        { name: 'Fitness' },
        { name: 'Mental Health' },
        { name: 'Yoga' },
      ],
    },
  ];

  for (const category of categoriesData) {
    // Check if category already exists to prevent duplicates on re-run
    const existingCategory = await prisma.category.findUnique({
      where: { name: category.name }, // This works because 'name' is now @unique
    });

    if (!existingCategory) {
      await prisma.category.create({
        data: {
          name: category.name,
          subCategories: {
            create: category.subCategories,
          },
        },
      });
      console.log(`✅ Created category: ${category.name} with ${category.subCategories.length} subcategories.`);
    } else {
      console.log(`Category "${category.name}" already exists. Checking subcategories.`);
      // If category exists, check and add any new subcategories
      for (const subCategory of category.subCategories) {
        const existingSubCategory = await prisma.subCategory.findUnique({
          where: {
            name_categoryId: { // This works because @@unique([name, categoryId]) is defined
              name: subCategory.name,
              categoryId: existingCategory.id,
            },
          },
        });
        if (!existingSubCategory) {
          await prisma.subCategory.create({
            data: {
              name: subCategory.name,
              categoryId: existingCategory.id,
            },
          });
          console.log(`  ➕ Added subcategory: ${subCategory.name} to ${category.name}.`);
        }
      }
    }
  }

  console.log('Seed data injection complete!');
}

main()
  .catch(e => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
