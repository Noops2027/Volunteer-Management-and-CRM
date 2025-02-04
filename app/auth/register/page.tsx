'use client'

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrganizationSignUp } from '@/components/auth/organization-signup'
import { VolunteerSignUp } from '@/components/auth/volunteer-signup'

export default function RegisterPage() {
  return (
    <div className="container max-w-2xl py-8">
      <Card className="p-6">
        <Tabs defaultValue="volunteer" className="space-y-6">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="volunteer">Volunteer</TabsTrigger>
            <TabsTrigger value="organization">Organization</TabsTrigger>
          </TabsList>

          <TabsContent value="volunteer">
            <VolunteerSignUp />
          </TabsContent>

          <TabsContent value="organization">
            <OrganizationSignUp />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
} 