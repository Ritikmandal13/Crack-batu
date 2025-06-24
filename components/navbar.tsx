"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, BookOpen, User, Crown, MessageSquare, Settings, Sparkles } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isAdmin, logout } = useAuth()

  const navItems = [
    { href: "/free-pyqs", label: "Free PYQs", icon: BookOpen },
    { href: "/premium", label: "Premium", icon: Crown },
    { href: "/feedback", label: "Feedback", icon: MessageSquare },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-black/80 border-b border-orange/30 shadow-lg shadow-black/20">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="text-2xl font-bold text-white group-hover:text-gradient transition-all duration-300">
              Crack <span className="text-orange animate-pulse">BATU</span>
            </div>
            <Sparkles className="h-5 w-5 text-orange animate-pulse" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 text-white hover:text-orange transition-all duration-300 font-medium group animate-fade-in-down animation-delay-${(index + 1) * 100}`}
              >
                <item.icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="relative">
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-orange group-hover:w-full transition-all duration-300"></span>
                </span>
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3 animate-fade-in-down animation-delay-500">
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-black hover:bg-gradient-orange transition-all duration-300 font-medium btn-modern hover-lift"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                {isAdmin && (
                  <Link href="/admin">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:text-black hover:bg-gradient-orange transition-all duration-300 font-medium btn-modern hover-lift"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-white hover:text-black hover:bg-gradient-orange transition-all duration-300 font-medium btn-modern hover-lift"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 animate-fade-in-down animation-delay-500">
                <Link href="/auth/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-black hover:bg-gradient-orange transition-all duration-300 font-medium border border-transparent hover:border-orange btn-modern"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button
                    size="sm"
                    className="gradient-orange hover:shadow-lg hover:shadow-orange/25 text-black font-semibold transition-all duration-300 btn-modern hover-lift animate-glow"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-orange hover:bg-orange/10 transition-all duration-300 btn-modern"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="backdrop-blur-xl bg-black/90 border-orange/30">
              <div className="flex flex-col space-y-6 mt-8">
                <div className="text-center mb-6">
                  <div className="text-xl font-bold text-gradient">
                    Crack <span className="text-orange">BATU</span>
                  </div>
                </div>

                {navItems.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-3 text-white hover:text-orange transition-all duration-300 font-medium py-3 px-4 rounded-lg hover:bg-orange/10 group animate-slide-in-right animation-delay-${(index + 1) * 100}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    <span>{item.label}</span>
                  </Link>
                ))}

                {user ? (
                  <div className="space-y-3 pt-6 border-t border-orange/20">
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-3 text-white hover:text-orange transition-all duration-300 font-medium py-3 px-4 rounded-lg hover:bg-orange/10 group animate-slide-in-right animation-delay-400"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                      <span>Dashboard</span>
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center space-x-3 text-white hover:text-orange transition-all duration-300 font-medium py-3 px-4 rounded-lg hover:bg-orange/10 group animate-slide-in-right animation-delay-500"
                        onClick={() => setIsOpen(false)}
                      >
                        <Settings className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                        <span>Admin</span>
                      </Link>
                    )}
                    <Button
                      variant="ghost"
                      onClick={() => {
                        logout()
                        setIsOpen(false)
                      }}
                      className="w-full justify-start text-white hover:text-orange hover:bg-orange/10 p-4 font-medium btn-modern animate-slide-in-right animation-delay-600"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3 pt-6 border-t border-orange/20">
                    <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-white hover:text-orange hover:bg-orange/10 font-medium btn-modern animate-slide-in-right animation-delay-400"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                      <Button className="w-full gradient-orange text-black font-semibold btn-modern hover-lift animate-slide-in-right animation-delay-500">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
