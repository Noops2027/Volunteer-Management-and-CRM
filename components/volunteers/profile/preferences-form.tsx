'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { 
  Bell, Mail, Phone, Eye, EyeOff, Calendar, Clock, Newspaper, Globe, 
  MessageSquare, Settings2, Contrast, Type, Info, BellRing, 
  Shield, Lock, Languages, Clock12, Accessibility, Megaphone,
  UserCheck, Users, CalendarCheck, BrainCircuit,
  AlertCircle, BookOpen, Brain, Building, 
  CalendarRange, ChevronRight,
  FileCheck, FileText, Fingerprint, HeartHandshake,
  HelpCircle, History, Key, LayoutGrid, MapPin,
  MessageCircle, Monitor, Moon, Palette, Share2,
  ShieldAlert, Sun, Timer, UserCog, Volume2,
  type LucideIcon
} from 'lucide-react'
import type { Volunteer } from '@/types/volunteer'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface PreferencesFormProps {
  volunteerId: string
  onSubmit: (data: Partial<Volunteer>) => Promise<void>
  isLoading?: boolean
}

const defaultPreferences = {
  notifications: {
    email: true,
    sms: false,
    event_reminders: true,
    schedule_changes: true,
    volunteer_opportunities: true,
    newsletter: false
  },
  privacy: {
    show_email: false,
    show_phone: false,
    show_availability: true,
    show_skills: true,
    show_interests: true,
    public_profile: false
  },
  communication: {
    preferred_language: 'en',
    contact_time: 'anytime',
    contact_method: 'email'
  },
  accessibility: {
    high_contrast: false,
    large_text: false,
    screen_reader: false
  }
}

function LabelWithTooltip({ 
  icon: Icon, 
  label, 
  tooltip,
  secondaryIcon = undefined
}: { 
  icon: LucideIcon
  label: string
  tooltip: string
  secondaryIcon?: LucideIcon
}) {
  const SecondaryIcon = secondaryIcon

  return (
    <div className="flex items-center gap-2 group">
      <Icon className="h-4 w-4 transition-colors group-hover:text-primary" />
      <span className="transition-colors group-hover:text-primary">{label}</span>
      {SecondaryIcon && (
        <SecondaryIcon className="h-4 w-4 text-muted-foreground" />
      )}
      <TooltipRoot>
        <TooltipTrigger asChild>
          <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help transition-all hover:text-primary hover:scale-110" />
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs">
          <p>{tooltip}</p>
        </TooltipContent>
      </TooltipRoot>
    </div>
  )
}

const HoverCard = ({ children, className, ...props }: React.ComponentProps<typeof Card>) => (
  <Card 
    className={cn(
      "transition-all duration-200 hover:shadow-lg hover:scale-[1.01] hover:border-primary/20",
      className
    )} 
    {...props}
  >
    {children}
  </Card>
)

