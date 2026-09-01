"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { OAuthLogin } from "@/components/OAuthLogin"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Page() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.log(error)
      return
    }

    router.push("/makes")
  }

  return (
    <main className="min-h-screen flex justify-center px-4 pt-14">
      <div className="w-full max-w-md space-y-4">

        {/* Header */}
        <div>
          <h1 className="text-xl font-semibold">
            Get&apos;s started.
          </h1>

          <p className="mt-2 text-xs text-muted-foreground">
            Don&apos;t have an account?{" "}
            <a
              href="/register"
              className="text-red-500"
            >
              Sign up
            </a>
          </p>
        </div>

        {/* Google / Facebook */}
        <OAuthLogin mode="signin" />

        {/* OR divider */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-300" />
          <span className="text-xs text-gray-400">
            or
          </span>
          <div className="h-px flex-1 bg-gray-300" />
        </div>

        {/* Email + Password Card */}
        <Card className="rounded-md">
          <CardContent className="space-y-4 p-3">

            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs"
              >
                Email
              </Label>

              <Input
                id="email"
                type="email"
                placeholder="Email"
                className="h-10 text-xs"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-xs"
              >
                Password
              </Label>

              <Input
                id="password"
                type="password"
                placeholder="••••••••••"
                className="h-10 text-xs"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

          </CardContent>
        </Card>

        {/* Remember / Forgot */}
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-3 w-3"
            />
            <span>Remember me</span>
          </label>

          <a
            href="/forgot-password"
            className="text-red-500"
          >
            Forgot your password?
          </a>
        </div>

        {/* Sign in */}
        <Button
          type="button"
          className="h-10 w-full rounded-md bg-[#ed0038] text-sm hover:bg-[#ed0038]/90"
          onClick={handleLogin}
        >
          Sign in
        </Button>

      </div>
    </main>
  )
}