"use client";

import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { updateClaimStatus } from "@/actions/admin";
import { toast } from "sonner";
import { ClaimStatus } from "@prisma/client";

interface StatusUpdaterProps {
    claimId: string;
    currentStatus: ClaimStatus;
}

export function StatusUpdater({ claimId, currentStatus }: StatusUpdaterProps) {
    const [loading, setLoading] = useState(false);

    const onStatusChange = async (newStatus: string) => {
        setLoading(true);
        try {
            const result = await updateClaimStatus(claimId, newStatus as ClaimStatus);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Status updated");
            }
        } catch (error) {
            toast.error("Failed to update status");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Select
            defaultValue={currentStatus}
            onValueChange={onStatusChange}
            disabled={loading}
        >
            <SelectTrigger className="h-8 w-[130px]">
                <SelectValue placeholder="Update status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="NEW">New</SelectItem>
                <SelectItem value="IN_REVIEW">In Review</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
            </SelectContent>
        </Select>
    );
}
