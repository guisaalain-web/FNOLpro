"use client";

import { useSession, signOut } from "next-auth/react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { FileText, PlusCircle, Shield, AlertCircle, Download, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export const dynamic = "force-dynamic";

// Demo data for showcase purposes
const DEMO_CLAIMS = [
    {
        id: "1",
        claimNumber: "CLM-2026-001",
        type: "AUTO",
        status: "IN_REVIEW",
        policyholderName: "María García",
        incidentDate: "2026-01-28",
        description: "Colisión en rotonda",
    },
    {
        id: "2",
        claimNumber: "CLM-2026-002",
        type: "HOME",
        status: "NEW",
        policyholderName: "Carlos López",
        incidentDate: "2026-01-30",
        description: "Daños por inundación",
    },
];

export default function DashboardPage() {
    const { data: session } = useSession();
    const [isDownloading, setIsDownloading] = useState(false);
    const [newCompany, setNewCompany] = useState("");
    const [currentCompany, setCurrentCompany] = useState("MAPFRE");

    const handleDownloadCertificate = async () => {
        setIsDownloading(true);
        toast.info("Generando certificado de demostración...");

        // Simulate download
        setTimeout(() => {
            toast.success("¡Esta es una versión demo! En producción se descargaría el certificado.");
            setIsDownloading(false);
        }, 1500);
    };

    const handleUpdateCompany = async () => {
        if (!newCompany.trim()) return;
        toast.success(`Proveedor actualizado a ${newCompany.toUpperCase()} (demo)`);
        setCurrentCompany(newCompany.toUpperCase());
        setNewCompany("");
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        Bienvenido, {session?.user?.name || "Usuario Demo"}
                    </h2>
                    <p className="text-muted-foreground">
                        Panel de gestión de reclamaciones de seguros.
                    </p>
                </div>
                <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })}>
                    Cerrar Sesión
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Reclamaciones</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2</div>
                        <p className="text-xs text-muted-foreground">+50% desde el mes pasado</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pólizas Activas</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1</div>
                        <p className="text-xs text-muted-foreground">Cobertura Standard Plus</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">En Revisión</CardTitle>
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1</div>
                        <p className="text-xs text-muted-foreground">Pendiente de documentación</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Proveedor</CardTitle>
                        <Shield className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{currentCompany}</div>
                        <p className="text-xs text-muted-foreground">Certificados personalizados</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Reclamaciones Recientes</CardTitle>
                        <CardDescription>
                            Últimas reclamaciones registradas en el sistema.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {DEMO_CLAIMS.map((claim) => (
                                <div key={claim.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="space-y-1">
                                        <p className="font-medium">{claim.claimNumber}</p>
                                        <p className="text-sm text-muted-foreground">{claim.description}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${claim.status === "IN_REVIEW"
                                                ? "bg-orange-100 text-orange-700"
                                                : "bg-green-100 text-green-700"
                                            }`}>
                                            {claim.status === "IN_REVIEW" ? "En Revisión" : "Nueva"}
                                        </span>
                                        <span className="text-xs text-muted-foreground">{claim.type}</span>
                                    </div>
                                </div>
                            ))}
                            <Button className="w-full" asChild>
                                <Link href="/dashboard/claims/new">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Nueva Reclamación
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Acciones Rápidas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button variant="outline" className="w-full justify-start" asChild>
                            <Link href="/dashboard/claims/new">Reportar Incidente (Auto)</Link>
                        </Button>
                        <Button variant="outline" className="w-full justify-start" asChild>
                            <Link href="/dashboard/claims/new">Reportar Incidente (Hogar)</Link>
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-start gap-2"
                            onClick={handleDownloadCertificate}
                            disabled={isDownloading}
                        >
                            {isDownloading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Download className="h-4 w-4" />
                            )}
                            {isDownloading ? "Generando..." : "Descargar Certificado"}
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                            Contactar Soporte
                        </Button>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Proveedor de Seguros</CardTitle>
                        <CardDescription>
                            Personaliza tu certificado con el nombre de tu aseguradora.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="ej. MAPFRE, AXA, etc."
                                value={newCompany}
                                onChange={(e) => setNewCompany(e.target.value)}
                            />
                            <Button
                                onClick={handleUpdateCompany}
                                disabled={!newCompany.trim()}
                            >
                                Guardar
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Los colores se asignarán automáticamente si la compañía es reconocida.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="text-center text-sm text-muted-foreground border-t pt-4">
                🎓 <strong>Versión Demo</strong> - Esta es una demostración del sistema FNOL Pro para portafolio.
            </div>
        </div>
    );
}
