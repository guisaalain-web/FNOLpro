import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

// Demo claims for admin view
const DEMO_ADMIN_CLAIMS = [
    {
        id: "1",
        claimNumber: "FNOL-582103",
        type: "AUTO",
        status: "IN_REVIEW",
        createdAt: new Date("2026-01-28"),
        user: {
            name: "María García",
            email: "maria@ejemplo.com",
        },
    },
    {
        id: "2",
        claimNumber: "FNOL-694821",
        type: "HOME",
        status: "NEW",
        createdAt: new Date("2026-01-30"),
        user: {
            name: "Carlos López",
            email: "carlos@ejemplo.com",
        },
    },
];

export default async function AdminDashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).role !== "ADMIN") {
        redirect("/dashboard");
    }

    const allClaims = DEMO_ADMIN_CLAIMS;

    const getStatusColor = (status: string) => {
        switch (status) {
            case "NEW":
                return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "IN_REVIEW":
                return "bg-orange-500/10 text-orange-500 border-orange-500/20";
            case "CLOSED":
                return "bg-green-500/10 text-green-500 border-green-500/20";
            default:
                return "bg-gray-500/10 text-gray-500 border-gray-500/20";
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Panel de Administración</h2>
                <p className="text-muted-foreground">
                    Vista global de todas las reclamaciones registradas en la plataforma.
                </p>
            </div>

            <div className="border rounded-lg bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Reclamación #</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Ver</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allClaims.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No hay reclamaciones registradas en el sistema.
                                </TableCell>
                            </TableRow>
                        ) : (
                            allClaims.map((claim) => (
                                <TableRow key={claim.id}>
                                    <TableCell className="font-medium">{claim.claimNumber}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{claim.user.name}</span>
                                            <span className="text-xs text-muted-foreground">{claim.user.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{claim.type}</Badge>
                                    </TableCell>
                                    <TableCell>{format(new Date(claim.createdAt), "MMM d, yyyy")}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={getStatusColor(claim.status)}>
                                            {claim.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/dashboard/claims/${claim.id}`}>Revisar</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="text-center text-sm text-muted-foreground border-t pt-4">
                🎓 <strong>Versión Demo</strong> - Datos de ejemplo para demostración.
            </div>
        </div>
    );
}
