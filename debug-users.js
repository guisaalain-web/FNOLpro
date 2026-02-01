const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        select: {
            email: true,
            name: true,
            role: true,
            insuranceCompany: true
        }
    });
    console.log('Current Users in DB:');
    console.table(users);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
