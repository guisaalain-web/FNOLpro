import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export const dynamic = "force-dynamic";

export default async function ClaimDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user) return null;

    const claim = await prisma.claim.findUnique({
        where: { id },
        include: {
            activityLogs: {
                orderBy: { createdAt: "desc" },
            },
            attachments: true,
        },
    });

    if (!claim) return notFound();

    // Basic security check: user can only see their own claims unless admin
    const isAdmin = (session.user as any).role === "ADMIN";
    if (claim.userId !== (session.user as any).id && !isAdmin) {
        return notFound();
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        Claim Details: {claim.claimNumber}
                    </h2>
                    <p className="text-muted-foreground">
                        Created on {format(new Date(claim.createdAt), "PPP")}
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
                            <CardTitle>Incident Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Type</label>
                                    <p>{claim.type}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Date</label>
                                    <p>{format(new Date(claim.incidentDate), "PPP")}</p>
                                </div>
                            </div>
                            <Separator />
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Location</label>
                                <p>{claim.location}</p>
                            </div>
                            <Separator />
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Damage Description</label>
                                <p className="mt-1">{claim.description}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Policyholder & Policy</CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                                    Policyholder
                                </h3>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground">Name</label>
                                    <p>{claim.policyholderName}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground">ID Number</label>
                                    <p>{claim.policyholderId}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground">Contact</label>
                                    <p>{claim.policyholderEmail}</p>
                                    <p>{claim.policyholderPhone}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                                    Insurance Policy
                                </h3>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground">Policy #</label>
                                    <p>{claim.policyNumber}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground">Coverage</label>
                                    <p>{claim.coverageType}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="h-full flex flex-col">
                        <CardHeader>
                            <CardTitle>Activity Log</CardTitle>
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
        </div>
    );
}
