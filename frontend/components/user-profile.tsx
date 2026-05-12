'use client'

import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, User } from 'lucide-react'

export function UserProfile() {
  const { user, logout } = useAuth()

  if (!user) return null

  const getInitials = (email: string) => {
    const name = email.split('@')[0]
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full border border-border bg-muted text-foreground hover:bg-accent text-xs font-semibold"
        >
          {getInitials(user.email)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 rounded-xl border border-border bg-popover shadow-lg"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal px-3 py-2.5">
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium leading-none text-foreground">
              {user.email.split('@')[0]}
            </p>
            <p className="text-xs leading-none text-muted-foreground mt-1">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem className="cursor-pointer rounded-lg mx-1 text-sm">
          <User className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem
          className="cursor-pointer rounded-lg mx-1 mb-1 text-sm text-destructive focus:text-destructive focus:bg-destructive/8"
          onClick={logout}
        >
          <LogOut className="mr-2 h-3.5 w-3.5" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
