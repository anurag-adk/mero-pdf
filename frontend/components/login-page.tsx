'use client'

import React from "react"

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FileText, Sparkles, ArrowRight, Loader2 } from 'lucide-react'

interface LoginPageProps {
  onSwitchToSignup: () => void
}

export function LoginPage({ onSwitchToSignup }: LoginPageProps) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(email, password)
    } catch (err) {
      setError('Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left side - Login Form */}
      <div className="flex w-full items-center justify-center px-6 lg:w-1/2 lg:px-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">PDF Chat</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
              Welcome back
            </h1>
            <p className="text-muted-foreground">
              Sign in to continue your AI-powered document conversations
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="h-11 w-full text-base font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-sm text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Sign up link */}
          <div className="text-center text-sm text-muted-foreground">
            {'Don\'t have an account? '}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="font-medium text-primary hover:underline"
            >
              Sign up for free
            </button>
          </div>
        </div>
      </div>

      {/* Right side - Feature Showcase */}
      <div className="hidden bg-gradient-to-br from-primary/10 via-accent/10 to-background lg:flex lg:w-1/2 lg:items-center lg:justify-center lg:px-12">
        <div className="max-w-lg">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            AI-Powered Document Analysis
          </div>
          
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-foreground">
            Chat with your PDFs using advanced AI
          </h2>
          
          <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
            Upload any PDF document and have natural conversations about its content. 
            Our RAG-powered AI understands context and provides accurate answers instantly.
          </p>

          <div className="space-y-4">
            {[
              'Upload and analyze unlimited PDF documents',
              'Get instant answers with context-aware AI',
              'Manage multiple conversation sessions',
              'Fast, accurate responses powered by RAG technology',
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/20">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <span className="text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
