import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const adminPassword = await bcrypt.hash("admin123", 10);
    const clientPassword = await bcrypt.hash("client123", 10);

    // Create Admin
    await prisma.user.upsert({
        where: { email: "admin@fnolpro.com" },
        update: {},
        create: {
            email: "admin@fnolpro.com",
            name: "Admin User",
            password: adminPassword,
            role: "ADMIN",
        },
    });

    // Create Client
    const client = await prisma.user.upsert({
        where: { email: "client@example.com" },
        update: {},
        create: {
            email: "client@example.com",
            name: "John Doe",
            password: clientPassword,
            role: "CLIENT",
        },
    });

    // Create a sample claim
    await prisma.claim.create({
        data: {
            claimNumber: "FNOL-SEED-001",
            type: "AUTO",
            status: "IN_REVIEW",
            policyholderName: "John Doe",
            policyholderId: "12345678X",
            policyholderEmail: "client@example.com",
            policyholderPhone: "+34 600 000 000",
            policyNumber: "POL-999-888",
            coverageType: "Comprehensive",
            incidentDate: new Date(),
            location: "Madrid, Spain",
            description: "Minor collision at the parking lot. Front bumper damaged.",
            damageCategory: "Bodywork",
            userId: client.id,
        },
    });

    console.log("Seed data created successfully");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
