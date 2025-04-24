import prisma from "../src/config/prisma.js";
import bcrypt from "bcrypt";

async function main() {
  console.log("Seeding started...");

  // CLEARING ALL EXOSTENCE DATA
  await prisma.user.deleteMany();
  await prisma.products.deleteMany();
  await prisma.cartProduct.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.category.deleteMany();

  // RESTARTING ID FROM 1
  await prisma.$executeRawUnsafe(
    `ALTER SEQUENCE "category_id_seq" RESTART WITH 1`
  );
  await prisma.$executeRawUnsafe(
    `ALTER SEQUENCE "product_id_seq" RESTART WITH 1`
  );
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE "user_id_seq" RESTART WITH 1`);
  await prisma.$executeRawUnsafe(`ALTER SEQUENCE "Cart_id_seq" RESTART WITH 1`);
  await prisma.$executeRawUnsafe(
    `ALTER SEQUENCE "Cartproduct_id_seq" RESTART WITH 1`
  );
  await prisma.$executeRawUnsafe(
    `ALTER SEQUENCE "Order_id_seq" RESTART WITH 1`
  );
  await prisma.$executeRawUnsafe(
    `ALTER SEQUENCE "Payment_id_seq" RESTART WITH 1`
  );

  await prisma.category.createMany({
    data: [
      {
        categoryName: "Electronics",
        image: "electronics.jpeg",
      },
      { categoryName: "Clothing", image: "cloths.jpeg" },
      { categoryName: "Footware", image: "footware.jpg" },
      { categoryName: "Stationary", image: "stationary.jpeg" },
      { categoryName: "Cars", image: "car.jpeg" },
      { categoryName: "Bikes", image: "bikes.jpeg" },
      { categoryName: "Perfumes", image: "perfumes.jpeg" },
      {
        categoryName: "Furniture",
        image: "wood-chair.jpeg",
      },
    ],
  });

  // GET CATEGORY-ID BY CATEGORY-NAME
  const getCategoryId = async (categoryName) => {
    const category = await prisma.category.findUnique({
      where: { categoryName: categoryName },
    });
    return category.id;
  };

  // CREATE PRODUCTS
  await prisma.products.createMany({
    data: [
      {
        title: "Satyana Proyogo - Gandhiji",
        price: 999,
        description: "Best book to read.",
        image: "book.jpg",
        categoryID: await getCategoryId("Stationary"),
      },
      {
        title: "HP laptop",
        price: 45999,
        description: "Risen-7 512GB",
        image: "laptop.jpg",
        categoryID: await getCategoryId("Electronics"),
        rating: 5,
      },
      {
        title: "Iphone 15",
        price: 54999,
        description: "Storage:256",
        image: "Iphone15pro.jpeg",
        categoryID: await getCategoryId("Electronics"),
        rating: 4.5,
      },
      {
        title: "Tommy-Hilfiger Shirt",
        price: 999,
        description: "Best Quality Cloth",
        image: "Tommy.jpeg",
        categoryID: await getCategoryId("Clothing"),
        rating: 5,
      },
      {
        title: "Tommy T-shirt",
        price: 1299,
        description: "Premium Cotton Quality",
        image: "TommyTshirt.jpeg",
        categoryID: await getCategoryId("Clothing"),
        rating: 3.5,
      },
      {
        title: "Wooden Chair",
        price: 1999,
        description: "Original Neem Wooden made",
        image: "Woodchair.jpeg",
        categoryID: await getCategoryId("Furniture"),
        rating: 4,
      },
      {
        title: "Double bed",
        price: 7899,
        description: "best Quality",
        image: "bed.jpeg",
        categoryID: await getCategoryId("Furniture"),
        rating: 4,
      },
      {
        title: "Addidas shoes for Men",
        price: 2499,
        description: "Premium shoes",
        image: "adiddas.jpg",
        categoryID: await getCategoryId("Footware"),
        rating: 4,
      },
      {
        title: "Honda Shine 125",
        price: 78999,
        description: "125 cc engine",
        image: "shine.jpeg",
        categoryID: await getCategoryId("Bikes"),
        rating: 4,
      },
    ],
  });

  //HASH PASSWORD FFUNCTION
  const hashedPassword = async (pass) => {
    return await bcrypt.hash(pass, 5);
  };

  //CREATE INITIAL USER AND ADMIN
  const adminUser = await prisma.user.createMany({
    data: [
      {
        username: "Admin",
        email: "admin123@gmail.com",
        password: await hashedPassword("Admin@123"),
        isActive: true,
        role: "ADMIN",
        city: "Ahemdabad",
        phone: "9876543210",
      },
    ],
  });

  const normalUsers = await prisma.user.createMany({
    data: [
      {
        username: "Pranav Gami",
        email: "pranav123@gmail.com",
        password: await hashedPassword("Pranav@123"),
        isActive: false,
        role: "USER",
        city: "Limbdi",
        phone: "9175433210",
      },
      {
        username: "Darshit Bervaliya",
        email: "darshit123@gmail.com",
        password: await hashedPassword("Darshit@123"),
        isActive: false,
        role: "USER",
        city: "Rajkot",
        phone: "9845543210",
      },
      {
        username: "Sagar Ratanpara",
        email: "sagar123@gmail.com",
        password: await hashedPassword("Sagar@123"),
        isActive: false,
        role: "USER",
        city: "Rajkot",
        phone: "9898545467",
      },
    ],
  });

  // Create Cart for Both Users
  const getUserId = async (email) => {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    return user.id;
  };

  await prisma.cart.createMany({
    data: [
      {
        userId: await getUserId("pranav123@gmail.com"),
      },
      {
        userId: await getUserId("darshit123@gmail.com"),
      },
      {
        userId: await getUserId("sagar123@gmail.com"),
      },
    ],
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
