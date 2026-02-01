const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findFirst({
        where: {
            email: { contains: 'gmail.com' }
        }
    });

    if (user) {
        await prisma.user.update({
            where: { id: user.id },
            data: { insuranceCompany: 'OCCIDENT' }
        });
        console.log(`User ${user.email} updated to OCCIDENT`);
    } else {
        console.log('User not found');
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
