import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const products = [...Array(12)].map((_, i) => ({
  id: `product${i + 1}`,
  image: `images/products/0${(i % 10) + 1}.png`,
  name: "سماعات apple AirPods Max الاصدار الجديد",
  description: "الاصدار الاحدث و الافضل حتى اليوم",
  price: 2000 + i * 100, // Dynamic price
  discount: Math.floor(Math.random() * 250), // Random discount as integer
}));
try {
  for (const product of products) {
    console.log(product);
    // Check if product already exists
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: product.id,
      },
    });

    if (!existingProduct) {
      const j = await prisma.product.create({
        data: product,
      });
      console.log(j);
    }
  }
} catch (error) {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
}
