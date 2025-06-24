"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, Bookmark, Crown, TrendingUp, Download, Eye } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

interface RecentActivity {
  id: string
  pyq_id: string
  action: "viewed" | "downloaded" | "bookmarked"
  created_at: string
  pyqs: {
    title: string
    subject: string
  }
}

interface BookmarkedPYQ {
  id: string
  pyq_id: string
  pyqs: {
    id: string
    title: string
    subject: string
    department: string
    semester: string
    year: string
    file_url: string
    view_url: string
  }
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [bookmarkedPYQs, setBookmarkedPYQs] = useState<BookmarkedPYQ[]>([])
  const [stats, setStats] = useState({
    downloaded: 0,
    bookmarked: 0,
    thisMonth: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    if (!user) return

    try {
      // Fetch recent activity
      const { data: activityData, error: activityError } = await supabase
        .from("user_activity")
        .select(`
          *,
          pyqs (title, subject)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10)

      if (activityError) throw activityError
      setRecentActivity(activityData || [])

      // Fetch bookmarked PYQs
      const { data: bookmarksData, error: bookmarksError } = await supabase
        .from("user_activity")
        .select(`
          *,
          pyqs (*)
        `)
        .eq("user_id", user.id)
        .eq("action", "bookmarked")
        .order("created_at", { ascending: false })

      if (bookmarksError) throw bookmarksError
      setBookmarkedPYQs(bookmarksData || [])

      // Calculate stats
      const downloaded = activityData?.filter((a) => a.action === "downloaded").length || 0
      const bookmarked = bookmarksData?.length || 0
      const thisMonth =
        activityData?.filter((a) => {
          const activityDate = new Date(a.created_at)
          const now = new Date()
          return activityDate.getMonth() === now.getMonth() && activityDate.getFullYear() === now.getFullYear()
        }).length || 0

      setStats({ downloaded, bookmarked, thisMonth })
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-dark-grey flex items-center justify-center">
        <Card className="card-modern p-8 text-center">
          <CardContent>
            <h2 className="text-white text-xl font-semibold mb-4">Please log in to access your dashboard</h2>
            <Link href="/auth/login">
              <Button className="gradient-orange text-black">Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-grey flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-grey py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, <span className="text-gradient">{user.name}</span>
          </h1>
          <p className="text-grey">Here's your study progress and recent activity</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="card-modern hover-lift animate-fade-in-up animation-delay-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-grey text-sm">Downloaded</p>
                  <p className="text-2xl font-bold text-white">{stats.downloaded}</p>
                </div>
                <Download className="h-8 w-8 text-orange" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern hover-lift animate-fade-in-up animation-delay-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-grey text-sm">Bookmarked</p>
                  <p className="text-2xl font-bold text-white">{stats.bookmarked}</p>
                </div>
                <Bookmark className="h-8 w-8 text-orange" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern hover-lift animate-fade-in-up animation-delay-400">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-grey text-sm">This Month</p>
                  <p className="text-2xl font-bold text-white">{stats.thisMonth}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern hover-lift animate-fade-in-up animation-delay-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-grey text-sm">Account</p>
                  <p className="text-2xl font-bold text-white">{user.isPremium ? "Premium" : "Free"}</p>
                </div>
                <Crown className={`h-8 w-8 ${user.isPremium ? "text-orange" : "text-grey"}`} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card className="card-modern animate-fade-in-up animation-delay-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Clock className="mr-2 h-5 w-5 text-orange" />
                Recent Activity
              </CardTitle>
              <CardDescription className="text-grey">Your recent downloads and views</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg glass-dark">
                      <div className="flex items-center space-x-3">
                        {activity.action === "downloaded" ? (
                          <Download className="h-4 w-4 text-orange" />
                        ) : activity.action === "bookmarked" ? (
                          <Bookmark className="h-4 w-4 text-orange" />
                        ) : (
                          <Eye className="h-4 w-4 text-orange" />
                        )}
                        <div>
                          <p className="text-white font-medium">{activity.pyqs?.title}</p>
                          <p className="text-grey text-sm">{activity.pyqs?.subject}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="bg-orange/10 text-orange border-orange/20">
                          {activity.action}
                        </Badge>
                        <p className="text-grey text-xs mt-1">{new Date(activity.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-grey text-center py-4">No recent activity</p>
                )}
              </div>
              <Link href="/free-pyqs">
                <Button
                  variant="outline"
                  className="w-full mt-4 border-orange/30 text-orange hover:bg-orange hover:text-black btn-modern"
                >
                  Browse More PYQs
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Bookmarked PYQs */}
          <Card className="card-modern animate-fade-in-up animation-delay-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Bookmark className="mr-2 h-5 w-5 text-orange" />
                Bookmarked PYQs
              </CardTitle>
              <CardDescription className="text-grey">Your saved question papers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookmarkedPYQs.length > 0 ? (
                  bookmarkedPYQs.map((bookmark) => (
                    <div key={bookmark.id} className="p-3 rounded-lg glass-dark">
                      <div className="flex items-start justify-between mb-2">
                        <BookOpen className="h-5 w-5 text-orange flex-shrink-0 mt-1" />
                        <Badge variant="secondary" className="bg-orange/10 text-orange border-orange/20">
                          {bookmark.pyqs?.year}
                        </Badge>
                      </div>
                      <h4 className="text-white font-medium mb-1">{bookmark.pyqs?.title}</h4>
                      <p className="text-grey text-sm">
                        {bookmark.pyqs?.department} • Semester {bookmark.pyqs?.semester}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(bookmark.pyqs?.view_url, "_blank")}
                          className="flex-1 border-orange/30 text-orange hover:bg-orange hover:text-black btn-modern"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => window.open(bookmark.pyqs?.file_url, "_blank")}
                          className="flex-1 gradient-orange text-black btn-modern"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-grey text-center py-4">No bookmarked PYQs</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Premium Upgrade CTA */}
        {!user.isPremium && (
          <Card className="glass-orange mt-8 animate-fade-in-up animation-delay-800">
            <CardContent className="p-8 text-center">
              <Crown className="h-12 w-12 text-orange mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Upgrade to Premium</h3>
              <p className="text-grey mb-6 max-w-2xl mx-auto">
                Get access to the latest question papers, exclusive study materials, and advanced features to boost your
                exam preparation.
              </p>
              <Link href="/premium">
                <Button size="lg" className="gradient-orange text-black font-semibold px-8 btn-modern hover-lift">
                  <Crown className="mr-2 h-5 w-5" />
                  Upgrade Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
