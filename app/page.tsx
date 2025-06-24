import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Crown, Users, FileText, Star, ArrowRight, Sparkles, Zap, Target } from "lucide-react"
import Link from "next/link"
import { AnimatedBackground } from "@/components/animated-background"
import { FloatingElements } from "@/components/floating-elements"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-dark-grey to-black relative overflow-hidden">
      <AnimatedBackground />
      <FloatingElements />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-30"></div>
        <div className="relative container mx-auto px-4 py-24 text-center">
          <div className="mx-auto max-w-5xl">
            <div className="animate-fade-in-up">
              <div className="flex items-center justify-center mb-6 animate-scale-in animation-delay-200">
                <Sparkles className="h-8 w-8 text-orange mr-3 animate-pulse" />
                <span className="text-orange font-semibold text-lg tracking-wide">
                  Welcome to the Future of Learning
                </span>
                <Sparkles className="h-8 w-8 text-orange ml-3 animate-pulse" />
              </div>

              <h1 className="mb-8 text-6xl md:text-8xl font-bold text-white leading-tight">
                Crack{" "}
                <span className="text-gradient animate-glow relative">
                  BATU
                  <div className="absolute -inset-1 bg-gradient-orange opacity-20 blur-xl animate-pulse"></div>
                </span>
              </h1>

              <p className="mb-12 text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-300">
                Your ultimate destination for <span className="text-orange font-semibold">Computer Engineering</span>{" "}
                previous years' question papers from{" "}
                <span className="text-gradient font-semibold">Dr. Babasaheb Ambedkar Technological University</span>.
                Access thousands of PYQs and ace your exams with style!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up animation-delay-500">
              <Link href="/free-pyqs">
                <Button
                  size="lg"
                  className="gradient-orange hover:shadow-2xl hover:shadow-orange/30 text-black font-bold px-10 py-6 text-lg transform hover:scale-105 transition-all duration-300 btn-modern hover-lift group"
                >
                  <BookOpen className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                  Explore Free PYQs
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>

              <Link href="/premium">
                <Button
                  size="lg"
                  variant="outline"
                  className="glass border-orange/50 text-white hover:bg-gradient-orange hover:text-black px-10 py-6 text-lg transform hover:scale-105 transition-all duration-300 btn-modern hover-lift group backdrop-blur-xl"
                >
                  <Crown className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                  Unlock Premium
                  <Sparkles className="ml-3 h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center mb-6 animate-fade-in-up">
              <Zap className="h-8 w-8 text-orange mr-3 animate-pulse" />
              <span className="text-orange font-semibold text-lg tracking-wide">Why Choose Us</span>
              <Zap className="h-8 w-8 text-orange ml-3 animate-pulse" />
            </div>

            <h2 className="text-5xl font-bold text-white mb-6 animate-fade-in-up animation-delay-200">
              Experience the <span className="text-gradient">Future</span> of Learning
            </h2>

            <p className="text-white/70 text-xl max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-300">
              We provide the most comprehensive collection of BATU question papers with smart organization, modern
              design, and seamless user experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-modern hover-lift group animate-fade-in-up animation-delay-400">
              <CardContent className="p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 glass-orange rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 animate-float">
                    <FileText className="h-10 w-10 text-orange" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-gradient transition-all duration-300">
                    Vast Collection
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    Access thousands of previous years' question papers across all semesters with smart categorization
                    and instant search.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="card-modern hover-lift group animate-fade-in-up animation-delay-600">
              <CardContent className="p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 glass-orange rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 animate-float animation-delay-200">
                    <Users className="h-10 w-10 text-orange" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-gradient transition-all duration-300">
                    Student Community
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    Join thousands of BATU students who trust Crack BATU for their exam preparation and academic
                    success.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="card-modern hover-lift group animate-fade-in-up animation-delay-800">
              <CardContent className="p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 glass-orange rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 animate-float animation-delay-400">
                    <Star className="h-10 w-10 text-orange" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-gradient transition-all duration-300">
                    Premium Experience
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    Get exclusive access to the latest question papers, advanced study materials, and premium features.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 gradient-mesh opacity-20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto glass-orange rounded-3xl p-12 animate-fade-in-up">
            <div className="flex items-center justify-center mb-6">
              <Target className="h-8 w-8 text-orange mr-3 animate-pulse" />
              <span className="text-orange font-semibold text-lg tracking-wide">Ready to Excel?</span>
              <Target className="h-8 w-8 text-orange ml-3 animate-pulse" />
            </div>

            <h2 className="text-5xl font-bold text-white mb-6 animate-fade-in-up animation-delay-200">
              Ready to <span className="text-gradient">Crack</span> Your Exams?
            </h2>

            <p className="text-white/80 text-xl mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-300">
              Join thousands of successful BATU students who have used our platform to excel in their studies and
              achieve their dreams.
            </p>

            <Link href="/auth/signup">
              <Button
                size="lg"
                className="gradient-orange hover:shadow-2xl hover:shadow-orange/40 text-black font-bold px-12 py-6 text-xl transform hover:scale-105 transition-all duration-300 btn-modern hover-lift group animate-fade-in-up animation-delay-500"
              >
                Get Started Today
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
