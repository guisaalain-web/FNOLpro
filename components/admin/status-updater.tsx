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

type ClaimStatus = "NEW" | "IN_REVIEW" | "CLOSED";

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
                toast.success("Estado actualizado (demo)");
            }
        } catch (error) {
            toast.error("Error al actualizar estado");
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
                <SelectValue placeholder="Actualizar estado" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="NEW">Nueva</SelectItem>
                <SelectItem value="IN_REVIEW">En Revisión</SelectItem>
                <SelectItem value="CLOSED">Cerrada</SelectItem>
            </SelectContent>
        </Select>
    );
}
