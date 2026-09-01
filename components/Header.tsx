"use client"
import { useEffect, useState } from "react"
import { Bell } from "lucide-react"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const router = useRouter()

  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser()

      if (error) {
        console.log(error)
        return
      }

      setUser(data.user)
    }

    getUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async() => {
    const {error} = await supabase.auth.signOut()
    if (error){
      console.log(error)
      return
    }
    router.push("/login")
  }

  return (
    <header className="bg-black px-8 py-4 font-sans">
        
      <div className="mx-auto flex items-center justify-between">
        
        {/* Search Bar */}
        <div className="mx-10 w-full max-w-xl">
          <Input
            type="text"
            placeholder="Search vehicles..."
            className="w-full rounded-2xl bg-white px-5 py-2 text-black outline-none"
          />
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-5">

          {/* Notifications */}
          <button className="text-white transition hover:text-gray-300">
            <Bell className="h-6 w-6" />
          </button>

          {/* User Profile */}
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className="h-10 w-10 cursor-pointer overflow-hidden rounded-full border-2 border-white"
              >
                <img
                  src="https://placehold.co/100x100/e5e7eb/6b7280?text=👤"
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </button>
            }
          />

          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <div>
                  {user.user_metadata?.firstName}{" "}
                  {user.user_metadata?.lastName}
                </div>

                <div className="text-xs font-normal text-muted-foreground">
                  {user.email}
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem>
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem onClick={handleLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <button
          onClick={() => router.push("/login")}
          className="h-10 w-10 cursor-pointer overflow-hidden rounded-full border-2 border-white"
        >
          <img
            src="https://placehold.co/100x100/e5e7eb/6b7280?text=👤"
            alt="Profile"
            className="h-full w-full object-cover"
          />
        </button>
      )}
        </div>
      </div>
    </header>
  )
}