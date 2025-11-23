"use client";

import React, { useState } from "react";
import { loginUser } from "@/services/api/auth.service";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();

        try {
            setError(null);

            const data = await loginUser({ email, password });

            // Salvar token no localStorage (ou cookie)
            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);

            // Redirecionar para a página principal
            router.push("/painel");
        } catch (err: any) {
            setError(err.message || "Erro ao fazer login");
        }
    }



    return (

        <div className="min-h-screen flex items-center justify-center bg-grandient-to-br from-background via-secondary/20 to-primary/10 p-4">
            
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-primary rounded-xl p-3">
                            <Package className="h-8 w-8 text-primary-foreground" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Login</CardTitle>

                    <CardDescription>
                        Acesse sua conta
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form
                        onSubmit={handleLogin}
                        className="space-y-4"
                    >

                        {error && (
                            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        <label className="block mb-3">
                            <span className="text-gray-700">Email</span>
                            <input 
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 text-gray-700 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </label> 

                        <label className="block mb-5">
                            <span className="text-gray-700">Senha</span>
                            <input 
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 text-gray-700 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </label>



                        <Button type="submit" className="w-full">
                            Entrar
                        </Button>

                    </form>
                </CardContent>

            </Card>
            
        </div>
    );
};