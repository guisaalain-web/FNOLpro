import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { getCompanyBranding, generateCertificateHTML } from "@/lib/certificate-utils";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        // Demo user data
        const user = {
            name: session.user.name || "Usuario Demo",
            email: session.user.email || "demo@demo.com",
            insuranceCompany: "MAPFRE", // Default for demo
        };

        const branding = getCompanyBranding(user.insuranceCompany);
        const html = generateCertificateHTML(user, branding);

        return new NextResponse(html, {
            headers: {
                "Content-Type": "text/html",
                "Content-Disposition": `attachment; filename=\"Certificate_${branding.name}.html\"`,
            },
        });
    } catch (error) {
        console.error("Certificate generation error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
