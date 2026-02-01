import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export const dynamic = "force-dynamic";

// Demo claim details
const DEMO_CLAIM = {
    id: "1",
    claimNumber: "FNOL-582103",
    type: "AUTO",
    status: "IN_REVIEW",
    createdAt: new Date("2026-01-28"),
    incidentDate: new Date("2026-01-28"),
    location: "Av. de la Constitución, 28, Sevilla",
    description: "Colisión trasera en rotonda durante hora punta. Daños en defensa y faro trasero izquierdo.",
    damageCategory: "Medium",
    policyholderName: "María García López",
    policyholderId: "12345678A",
    policyholderEmail: "maria.garcia@ejemplo.com",
    policyholderPhone: "+34 666 777 888",
    policyNumber: "AUTO-2025-8821",
    coverageType: "Cobertura Todo Riesgo",
    userId: "demo-client-1",
    activityLogs: [
        {
            id: "1",
            action: "CLAIM_CREATED",
            details: "Reclamación creada por Usuario Demo",
            createdAt: new Date("2026-01-28T10:30:00"),
        },
        {
            id: "2",
            action: "STATUS_UPDATED",
            details: "Estado cambiado a EN_REVISION",
            createdAt: new Date("2026-01-28T14:15:00"),
        },
    ],
};

export default async function ClaimDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user) return null;

    const claim = DEMO_CLAIM;

    if (!claim) return notFound();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        Detalles de Reclamación: {claim.claimNumber}
                    </h2>
                    <p className="text-muted-foreground">
                        Creada el {format(new Date(claim.createdAt), "PPP")}
                    </p>
                </div>
                <Badge variant="outline" className="text-lg px-3 py-1">
                    {claim.status}
                </Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Información del Incidente</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Tipo</label>
                                    <p>{claim.type}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Fecha</label>
                                    <p>{format(new Date(claim.incidentDate), "PPP")}</p>
                                </div>
                            </div>
                            <Separator />
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Ubicación</label>
                                <p>{claim.location}</p>
                            </div>
                            <Separator />
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Descripción de Daños</label>
                                <p className="mt-1">{claim.description}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Asegurado y Póliza</CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                                    Asegurado
                                </h3>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground">Nombre</label>
                                    <p>{claim.policyholderName}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground">DNI/NIE</label>
                                    <p>{claim.policyholderId}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground">Contacto</label>
                                    <p>{claim.policyholderEmail}</p>
                                    <p>{claim.policyholderPhone}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                                    Póliza de Seguro
                                </h3>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground">Nº Póliza</label>
                                    <p>{claim.policyNumber}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground">Cobertura</label>
                                    <p>{claim.coverageType}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="h-full flex flex-col">
                        <CardHeader>
                            <CardTitle>Registro de Actividad</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-hidden">
                            <ScrollArea className="h-[400px] pr-4">
                                <div className="space-y-4">
                                    {claim.activityLogs.map((log) => (
                                        <div key={log.id} className="border-l-2 border-primary pl-4 pb-4 last:pb-0">
                                            <p className="text-sm font-semibold">{log.action.replace("_", " ")}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {format(new Date(log.createdAt), "MMM d, HH:mm")}
                                            </p>
                                            {log.details && (
                                                <p className="text-xs mt-1 text-muted-foreground/80 italic">
                                                    &quot;{log.details}&quot;
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="text-center text-sm text-muted-foreground border-t pt-4">
                🎓 <strong>Versión Demo</strong> - Datos de ejemplo para demostración.
            </div>
        </div>
    );
}
