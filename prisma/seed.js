import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/hash.util.js"; 

const prisma = new PrismaClient();

async function main() {
    // --- 1. CLEANUP DATABASE ---

    await prisma.loan.deleteMany({});
    await prisma.bookCopy.deleteMany({});
    await prisma.book.deleteMany({});
    await prisma.author.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.user.deleteMany({});

    await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name IN ('Loan', 'BookCopy', 'Book', 'Author', 'Category', 'User', 'BookAuthor', 'BookCategory');`;

    console.log("Database cleanup and sequence reset complete.");


    // --- 2. SEED USERS ---

    const adminPassword = await hashPassword("Admin123");
    const userPassword = await hashPassword("User1234");

    const adminUser = await prisma.user.create({
        data: {
            email: "admin@library.com",
            password: adminPassword,
            name: "Super Admin",
            role: "ADMIN",
        },
    });

    const user1 = await prisma.user.create({
        data: {
            email: "user1@library.com",
            password: userPassword,
            name: "Tama Setiawan",
            role: "USER",
        },
    });

    const user2 = await prisma.user.create({
        data: {
            email: "user2@library.com",
            password: userPassword,
            name: "Naresh Ganesa",
            role: "USER",
        },
    });

    const user3 = await prisma.user.create({
        data: {
            email: "user3@library.com",
            password: userPassword,
            name: "Kala Renjani",
            role: "USER",
        },
    });

    console.log(`Seeded Users: Admin (${adminUser.id}), User1 (${user1.id}), User2 (${user2.id}), User3 (${user3.id})`);


    // --- 3. SEED AUTHORS & CATEGORIES ---

    const author1 = await prisma.author.create({ data: { name: "Urushibara Yuu", bio: "Japanese novelist." } });
    const author2 = await prisma.author.create({ data: { name: "J.K. Rowling", bio: "British author." } });
    const author3 = await prisma.author.create({ data: { name: "Pramoedya Ananta Toer", bio: "Indonesian writer." } });
    const author4 = await prisma.author.create({ data: { name: "Agatha Christie", bio: "English writer known for her detective novels." } });
    const author5 = await prisma.author.create({ data: { name: "George Orwell", bio: "English novelist and essayist." } });
    
    const cat1 = await prisma.category.create({ data: { name: "Fiction" } });
    const cat2 = await prisma.category.create({ data: { name: "Fantasy" } });
    const cat3 = await prisma.category.create({ data: { name: "History" } });
    const cat4 = await prisma.category.create({ data: { name: "Science Fiction" } });
    const cat5 = await prisma.category.create({ data: { name: "Mystery" } });
    
    console.log("Seeded Authors and Categories.");


    // --- 4. SEED BOOKS ---

    const book1 = await prisma.book.create({
        data: {
            title: "Strange Houses",
            description: "Strange Houses is a horror novel exploring mysterious architectural features in a second-hand Tokyo home.",
            isbn: "978-0063433151",
            publisher: "Seven Seas Entertainment",
            year: 2021,
            authors: { create: [{ authorId: author1.id }] },
            categories: { create: [{ categoryId: cat1.id }] },
        },
    });

    const book2 = await prisma.book.create({
        data: {
            title: "Harry Potter and the Sorcerer's Stone",
            description: "Harry Potter, an eleven-year-old orphan, discovers that he is a wizard and is invited to study at Hogwarts.",
            publisher: "Bloomsbury",
            year: 1997,

            authors: { create: [{ authorId: author2.id }] },
            categories: { create: [{ categoryId: cat1.id }, { categoryId: cat2.id }] },
        },
    });

    const book3 = await prisma.book.create({
        data: {
            title: "Anak Semua Bangsa",
            description: "Child of All Nations continues the story of the lives of the main character, Minke, and his mother in law, Nyai Ontosoroh.",
            isbn: "978-623-106-633-6",
            publisher: "Lentera Dipantara",
            year: 1980,

            authors: { create: [{ authorId: author3.id }] },
            categories: { create: [{ categoryId: cat3.id }] },
        },
    });

    const book4 = await prisma.book.create({
        data: {
            title: "Murder on the Orient Express",
            description: "A detective novel featuring the famous Belgian detective Hercule Poirot.",
            isbn: "978-0062693662",
            publisher: "Collins Crime Club",
            year: 1934,

            authors: { create: [{ authorId: author4.id }] },
            categories: { create: [{ categoryId: cat5.id }] },
        },
    });

    const book5 = await prisma.book.create({
        data: {
            title: "1984",
            description: "A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism.",
            isbn: "978-0451524935",
            publisher: "Secker & Warburg",
            year: 1949,

            authors: { create: [{ authorId: author5.id }] },
            categories: { create: [{ categoryId: cat4.id }] },
        },
    });

    console.log(`Seeded Books: ${book1.title}, ${book2.title}, ${book3.title}, ${book4.title}, ${book5.title}.`);


    // --- 5. SEED BOOK COPIES ---

    const copy1 = await prisma.bookCopy.create({
        data: { bookId: book1.id, barcode: "ISBN1-001", status: "BORROWED" }
    });
    const copy2 = await prisma.bookCopy.create({
        data: { bookId: book1.id, barcode: "ISBN1-002", status: "BORROWED" }
    });
    await prisma.bookCopy.create({
        data: { bookId: book2.id, barcode: "ISBN2-001", status: "AVAILABLE" }
    });
    const copy4 = await prisma.bookCopy.create({
        data: { bookId: book3.id, barcode: "ISBN3-001", status: "MAINTENANCE" }
    });
    const copy5 = await prisma.bookCopy.create({
        data: { bookId: book4.id, barcode: "ISBN4-001", status: "AVAILABLE" }
    });
    
    console.log("Seeded Book Copies.");


    // --- 6. SEED LOANS ---
    
    const dueDate1 = new Date();
    dueDate1.setDate(dueDate1.getDate() + 7);
    
    await prisma.loan.create({
        data: {
            userId: user1.id,
            bookCopyId: copy2.id,
            dueDate: dueDate1, 
            status: "ONGOING"
        }
    });

    const dueDate2 = new Date();
    dueDate2.setDate(dueDate2.getDate() - 10);
    const returnedAt = new Date();
    returnedAt.setDate(returnedAt.getDate() - 5);

    await prisma.loan.create({
        data: {
            userId: user2.id,
            bookCopyId: copy4.id,
            dueDate: dueDate2,
            returnedAt: returnedAt,
            status: "RETURNED"
        }
    });

    const dueDate3 = new Date();
    dueDate3.setDate(dueDate3.getDate() - 3);

    await prisma.loan.create({
        data: {
            userId: user3.id,
            bookCopyId: copy1.id,
            dueDate: dueDate3,
            status: "ONGOING"
        }
    });

    const dueDate4 = new Date();
    dueDate4.setDate(dueDate4.getDate() - 10);
    const returnedAtLate = new Date(dueDate4);
    returnedAtLate.setDate(returnedAtLate.getDate() + 3);

    await prisma.loan.create({
    data: {
        userId: user3.id,
        bookCopyId: copy5.id,
        dueDate: dueDate4, 
        returnedAt: returnedAtLate, 
        
        status: "LATE"
      }
  });

    console.log("Seeded Loans.");
    
    console.log("--- Seeding complete! ---");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
