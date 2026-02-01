"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function register(formData: z.infer<typeof registerSchema>) {
    try {
        const validatedData = registerSchema.parse(formData);

        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email },
        });

        if (existingUser) {
            return { error: "User already exists" };
        }

        const hashedPassword = await bcrypt.hash(validatedData.password, 10);

        const companies = ["MAPFRE", "ALLIANZ", "AXA", "OCCIDENT"];
        const randomCompany = companies[Math.floor(Math.random() * companies.length)];

        const user = await prisma.user.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                password: hashedPassword,
                role: "CLIENT", // Default role
                insuranceCompany: randomCompany,
            },
        });

        return { success: true, userId: user.id };
    } catch (error) {
        return { error: error instanceof Error ? error.message : "Something went wrong" };
    }
}

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { revalidatePath } from "next/cache";

export async function updateUserCompany(companyName: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return { error: "Unauthorized" };
    }

    try {
        await prisma.user.update({
            where: { id: (session.user as any).id },
            data: { insuranceCompany: companyName.toUpperCase() },
        });

        revalidatePath("/dashboard");
        revalidatePath("/api/certificate");

        return { success: true };
    } catch (error) {
        return { error: "Failed to update insurance company" };
    }
}
