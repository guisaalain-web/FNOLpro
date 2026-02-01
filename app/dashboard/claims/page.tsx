import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
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
import { FileText, PlusCircle } from "lucide-react";

export const dynamic = "force-dynamic";

// Demo claims data
const DEMO_CLAIMS = [
    {
        id: "1",
        claimNumber: "FNOL-582103",
        type: "AUTO",
        status: "IN_REVIEW",
        createdAt: new Date("2026-01-28"),
        incidentDate: new Date("2026-01-28"),
    },
    {
        id: "2",
        claimNumber: "FNOL-694821",
        type: "HOME",
        status: "NEW",
        createdAt: new Date("2026-01-30"),
        incidentDate: new Date("2026-01-29"),
    },
];

export default async function ClaimsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) return null;

    const claims = DEMO_CLAIMS;

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
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Mis Reclamaciones</h2>
                    <p className="text-muted-foreground">
                        Gestiona y rastrea el estado de tus incidentes reportados.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/claims/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Nueva Reclamación
                    </Link>
                </Button>
            </div>

            <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Reclamación #</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Fecha Creación</TableHead>
                            <TableHead>Fecha Incidente</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {claims.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No se encontraron reclamaciones.
                                </TableCell>
                            </TableRow>
                        ) : (
                            claims.map((claim) => (
                                <TableRow key={claim.id}>
                                    <TableCell className="font-medium">{claim.claimNumber}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{claim.type}</Badge>
                                    </TableCell>
                                    <TableCell>{format(new Date(claim.createdAt), "PPP")}</TableCell>
                                    <TableCell>{format(new Date(claim.incidentDate), "PPP")}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={getStatusColor(claim.status)}>
                                            {claim.status.replace("_", " ")}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/dashboard/claims/${claim.id}`}>
                                                <FileText className="mr-2 h-4 w-4" />
                                                Ver Detalles
                                            </Link>
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
