import prisma from "../src/config/prisma.js";
import bcrypt from "bcrypt";

async function main() {
  console.log("Seeding started...");

  // CLEARING ALL EXOSTENCE DATA
  await prisma.user.deleteMany();
  await prisma.products.deleteMany();
  await prisma.subcategory.deleteMany();
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
    `ALTER SEQUENCE "subcategory_id_seq" RESTART WITH 1`
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

  await prisma.subcategory.createMany({
    data: [
      {
        name: "Mobiles",
        categoryId: await getCategoryId("Electronics"),
      },
      {
        name: "Laptops",
        categoryId: await getCategoryId("Electronics"),
      },
      {
        name: "TV",
        categoryId: await getCategoryId("Electronics"),
      },
      {
        name: "Refrigerator",
        categoryId: await getCategoryId("Electronics"),
      },
      {
        name: "Mens",
        categoryId: await getCategoryId("Clothing"),
      },
      {
        name: "Womens",
        categoryId: await getCategoryId("Clothing"),
      },
      {
        name: "Childrens",
        categoryId: await getCategoryId("Clothing"),
      },
      {
        name: "Addidas",
        categoryId: await getCategoryId("Footware"),
      },
      {
        name: "Puma",
        categoryId: await getCategoryId("Footware"),
      },
      {
        name: "Books",
        categoryId: await getCategoryId("Stationary"),
      },
      {
        name: "Pens",
        categoryId: await getCategoryId("Stationary"),
      },
      {
        name: "Audi",
        categoryId: await getCategoryId("Cars"),
      },
      {
        name: "BMW",
        categoryId: await getCategoryId("Cars"),
      },
      {
        name: "Hyundai",
        categoryId: await getCategoryId("Cars"),
      },
      {
        name: "Honda",
        categoryId: await getCategoryId("Bikes"),
      },
      {
        name: "Bajaj",
        categoryId: await getCategoryId("Bikes"),
      },
      {
        name: "Chairs",
        categoryId: await getCategoryId("Furniture"),
      },
      {
        name: "Beds",
        categoryId: await getCategoryId("Furniture"),
      },
    ],
  });

  // GET SUBCATEHHORY ID
  const getSubcategoryId = async (name) => {
    const res = await prisma.subcategory.findFirst({
      where: { name: name },
    });
    return res.id;
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
        rating: 3,
        subcategoryId: await getSubcategoryId("Books"),
      },
      {
        title: "HP laptop",
        price: 45999,
        description: "Risen-7 512GB",
        image: "laptop.jpg",
        categoryID: await getCategoryId("Electronics"),
        rating: 5,
        subcategoryId: await getSubcategoryId("Laptops"),
      },
      {
        title: "Iphone 15 pro",
        price: 124999,
        description: "Storage:256",
        image: "Iphone15pro.jpeg",
        categoryID: await getCategoryId("Electronics"),
        rating: 5,
        subcategoryId: await getSubcategoryId("Mobiles"),
      },
      {
        title: "Tommy-Hilfiger Shirt",
        price: 999,
        description: "Best Quality Cloth",
        image: "Tommy.jpeg",
        categoryID: await getCategoryId("Clothing"),
        rating: 5,
        subcategoryId: await getSubcategoryId("Mens"),
      },
      {
        title: "Tommy T-shirt",
        price: 1299,
        description: "Premium Cotton Quality",
        image: "TommyTshirt.jpeg",
        categoryID: await getCategoryId("Clothing"),
        rating: 3.5,
        subcategoryId: await getSubcategoryId("Mens"),
      },
      {
        title: "Wooden Chair",
        price: 1999,
        description: "Original Neem Wooden made",
        image: "Woodchair.jpeg",
        categoryID: await getCategoryId("Furniture"),
        rating: 4.7,
        subcategoryId: await getSubcategoryId("Chairs"),
      },
      {
        title: "Double bed",
        price: 7899,
        description: "best Quality",
        image: "bed.jpeg",
        categoryID: await getCategoryId("Furniture"),
        rating: 4.4,
        subcategoryId: await getSubcategoryId("Beds"),
      },
      {
        title: "Addidas shoes for Men",
        price: 2499,
        description: "Premium shoes",
        image: "adiddas.jpg",
        categoryID: await getCategoryId("Footware"),
        rating: 3.5,
        subcategoryId: await getSubcategoryId("Addidas"),
      },
      {
        title: "Honda Shine 125",
        price: 78999,
        description: "125 cc engine",
        image: "shine.jpeg",
        categoryID: await getCategoryId("Bikes"),
        rating: 4.5,
        subcategoryId: await getSubcategoryId("Honda"),
      },
      {
        title: "Splendor",
        price: 69999,
        description: "100cc engine,Best Mileage",
        image: "splendor.jpeg",
        categoryID: await getCategoryId("Bikes"),
        rating: 4,
        subcategoryId: await getSubcategoryId("Honda"),
      },

      {
        title: "SONY LED TV",
        price: 69999,
        description: "High Resolution,42 Inch",
        image: "1745476167329-LEd.jpeg",
        categoryID: await getCategoryId("Electronics"),
        rating: 4.5,
        subcategoryId: await getSubcategoryId("TV"),
      },

      {
        title: "Verna Cart",
        price: 69999,
        description: "1400 HP Engine,Black",
        image: "1745325691102-verna.jpeg",
        categoryID: await getCategoryId("Cars"),
        rating: 5,
        subcategoryId: await getSubcategoryId("Hyundai"),
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
        userId: await getUserId("admin123@gmail.com"),
      },
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

  // const getCartId = async (userId) => {
  //   const user = await prisma.cart.findUnique({
  //     where: { userId: userId },
  //   });
  //   return user.id;
  // };

  // await prisma.cartProduct.createMany({
  //   data: [
  //     {
  //       cartId: await getCartId(await getUserId("admin123@gmail.com")),
  //       productId:,
  //       quantity:,
  //     },
  //     {
  //       userId: await getUserId("pranav123@gmail.com"),
  //     },
  //     {
  //       userId: await getUserId("darshit123@gmail.com"),
  //     },
  //     {
  //       userId: await getUserId("sagar123@gmail.com"),
  //     },
  //   ],
  // });

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
