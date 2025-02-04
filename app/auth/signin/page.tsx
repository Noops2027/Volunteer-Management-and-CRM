import { SignInForm } from '@/components/auth/signin-form'

export default function SignInPage() {
  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <SignInForm />
    </div>
  )
} 