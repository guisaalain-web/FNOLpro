"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";

const claimSchema = z.object({
    type: z.enum(["AUTO", "HOME", "BUSINESS"]),
    policyholderName: z.string().min(2),
    policyholderId: z.string().min(2),
    policyholderEmail: z.string().email(),
    policyholderPhone: z.string().min(5),
    policyNumber: z.string().min(3),
    coverageType: z.string().min(2),
    incidentDate: z.date(),
    location: z.string().min(3),
    description: z.string().min(10),
    damageCategory: z.string().min(2),
});

export async function createClaim(data: z.infer<typeof claimSchema>) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return { error: "Unauthorized" };
    }

    try {
        const claimNumber = `FNOL-${Math.floor(100000 + Math.random() * 900000)}`;

        const claim = await prisma.claim.create({
            data: {
                ...data,
                claimNumber,
                userId: (session.user as any).id,
                status: "NEW",
            },
            include: {
                user: true,
            },
        });

        // Create activity log
        await prisma.activityLog.create({
            data: {
                claimId: claim.id,
                action: "CLAIM_CREATED",
                details: `Claim created by ${session.user.name} (${session.user.email})`,
            },
        });

        // Mock email notification
        console.log(`[MOCK EMAIL] To: ${claim.policyholderEmail}`);
        console.log(`Subject: Claim ${claim.claimNumber} Registered`);
        console.log(`Body: Hello ${claim.policyholderName}, your claim has been received and is under review.`);

        revalidatePath("/dashboard/claims");
        return { success: true, claimId: claim.id };
    } catch (error) {
        console.error("Error creating claim:", error);
        return { error: "Failed to create claim" };
    }
}
