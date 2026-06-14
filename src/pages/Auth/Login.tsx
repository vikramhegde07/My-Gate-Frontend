// src/pages/Auth/Login.tsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
    const { login } = useAuth();
    const navigator = useNavigate();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        identifier: "",
        password: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        try {
            setLoading(true);

            await login(formData);
            navigator("/dashboard")
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>
                        Login
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >
                        <div>
                            <Label>
                                Email / Phone
                            </Label>

                            <Input
                                name="identifier"
                                value={
                                    formData.identifier
                                }
                                onChange={handleChange}
                                placeholder="Enter email or phone"
                                required
                            />
                        </div>

                        <div>
                            <Label>Password</Label>

                            <Input
                                type="password"
                                name="password"
                                value={
                                    formData.password
                                }
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <Button
                            className="w-full"
                            disabled={loading}
                            type="submit"
                        >
                            {loading
                                ? "Signing In..."
                                : "Login"}
                        </Button>

                        <p className="text-center text-sm text-muted-foreground">
                            Don't have an account?{" "}
                            <Link
                                to="/auth/register"
                                className="text-primary"
                            >
                                Register
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}