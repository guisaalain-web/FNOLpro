"use client";

import { useSession } from "next-auth/react";
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
import { updateUserCompany } from "@/actions/auth";
import { Input } from "@/components/ui/input";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
    const { data: session } = useSession();
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownloadCertificate = async () => {
        setIsDownloading(true);
        toast.info("Generating your certificate...");

        try {
            const response = await fetch("/api/certificate");
            if (!response.ok) throw new Error("Failed to download");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Insurance_Certificate.html`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            toast.success("Certificate downloaded successfully!");
        } catch (error) {
            toast.error("Error generating certificate");
        } finally {
            setIsDownloading(false);
        }
    };

    const [newCompany, setNewCompany] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdateCompany = async () => {
        if (!newCompany.trim()) return;
        setIsUpdating(true);
        try {
            const result = await updateUserCompany(newCompany);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(`Provider updated to ${newCompany.toUpperCase()}`);
                setNewCompany("");
            }
        } catch (error) {
            toast.error("Failed to update provider");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">
                    Welcome back, {session?.user?.name || "User"}
                </h2>
                <p className="text-muted-foreground">
                    Here&apos;s an overview of your insurance claims and activities.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">0% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
                        <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1</div>
                        <p className="text-xs text-muted-foreground">Standard Plus Coverage</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">No urgent actions</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Claims</CardTitle>
                        <CardDescription>
                            You haven&apos;t filed any claims yet.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center space-y-4 py-8 text-center">
                            <PlusCircle className="h-12 w-12 text-muted-foreground/50" />
                            <div className="space-y-2">
                                <h3 className="font-semibold">No claims found</h3>
                                <p className="text-sm text-muted-foreground">
                                    Need to report an incident? Start a new FNOL.
                                </p>
                            </div>
                            <Button asChild>
                                <Link href="/dashboard/claims/new">Start New Claim</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button variant="outline" className="w-full justify-start" asChild>
                            <Link href="/dashboard/claims/new">Report Incident (Auto)</Link>
                        </Button>
                        <Button variant="outline" className="w-full justify-start" asChild>
                            <Link href="/dashboard/claims/new">Report Incident (Home)</Link>
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
                            {isDownloading ? "Generating..." : "Download Certificate of Insurance"}
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                            Contact Support
                        </Button>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Insurance Provider</CardTitle>
                        <CardDescription>
                            Type your company name to personalize your certificates.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="e.g. MAPFRE, AXA, etc."
                                value={newCompany}
                                onChange={(e) => setNewCompany(e.target.value)}
                                disabled={isUpdating}
                            />
                            <Button
                                onClick={handleUpdateCompany}
                                disabled={isUpdating || !newCompany.trim()}
                            >
                                {isUpdating ? (
                                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                                ) : (
                                    "Save"
                                )}
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Colors will be assigned automatically if the company is recognized.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
