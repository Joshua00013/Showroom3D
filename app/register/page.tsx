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

export default function Page() {

  const [email,setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  
  const handleSignup = async() => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options:{
        data:{
          firstName,
          lastName,
        }
      }
    })
    if (error){
      console.error(error)
      return
    }
  }

  return (
    <main className="min-h-screen flex justify-center px-4 pt-14">
      <div className="w-full max-w-md space-y-4">

        {/* Header */}
        <div>
          <h1 className="text-xl font-semibold">Get&apos;s started.</h1>

        <p className="mt-2 text-xs text-muted-foreground">
          Already have an account?{" "}
          <a href="/login" className="text-red-500">
            Login
          </a>
        </p>
      </div>

        {/* Google / Facebook */}
        <OAuthLogin mode="signup"/>

        {/* OR divider */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-300" />
          <span className="text-xs text-gray-400">or</span>
          <div className="h-px flex-1 bg-gray-300" />
        </div>

      <Card className="rounded-md">
        <CardContent className="space-y-4 p-3">
          <div>
            <Label htmlFor="firstName" className="text-xs">
              First Name
            </Label>

            <Input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="First Name"
              value = {firstName}
              className="h-10 text-xs"
              onChange={e=>setFirstName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="lastName" className="text-xs">
              Last Name
            </Label>

            <Input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Last Name"
              value = {lastName}
              className="h-10 text-xs"
              onChange={e=>setLastName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-xs">
              Email
            </Label>

            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email Address"
              value = {email}
              className="h-10 text-xs"
              onChange={e=>setEmail(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-xs">
              Password
            </Label>

            <Input
              id="password"
              name="password"
              type="password"
              value = {password}
              placeholder="••••••••"
              className="h-10 text-xs"
              onChange={e=>setPassword(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

        {/* Sign up */}
        <Button className="h-10 w-full rounded-md bg-[#ed0038] text-sm hover:bg-[#ed0038]/90" 
        onClick={handleSignup}
        >
          Sign up
        </Button>

      </div>
    </main>
  )
}