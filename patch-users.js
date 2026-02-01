const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Give all users without a company a random one from the list
    const companies = ['MAPFRE', 'ALLIANZ', 'AXA'];

    const users = await prisma.user.findMany({
        where: {
            insuranceCompany: null
        }
    });

    for (const user of users) {
        const randomCompany = companies[Math.floor(Math.random() * companies.length)];
        await prisma.user.update({
            where: { id: user.id },
            data: { insuranceCompany: randomCompany }
        });
        console.log(`Updated user ${user.email} with company ${randomCompany}`);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
