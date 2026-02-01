const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    const adminPassword = await bcrypt.hash('admin123', 10);
    const clientPassword = await bcrypt.hash('client123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@seguros.com' },
        update: {},
        create: {
            email: 'admin@seguros.com',
            name: 'Admin User',
            password: adminPassword,
            role: 'ADMIN',
            insuranceCompany: 'MAPFRE',
        },
    });

    const client = await prisma.user.upsert({
        where: { email: 'client@seguros.com' },
        update: {},
        create: {
            email: 'client@seguros.com',
            name: 'John Doe',
            password: clientPassword,
            role: 'CLIENT',
            insuranceCompany: 'ALLIANZ',
        },
    });

    // Create a sample claim for the client
    await prisma.claim.create({
        data: {
            claimNumber: 'CLM-' + Math.floor(1000 + Math.random() * 9000),
            type: 'AUTO',
            status: 'IN_REVIEW',
            policyholderName: 'John Doe',
            policyholderId: '12345678X',
            policyholderEmail: 'john@example.com',
            policyholderPhone: '600000000',
            policyNumber: 'POL-AUTO-999',
            coverageType: 'Comprehensive',
            incidentDate: new Date(),
            location: 'Madrid, Spain',
            description: 'Accident at the roundabout. Front bumper damaged.',
            damageCategory: 'Collision',
            userId: client.id,
            activityLogs: {
                create: [
                    { action: 'CLAIM_CREATED', details: 'Claim automatically generated for testing.' }
                ]
            }
        }
    });

    console.log('Seed data created:');
    console.log('Admin: admin@seguros.com / admin123');
    console.log('Client: client@seguros.com / client123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
