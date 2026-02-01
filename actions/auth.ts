"use server";

import { z } from "zod";

const registerSchema = z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export async function register(formData: z.infer<typeof registerSchema>) {
    // Demo mode: Always return success message
    return {
        success: true,
        message: "🎓 Versión Demo: El registro no está disponible. Usa las credenciales demo: demo@demo.com / demo"
    };
}

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";

export async function updateUserCompany(companyName: string) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return { error: "No autorizado" };
    }

    // Demo mode: Just return success without database
    return { success: true, message: `Proveedor actualizado a ${companyName.toUpperCase()} (demo)` };
}