export function PreferencesForm({ volunteerId, onSubmit, isLoading }: PreferencesFormProps) {
  const [preferences, setPreferences] = useState(defaultPreferences)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function loadPreferences() {
      const { data } = await supabase
        .from('volunteers')
        .select('preferences')
        .eq('id', volunteerId)
        .single()

      if (data?.preferences) {
        setPreferences(data.preferences)
      }
    }
    loadPreferences()
  }, [volunteerId, supabase])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await onSubmit({ preferences })
  }

  return (
    <TooltipProvider>
      <form onSubmit={handleSubmit} className="space-y-6">
        <HoverCard className="p-6">
          <h3 className="text-lg font-medium flex items-center gap-2 mb-4 group">
            <BellRing className="h-5 w-5 transition-colors group-hover:text-primary" />
            <span className="transition-colors group-hover:text-primary">Notification Preferences</span>
            <TooltipRoot>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help ml-2" />
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Manage how and when you receive notifications</p>
              </TooltipContent>
            </TooltipRoot>
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">
                  <LabelWithTooltip
                    icon={Mail}
                    secondaryIcon={AlertCircle}
                    label="Email Notifications"
                    tooltip="Receive important updates, event reminders, and announcements directly to your inbox. We'll never spam you."
                  />
                </Label>
                <p className="text-sm text-gray-500">
                  Receive updates and reminders via email
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={preferences.notifications.email}
                onCheckedChange={(checked) => setPreferences({
                  ...preferences,
                  notifications: { ...preferences.notifications, email: checked }
                })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sms-notifications">
                  <LabelWithTooltip
                    icon={Phone}
                    label="SMS Notifications"
                    tooltip="Receive urgent updates via text message"
                  />
                </Label>
                <p className="text-sm text-gray-500">
                  Receive urgent updates via text message
                </p>
              </div>
              <Switch
                id="sms-notifications"
                checked={preferences.notifications.sms}
                onCheckedChange={(checked) => setPreferences({
                  ...preferences,
                  notifications: { ...preferences.notifications, sms: checked }
                })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="event-reminders">
                  <LabelWithTooltip
                    icon={Calendar}
                    label="Event Reminders"
                    tooltip="Get reminded about upcoming events"
                  />
                </Label>
                <p className="text-sm text-gray-500">
                  Get reminded about upcoming events
                </p>
              </div>
              <Switch
                id="event-reminders"
                checked={preferences.notifications.event_reminders}
                onCheckedChange={(checked) => setPreferences({
                  ...preferences,
                  notifications: { ...preferences.notifications, event_reminders: checked }
                })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="schedule-changes">
                  <LabelWithTooltip
                    icon={CalendarRange}
                    secondaryIcon={Timer}
                    label="Schedule Changes"
                    tooltip="Get instant notifications when there are changes to your volunteer schedule, new opportunities, or urgent needs that match your availability."
                  />
                </Label>
                <p className="text-sm text-gray-500">
                  Stay updated about schedule changes
                </p>
              </div>
              <Switch
                id="schedule-changes"
                checked={preferences.notifications.schedule_changes}
                onCheckedChange={(checked) => setPreferences({
                  ...preferences,
                  notifications: { ...preferences.notifications, schedule_changes: checked }
                })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="newsletter">
                  <LabelWithTooltip
                    icon={Newspaper}
                    label="Newsletter"
                    tooltip="Receive our monthly newsletter"
                  />
                </Label>
                <p className="text-sm text-gray-500">
                  Receive our monthly newsletter
                </p>
              </div>
              <Switch
                id="newsletter"
                checked={preferences.notifications.newsletter}
                onCheckedChange={(checked) => setPreferences({
                  ...preferences,
                  notifications: { ...preferences.notifications, newsletter: checked }
                })}
              />
            </div>
          </div>
        </HoverCard>

        <HoverCard className="p-6">
          <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
            <ShieldAlert className="h-5 w-5" />
            Privacy & Security
            <TooltipRoot>
              <TooltipTrigger asChild>
                <Key className="h-4 w-4 text-muted-foreground cursor-help ml-2" />
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Control your privacy settings and data visibility</p>
              </TooltipContent>
            </TooltipRoot>
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-email">
                  <LabelWithTooltip
                    icon={Lock}
                    label="Show Email Address"
                    tooltip="Control who can see your email address in the volunteer directory"
                  />
                </Label>
                <p className="text-sm text-gray-500">
                  Make your email visible to other volunteers
                </p>
              </div>
              <Switch
                id="show-email"
                checked={preferences.privacy.show_email}
                onCheckedChange={(checked) => setPreferences({
                  ...preferences,
                  privacy: { ...preferences.privacy, show_email: checked }
                })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-phone">
                  <LabelWithTooltip
                    icon={Phone}
                    label="Show Phone Number"
                    tooltip="Make your phone number visible to other volunteers"
                  />
                </Label>
                <p className="text-sm text-gray-500">
                  Make your phone number visible to other volunteers
                </p>
              </div>
              <Switch
                id="show-phone"
                checked={preferences.privacy.show_phone}
                onCheckedChange={(checked) => setPreferences({
                  ...preferences,
                  privacy: { ...preferences.privacy, show_phone: checked }
                })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-availability">
                  <LabelWithTooltip
                    icon={Calendar}
                    label="Show Availability"
                    tooltip="Let others see when you're available"
                  />
                </Label>
                <p className="text-sm text-gray-500">
                  Let others see when you're available
                </p>
              </div>
              <Switch
                id="show-availability"
                checked={preferences.privacy.show_availability}
                onCheckedChange={(checked) => setPreferences({
                  ...preferences,
                  privacy: { ...preferences.privacy, show_availability: checked }
                })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="public-profile">
                  <LabelWithTooltip
                    icon={Globe}
                    label="Public Profile"
                    tooltip="Make your profile visible to the public"
                  />
                </Label>
                <p className="text-sm text-gray-500">
                  Make your profile visible to the public
                </p>
              </div>
              <Switch
                id="public-profile"
                checked={preferences.privacy.public_profile}
                onCheckedChange={(checked) => setPreferences({
                  ...preferences,
                  privacy: { ...preferences.privacy, public_profile: checked }
                })}
              />
            </div>
          </div>
        </HoverCard>

        <HoverCard className="p-6">
          <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
            <Languages className="h-5 w-5" />
            Communication Preferences
            <TooltipRoot>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help ml-2" />
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Manage your communication preferences</p>
              </TooltipContent>
            </TooltipRoot>
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="preferred-language">
                <LabelWithTooltip
                  icon={Languages}
                  label="Preferred Language"
                  tooltip="Select your preferred language for communication"
                />
              </Label>
              <Select
                value={preferences.communication.preferred_language}
                onValueChange={(value) => setPreferences({
                  ...preferences,
                  communication: { ...preferences.communication, preferred_language: value }
                })}
              >
                <SelectTrigger id="preferred-language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-time">
                <LabelWithTooltip
                  icon={Clock12}
                  label="Preferred Contact Time"
                  tooltip="Select your preferred time for contact"
                />
              </Label>
              <Select
                value={preferences.communication.contact_time}
                onValueChange={(value) => setPreferences({
                  ...preferences,
                  communication: { ...preferences.communication, contact_time: value }
                })}
              >
                <SelectTrigger id="contact-time">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="afternoon">Afternoon</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                  <SelectItem value="anytime">Anytime</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </HoverCard>

        <HoverCard className="p-6">
          <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
            <Accessibility className="h-5 w-5" />
            Accessibility Settings
            <TooltipRoot>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help ml-2" />
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Manage your accessibility settings</p>
              </TooltipContent>
            </TooltipRoot>
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="high-contrast">
                  <LabelWithTooltip
                    icon={Contrast}
                    label="High Contrast"
                    tooltip="Increase contrast for better visibility"
                  />
                </Label>
                <p className="text-sm text-gray-500">
                  Increase contrast for better visibility
                </p>
              </div>
              <Switch
                id="high-contrast"
                checked={preferences.accessibility.high_contrast}
                onCheckedChange={(checked) => setPreferences({
                  ...preferences,
                  accessibility: { ...preferences.accessibility, high_contrast: checked }
                })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="large-text">
                  <LabelWithTooltip
                    icon={Type}
                    label="Large Text"
                    tooltip="Increase text size throughout the app"
                  />
                </Label>
                <p className="text-sm text-gray-500">
                  Increase text size throughout the app
                </p>
              </div>
              <Switch
                id="large-text"
                checked={preferences.accessibility.large_text}
                onCheckedChange={(checked) => setPreferences({
                  ...preferences,
                  accessibility: { ...preferences.accessibility, large_text: checked }
                })}
              />
            </div>
          </div>
        </HoverCard>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Saving...' : 'Save Preferences'}
        </Button>
      </form>
    </TooltipProvider>
  )
} 