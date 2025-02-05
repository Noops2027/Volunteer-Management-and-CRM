'use client'

import { Card } from "@/components/ui/card"
import { Users } from "lucide-react"
import { VolunteerSignUp } from "@/components/auth/volunteer-signup"
import Link from "next/link"

export default function VolunteerSignUpPage() {
  return (
    <div className="container max-w-lg py-16">
      <Card className="p-6 border-t-4 border-t-blue-600">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Create Volunteer Account
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Join organizations and start your volunteering journey
          </p>
        </div>

        <VolunteerSignUp />
      </Card>

      {/* Additional context */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4 text-sm text-blue-700">
        <h3 className="font-medium mb-1">Already have an account?</h3>
        <p>
          <Link 
            href="/auth/volunteer/signin" 
            className="text-blue-600 hover:underline font-medium"
          >
            Sign in to your volunteer account
          </Link>
        </p>
      </div>
    </div>
  )
} 