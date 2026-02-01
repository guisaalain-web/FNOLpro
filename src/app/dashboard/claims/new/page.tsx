import { FNOLForm } from "@/components/forms/fnol-form";

export default function NewClaimPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Report New Incident</h2>
                <p className="text-muted-foreground">
                    Follow the guided steps to register your claim.
                </p>
            </div>
            <FNOLForm />
        </div>
    );
}
