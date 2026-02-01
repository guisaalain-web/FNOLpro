"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
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
import { toast } from "sonner";

const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(1, "La contraseña es requerida"),
});

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof loginSchema>) {
        setLoading(true);
        try {
            const result = await signIn("credentials", {
                email: values.email,
                password: values.password,
                redirect: false,
            });

            if (result?.error) {
                toast.error("Credenciales inválidas. Usa: demo@demo.com / demo");
            } else {
                toast.success("¡Bienvenido!");
                router.push("/dashboard");
                router.refresh();
            }
        } catch (error) {
            toast.error("Error al iniciar sesión");
        } finally {
            setLoading(false);
        }
    }

    const fillDemoCredentials = () => {
        form.setValue("email", "demo@demo.com");
        form.setValue("password", "demo");
        toast.info("Credenciales de demo rellenadas");
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
            <Card className="w-full max-w-md border-slate-700 bg-slate-900/80 backdrop-blur">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight text-center text-white">
                        FNOL <span className="text-blue-400">Pro</span>
                    </CardTitle>
                    <CardDescription className="text-center text-slate-400">
                        Sistema de Gestión de Reclamaciones de Seguros
                    </CardDescription>
                </CardHeader>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-200">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="demo@demo.com"
                                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
                                {...form.register("email")}
                                disabled={loading}
                            />
                            {form.formState.errors.email && (
                                <p className="text-sm text-red-400">
                                    {form.formState.errors.email.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-200">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••"
                                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
                                {...form.register("password")}
                                disabled={loading}
                            />
                            {form.formState.errors.password && (
                                <p className="text-sm text-red-400">
                                    {form.formState.errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Demo credentials box */}
                        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <p className="text-xs text-blue-300 mb-2">
                                🎓 <strong>Versión Demo</strong> - Credenciales de prueba:
                            </p>
                            <p className="text-xs text-slate-400">
                                Email: <code className="text-blue-300">demo@demo.com</code>
                            </p>
                            <p className="text-xs text-slate-400">
                                Contraseña: <code className="text-blue-300">demo</code>
                            </p>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="mt-2 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 p-0 h-auto"
                                onClick={fillDemoCredentials}
                            >
                                → Usar credenciales demo
                            </Button>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
