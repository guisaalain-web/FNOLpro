const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const claims = await prisma.claim.findMany();
    console.log(JSON.stringify(claims, null, 2));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
