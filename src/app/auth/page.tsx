'use client';

import { LoginForm } from '@/components/organisms/LoginForm';
import { SignupForm } from '@/components/organisms/SignupForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';

export default function AuthPage() {
    return (
        <div className="w-full h-screen flex">
            {/* Left Side - Image */}
            <div className="hidden lg:flex w-1/2 bg-black items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-black opacity-80 z-10" />
                <Image
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=3870&auto=format&fit=crop"
                    alt="Collaboration"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="relative z-20 text-white p-12">
                    <h1 className="text-4xl font-bold mb-4">Collaborate seamlessly.</h1>
                    <p className="text-xl text-gray-300">
                        Unlock your team's potential with AI-powered document editing.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-background">
                <Tabs defaultValue="login" className="w-[400px]">
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>

                    {/* Login Tab */}
                    <TabsContent value="login">
                        <Card>
                            <CardHeader>
                                <CardTitle>Welcome back</CardTitle>
                                <CardDescription>
                                    Enter your credentials to access your account.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <LoginForm />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Signup Tab */}
                    <TabsContent value="signup">
                        <Card>
                            <CardHeader>
                                <CardTitle>Create an account</CardTitle>
                                <CardDescription>
                                    Get started with HRGenie today.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <SignupForm />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
