import React, { useContext } from 'react'
import { Button } from '../ui/button'
import { Shield, User } from 'lucide-react'

import { LoginContext } from '@/app/login/page'

export default function Role() {
    const { handleRoleSelect } = useContext(LoginContext)

    return (
        <div className="space-y-4">
            <Button
                variant="outline"
                className="w-full h-16 text-left justify-start"
                onClick={() => handleRoleSelect("admin")}
            >
                <Shield className="w-6 h-6 mr-3 text-blue-600" />
                <div>
                <div className="font-semibold">Administrator</div>
                <div className="text-sm text-gray-500">Manage elections and view results</div>
                </div>
            </Button>
            <Button
                variant="outline"
                className="w-full h-16 text-left justify-start"
                onClick={() => handleRoleSelect("voter")}
            >
                <User className="w-6 h-6 mr-3 text-green-600" />
                <div>
                <div className="font-semibold">Voter</div>
                <div className="text-sm text-gray-500">Cast your vote in the election</div>
                </div>
            </Button>
        </div>
    )
}
