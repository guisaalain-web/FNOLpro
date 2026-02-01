import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { getCompanyBranding, generateCertificateHTML } from "@/lib/certificate-utils";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: (session.user as any).id },
            select: {
                name: true,
                email: true,
                insuranceCompany: true,
            }
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        const branding = getCompanyBranding(user.insuranceCompany);
        const html = generateCertificateHTML(user, branding);

        // We return as HTML for simplicity or to be downloaded as .html
        // Modern browsers handle window.print() well from HTML
        return new NextResponse(html, {
            headers: {
                "Content-Type": "text/html",
                "Content-Disposition": `attachment; filename="Certificate_${branding.name}.html"`,
            },
        });
    } catch (error) {
        console.error("Certificate generation error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
