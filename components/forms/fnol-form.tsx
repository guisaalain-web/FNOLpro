"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createClaim } from "@/actions/claims";
import { Calendar } from "lucide-react";

// Form Schema
const claimSchema = z.object({
    type: z.enum(["AUTO", "HOME", "BUSINESS"]),
    policyholderName: z.string().min(2, "Name is required"),
    policyholderId: z.string().min(2, "ID is required"),
    policyholderEmail: z.string().email("Invalid email"),
    policyholderPhone: z.string().min(5, "Phone is required"),
    policyNumber: z.string().min(3, "Policy number is required"),
    coverageType: z.string().min(2, "Coverage type is required"),
    incidentDate: z.string().min(1, "Date is required"),
    location: z.string().min(3, "Location is required"),
    description: z.string().min(10, "Description must be at least 10 chars"),
    damageCategory: z.string().min(2, "Damage category is required"),
});

type FormData = z.infer<typeof claimSchema>;

export function FNOLForm() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(claimSchema),
        defaultValues: {
            type: "AUTO",
            policyholderName: "",
            policyholderId: "",
            policyholderEmail: "",
            policyholderPhone: "",
            policyNumber: "",
            coverageType: "",
            incidentDate: new Date().toISOString().split("T")[0],
            location: "",
            description: "",
            damageCategory: "",
        },
    });

    const nextStep = async () => {
        // Basic validation for steps if needed, but react-hook-form handles overall
        setStep((s) => Math.min(s + 1, 3));
    };

    const prevStep = () => {
        setStep((s) => Math.max(s - 1, 1));
    };

    async function onSubmit(values: FormData) {
        setLoading(true);
        try {
            const result = await createClaim({
                ...values,
                incidentDate: new Date(values.incidentDate),
            });

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Claim submitted successfully!");

                // SAVE TO LOCAL STORAGE FOR DEMO
                try {
                    const newClaim = {
                        id: result.claimId || `demo-${Date.now()}`,
                        claimNumber: result.message?.match(/FNOL-\d+/)?.[0] || "FNOL-NEW",
                        type: values.type,
                        status: "NEW",
                        createdAt: new Date().toISOString(),
                        incidentDate: values.incidentDate,
                    };

                    const existing = localStorage.getItem("fnol_demo_claims");
                    const claims = existing ? JSON.parse(existing) : [];
                    claims.push(newClaim);
                    localStorage.setItem("fnol_demo_claims", JSON.stringify(claims));
                } catch (e) {
                    console.error("Demo save error", e);
                }

                router.push("/dashboard/claims");
                router.refresh();
            }
        } catch (error) {
            toast.error("Failed to submit claim");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-3xl mx-auto py-10">
            <div className="mb-8 flex justify-between items-center px-4">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex flex-col items-center">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= s
                                ? "bg-primary border-primary text-primary-foreground"
                                : "border-muted text-muted-foreground"
                                }`}
                        >
                            {s}
                        </div>
                        <span className="text-xs mt-2 text-muted-foreground font-medium">
                            {s === 1 ? "Basic Info" : s === 2 ? "Policy & Incident" : "Damage"}
                        </span>
                    </div>
                ))}
                <div className="absolute h-[2px] bg-muted w-2/3 -z-10 left-1/2 -translate-x-1/2 top-[124px]" />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>
                        {step === 1 && "Step 1: Claim Type & Contact"}
                        {step === 2 && "Step 2: Policy & Incident Details"}
                        {step === 3 && "Step 3: Damage & Description"}
                    </CardTitle>
                    <CardDescription>
                        {step === 1 && "Start by identifying the type of claim and providing contact information."}
                        {step === 2 && "Tell us about your policy and where/when the incident occurred."}
                        {step === 3 && "Describe the damage and any additional details."}
                    </CardDescription>
                </CardHeader>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6">
                        {step === 1 && (
                            <div className="space-y-4 animate-in fade-in duration-500">
                                <div className="space-y-2">
                                    <Label>Claim Type</Label>
                                    <Select
                                        onValueChange={(v) => form.setValue("type", v as any)}
                                        defaultValue={form.getValues("type")}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="AUTO">Auto (Vehicle)</SelectItem>
                                            <SelectItem value="HOME">Home (Property)</SelectItem>
                                            <SelectItem value="BUSINESS">Business (Commercial)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="policyholderName">Name</Label>
                                        <Input id="policyholderName" {...form.register("policyholderName")} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="policyholderId">ID / DNI / NIF</Label>
                                        <Input id="policyholderId" {...form.register("policyholderId")} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="policyholderEmail">Email</Label>
                                        <Input type="email" id="policyholderEmail" {...form.register("policyholderEmail")} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="policyholderPhone">Phone</Label>
                                        <Input id="policyholderPhone" {...form.register("policyholderPhone")} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4 animate-in fade-in duration-500">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="policyNumber">Policy Number</Label>
                                        <Input id="policyNumber" {...form.register("policyNumber")} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="coverageType">Coverage Type</Label>
                                        <Input id="coverageType" placeholder="e.g. Comprehensive, Basic Life" {...form.register("coverageType")} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="incidentDate">Incident Date</Label>
                                        <div className="relative">
                                            <Input id="incidentDate" type="date" {...form.register("incidentDate")} />
                                            <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="location">Incident Location</Label>
                                        <Input id="location" placeholder="City, Address..." {...form.register("location")} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-4 animate-in fade-in duration-500">
                                <div className="space-y-2">
                                    <Label>Damage Category</Label>
                                    <Input placeholder="e.g. Collision, Water Damage, Theft..." {...form.register("damageCategory")} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Detailed Description</Label>
                                    <Textarea
                                        id="description"
                                        rows={5}
                                        placeholder="Describe exactly what happened..."
                                        {...form.register("description")}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Min 10 characters. Be as specific as possible.
                                    </p>
                                </div>
                                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-2 bg-muted/50">
                                    <p className="text-sm font-medium">Attach Documents (Simulated)</p>
                                    <p className="text-xs text-muted-foreground">Photos, police reports, etc.</p>
                                    <Button type="button" variant="outline" size="sm">Coming Soon</Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-between border-t p-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={prevStep}
                            className={step === 1 ? "invisible" : ""}
                        >
                            Previous
                        </Button>
                        {step < 3 ? (
                            <Button type="button" onClick={nextStep}>
                                Next Step
                            </Button>
                        ) : (
                            <Button type="submit" disabled={loading}>
                                {loading ? "Submitting..." : "Submit Claim"}
                            </Button>
                        )}
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
