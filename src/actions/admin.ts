"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";

type ClaimStatus = "NEW" | "IN_REVIEW" | "CLOSED";

export async function updateClaimStatus(
    claimId: string,
    status: ClaimStatus,
    internalNote?: string
) {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).role !== "ADMIN") {
        return { error: "No autorizado. Se requiere acceso de administrador." };
    }

    // Demo mode: Just return success
    console.log("[DEMO] Actualizando estado de reclamación:", {
        claimId,
        status,
        internalNote,
        admin: session.user.name,
    });

    return {
        success: true,
        message: `🎓 Versión Demo: Estado actualizado a ${status}.`
    };
}
