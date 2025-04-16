import prisma from "../src/config/prisma";
import bcrypt from "bcrypt";

async function main() {
  console.log("Seeding started...");

  await prisma.category.createMany({
    data: [
      { categoryName: "Computers" },
      { categoryName: "Phones" },
      { categoryName: "Books" },
      { categoryName: "Home & Kithen" },
      { categoryName: "Car-Accessories" },
      { categoryName: "Clothing" },
      { categoryName: "Footware" },
      { categoryName: "Furniture" },
    ],
  });

  const getCategoryId = async (categoryName) => {
    return await prisma.category.findUnique({
      where: { categoryName: categoryName },
    });
  };

  // CREATE PRODUCTS
  await prisma.products.createMany({
    data: [
      {
        title: "Satyana Proyogo - Gandhiji",
        price: 999,
        description: "Best book to read.",
        image: "1744635192222-Book1.jpg",
        categoryID: getCategoryId("Books"),
      },
      {
        title: "HP laptop",
        price: 45999,
        description: "Risen-7 512GB",
        image: "1744102399430-HP2.jpg",
        categoryID: getCategoryId("Computers"),
      },
      {
        title: "Iphone 15",
        price: 54999,
        description: "Storage:256",
        image: "1744101763519-Iphone15.jpeg",
        categoryID: getCategoryId("Phones"),
      },
      {
        title: "Tommy Shirt",
        price: 999,
        description: "Best Quality Cloth",
        image: "1744101918091-TommyHilfiger1.jpg",
        categoryID: getCategoryId("Clothing"),
      },
      {
        title: "Tommy T-shirt",
        price: 1299,
        description: "Premium Cotton Quality",
        image: "1744101942709-TommyTshirt.jpeg",
        categoryID: getCategoryId("Clothing"),
      },
      {
        title: "Wooden Chair",
        price: 1999,
        description: "Original Neem Wooden made",
        image: "1744101804825-WoodChair.jpeg",
        categoryID: getCategoryId("Furniture"),
      },
    ],
  });

  // 4. Hash passwords
  const hashedPassword = async (pass) => {
    return await bcrypt.hash(pass, 5);
  };

  // 5. Create Users
  const adminUser = await prisma.user.createMany({
    data: {
      username: "admin",
      email: "admin@example.com",
      password: hashedPassword("Admin@123"),
      isActive: true,
      role: "ADMIN",
    },
  });

  const normalUsers = await prisma.user.create({
    data: [
      {
        username: "Pranav",
        email: "pranav123@gmail.com",
        password: hashedPassword("Pranav@123"),
        isActive: false,
        role: "USER",
      },
      {
        username: "Darshit",
        email: "darshit123@gmail.com",
        password: hashedPassword("Darshit@123"),
        isActive: false,
        role: "USER",
      },
    ],
  });

  // 6. Create Cart for Both Users
  const cart = async (uId) => {
    await prisma.cart.create({
      data: {
        userId: uId,
      },
    });
  };

  normalUsers.forEach((user) => {
    cart(user.id);
  });

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
