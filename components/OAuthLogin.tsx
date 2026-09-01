"use client"

import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc"
import { FaFacebook } from "react-icons/fa"

interface OAuthLoginProps {
  mode: "signin" | "signup"
}

export function OAuthLogin({ mode }: OAuthLoginProps) {
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/makes`,
      },
    })

    if (error) {
      console.error(error)
    }
  }

  const signInWithFacebook = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: {
        redirectTo: `${window.location.origin}/makes`,
      },
    })

    if (error) {
      console.error(error)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        type="button"
        variant="outline"
        className="h-10"
        onClick={signInWithGoogle}
      >
        <FcGoogle />
        Google
      </Button>

      <Button
        type="button"
        variant="outline"
        className="h-10"
        onClick={signInWithFacebook}
      >
        <FaFacebook />
        Facebook
      </Button>
    </div>
  )
}