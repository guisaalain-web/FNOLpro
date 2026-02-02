"use client";

import { useEffect, useState } from "react";
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
import { FileText } from "lucide-react";

type Claim = {
    id: string;
    claimNumber: string;
    type: string;
    status: string;
    createdAt: Date | string;
    incidentDate: Date | string;
};

interface ClaimsListClientProps {
    initialClaims: Claim[];
}

export function ClaimsListClient({ initialClaims }: ClaimsListClientProps) {
    const [claims, setClaims] = useState<Claim[]>(initialClaims);

    useEffect(() => {
        // Load local demo claims
        try {
            const localClaims = localStorage.getItem("fnol_demo_claims");
            if (localClaims) {
                const parsed = JSON.parse(localClaims);
                if (Array.isArray(parsed)) {
                    // Combine and sort by date (newest first)
                    const allClaims = [...parsed, ...initialClaims].sort((a, b) =>
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    );
                    setClaims(allClaims);
                }
            }
        } catch (e) {
            console.error("Error loading demo claims", e);
        }
    }, [initialClaims]);

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
    );
}
