'use client'

import { Card } from "@/components/ui/card"
import { Building2 } from "lucide-react"
import { OrganizationSignUp } from "@/components/auth/organization-signup"
import Link from "next/link"

export default function OrganizationSignUpPage() {
  return (
    <div className="container max-w-lg py-16">
      <Card className="p-6 border-t-4 border-t-purple-600">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="h-8 w-8 text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Register Organization
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Create an account to manage volunteers and events
          </p>
        </div>

        <OrganizationSignUp />
      </Card>

      {/* Additional context */}
      <div className="mt-6 bg-purple-50 rounded-lg p-4 text-sm text-purple-700">
        <h3 className="font-medium mb-1">Already registered?</h3>
        <p>
          <Link 
            href="/auth/organization/signin" 
            className="text-purple-600 hover:underline font-medium"
          >
            Sign in to your organization account
          </Link>
        </p>
      </div>
    </div>
  )
} 