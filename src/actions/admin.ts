"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { ClaimStatus } from "@prisma/client";

export async function updateClaimStatus(
    claimId: string,
    status: ClaimStatus,
    internalNote?: string
) {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).role !== "ADMIN") {
        return { error: "Unauthorized. Admin access required." };
    }

    try {
        const claim = await prisma.claim.update({
            where: { id: claimId },
            data: {
                status,
                internalNotes: internalNote || undefined,
            },
        });

        await prisma.activityLog.create({
            data: {
                claimId,
                action: "STATUS_UPDATED",
                details: `Status changed to ${status} by admin ${session.user.name}. ${internalNote ? `Note: ${internalNote}` : ""
                    }`,
            },
        });

        revalidatePath(`/dashboard/claims/${claimId}`);
        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        return { error: "Failed to update claim" };
    }
}
