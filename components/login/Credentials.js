import React, { useContext, useEffect, useState } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Loader2, Eye, EyeOff } from 'lucide-react'

import { LoginContext } from '@/app/login/page'

export default function Credentials() {
    const { handleLogin, usernameRef, handleKeyDown, passwordRef, role, college, isLoading, handleBack } = useContext(LoginContext)
    const [showPassword, setShowPassword] = useState(false)

    return (
        <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="username">ID Number</Label>
                <Input
                id="username"
                type="text"
                ref={usernameRef}
                required
                placeholder="Enter your ID Number"
                onKeyDown={(e) => handleKeyDown(e)} autoFocus
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                    <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    ref={passwordRef}
                    required
                    placeholder="Enter your password"
                    onKeyDown={(e) => handleKeyDown(e)}
                    className="pr-10"
                    />
                    <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    >
                    {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                    )}
                    </Button>
                </div>
            </div>

            {role === "voter" && college && (
                <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-800">
                    <strong>Role:</strong> Voter
                    <br />
                    <strong>College:</strong> {college}
                </div>
                </div>
            )}

            {role === "admin" && (
                <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-green-800">
                    <strong>Role:</strong> Administrator
                </div>
                </div>
            )}

            <div className="space-y-2">
                <Button type="submit" className="w-full bg-[#1E90FF] hover:bg-blue-600 shadow-lg" disabled={isLoading}>
                {isLoading ? (
                    <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                    </>
                ) : (
                    "Sign In"
                )}
                </Button>
                <Button type="button" variant="outline" onClick={handleBack} className="w-full">
                Back
                </Button>
            </div>
        </form>
    )
}
