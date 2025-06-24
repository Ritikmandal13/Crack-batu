"use client"

import { BookOpen, FileText, GraduationCap, Trophy, Zap, Star, Target, Sparkles } from "lucide-react"

export function FloatingElements() {
  const elements = [
    { Icon: BookOpen, delay: 0, color: "text-orange/20" },
    { Icon: FileText, delay: 2, color: "text-orange/15" },
    { Icon: GraduationCap, delay: 4, color: "text-orange/25" },
    { Icon: Trophy, delay: 6, color: "text-orange/20" },
    { Icon: Zap, delay: 8, color: "text-orange/15" },
    { Icon: Star, delay: 10, color: "text-orange/20" },
    { Icon: Target, delay: 12, color: "text-orange/15" },
    { Icon: Sparkles, delay: 14, color: "text-orange/25" },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {elements.map(({ Icon, delay, color }, index) => (
        <div
          key={index}
          className="absolute animate-float-slow opacity-40"
          style={{
            left: `${10 + index * 12}%`,
            top: `${20 + index * 8}%`,
            animationDelay: `${delay}s`,
            animationDuration: `${20 + Math.random() * 10}s`,
          }}
        >
          <Icon className={`w-16 h-16 ${color} animate-pulse`} />
        </div>
      ))}

      {/* Additional smaller floating elements */}
      {[...Array(20)].map((_, i) => (
        <div
          key={`small-${i}`}
          className="absolute animate-float opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 15}s`,
            animationDuration: `${15 + Math.random() * 10}s`,
          }}
        >
          <div className="w-1 h-1 bg-orange rounded-full animate-pulse" />
        </div>
      ))}
    </div>
  )
}
