import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-red-600">Verification Failed</h1>
      <p className="text-gray-600 mb-4">
        We couldn't verify your email address. This might be because:
      </p>
      <ul className="list-disc list-inside text-gray-600 mb-6">
        <li>The verification link has expired</li>
        <li>The link was already used</li>
        <li>The link is invalid</li>
      </ul>
      <Link 
        href="/auth/signin"
        className="text-blue-600 hover:text-blue-800 font-medium"
      >
        Return to Sign In
      </Link>
    </div>
  )
} 