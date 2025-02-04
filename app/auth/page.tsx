'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Building2 } from "lucide-react"
import Link from "next/link"

export default function AuthChoicePage() {
  return (
    <div className="container max-w-4xl py-16">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-3">
          Welcome to Volunteer CRM
        </h1>
        <p className="text-lg text-gray-600">
          Choose how you want to get started
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Volunteer Card */}
        <Card className="p-6 hover:shadow-lg transition-all duration-200">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">I'm a Volunteer</h2>
            <p className="text-sm text-gray-500 mt-2">
              Join organizations and find volunteering opportunities
            </p>
          </div>
          <div className="space-y-3">
            <Link href="/auth/volunteer/signin" className="w-full">
              <Button variant="outline" className="w-full">Sign In</Button>
            </Link>
            <Link href="/auth/volunteer/signup" className="w-full">
              <Button className="w-full">Create Volunteer Account</Button>
            </Link>
          </div>
        </Card>

        {/* Organization Card */}
        <Card className="p-6 hover:shadow-lg transition-all duration-200">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">I'm an Organization</h2>
            <p className="text-sm text-gray-500 mt-2">
              Manage volunteers and create opportunities
            </p>
          </div>
          <div className="space-y-3">
            <Link href="/auth/organization/signin" className="w-full">
              <Button variant="outline" className="w-full">Sign In</Button>
            </Link>
            <Link href="/auth/organization/signup" className="w-full">
              <Button className="w-full">Register Organization</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
} 