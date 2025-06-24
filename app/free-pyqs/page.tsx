"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Eye, BookOpen, Filter, Bookmark } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { PDFViewer } from "@/components/pdf-viewer"
import { addWatermarkToPDF, downloadBlob, getDirectPDFUrl } from "@/lib/pdf-watermark"

interface PYQ {
  id: string
  title: string
  subject: string
  department: string
  semester: string
  year: string
  file_url: string
  view_url: string
  is_premium: boolean
  created_at: string
}

export default function FreePYQsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [pyqs, setPyqs] = useState<PYQ[]>([])
  const [filteredPyqs, setFilteredPyqs] = useState<PYQ[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSemester, setSelectedSemester] = useState("all")
  const [selectedYear, setSelectedYear] = useState("all")
  const [loading, setLoading] = useState(true)
  const [viewingPYQ, setViewingPYQ] = useState<PYQ | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  useEffect(() => {
    fetchPYQs()
  }, [])

  const fetchPYQs = async () => {
    try {
      const { data, error } = await supabase
        .from("pyqs")
        .select("*")
        .eq("is_premium", false)
        .order("created_at", { ascending: false })

      if (error) throw error

      setPyqs(data || [])
      setFilteredPyqs(data || [])
    } catch (error) {
      console.error("Error fetching PYQs:", error)
      toast({
        title: "Error",
        description: "Failed to fetch PYQs",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Filter logic
  useEffect(() => {
    let filtered = pyqs

    if (searchTerm) {
      filtered = filtered.filter(
        (pyq) =>
          pyq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pyq.subject.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedSemester !== "all") {
      filtered = filtered.filter((pyq) => pyq.semester === selectedSemester)
    }

    if (selectedYear !== "all") {
      filtered = filtered.filter((pyq) => pyq.year === selectedYear)
    }

    setFilteredPyqs(filtered)
  }, [searchTerm, selectedSemester, selectedYear, pyqs])

  const handleView = async (pyq: PYQ) => {
    if (user) {
      // Track user activity
      await supabase.from("user_activity").insert({
        user_id: user.id,
        pyq_id: pyq.id,
        action: "viewed",
      })
    }
    setViewingPYQ(pyq)
  }

  const handleDownload = async (pyq: PYQ) => {
    if (user) {
      // Track user activity
      await supabase.from("user_activity").insert({
        user_id: user.id,
        pyq_id: pyq.id,
        action: "downloaded",
      })
    }

    setDownloadingId(pyq.id)

    try {
      toast({
        title: "Processing",
        description: "Adding watermark to PDF...",
      })

      const directUrl = getDirectPDFUrl(pyq.file_url)
      const watermarkedBlob = await addWatermarkToPDF(directUrl, "Crack BATU")

      const filename = `${pyq.title.replace(/[^a-z0-9]/gi, "_")}_${pyq.year}_CrackBATU.pdf`
      downloadBlob(watermarkedBlob, filename)

      toast({
        title: "Success",
        description: "PDF downloaded with watermark",
      })
    } catch (error) {
      console.error("Error downloading PDF:", error)
      toast({
        title: "Error",
        description: "Failed to download PDF. Please try again.",
        variant: "destructive",
      })

      // Fallback to direct download
      window.open(pyq.file_url, "_blank")
    } finally {
      setDownloadingId(null)
    }
  }

  const handleBookmark = async (pyq: PYQ) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to bookmark PYQs",
        variant: "destructive",
      })
      return
    }

    try {
      await supabase.from("user_activity").insert({
        user_id: user.id,
        pyq_id: pyq.id,
        action: "bookmarked",
      })

      toast({
        title: "Success",
        description: "PYQ bookmarked successfully",
      })
    } catch (error) {
      console.error("Error bookmarking PYQ:", error)
      toast({
        title: "Error",
        description: "Failed to bookmark PYQ",
        variant: "destructive",
      })
    }
  }

  const departments = ["Computer Engineering"]
  const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"]
  const years = ["2024", "2023", "2022", "2021", "2020", "2019"]

  return (
    <div className="min-h-screen bg-dark-grey py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Free <span className="text-orange">PYQs</span>
          </h1>
          <p className="text-grey text-lg max-w-2xl mx-auto">
            Access our collection of previous years' question papers. All free, all organized for your success.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="bg-black border-grey/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Filter className="mr-2 h-5 w-5 text-orange" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-grey" />
                <Input
                  placeholder="Search by subject or title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-dark-grey border-grey/30 text-white placeholder:text-grey"
                />
              </div>

              <div className="relative">
                <Input value="Computer Engineering" readOnly className="bg-dark-grey border-grey/30 text-white" />
              </div>

              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger className="bg-dark-grey border-grey/30 text-white">
                  <SelectValue placeholder="Semester" />
                </SelectTrigger>
                <SelectContent className="bg-dark-grey border-grey/30">
                  <SelectItem value="all">All Semesters</SelectItem>
                  {semesters.map((sem) => (
                    <SelectItem key={sem} value={sem}>
                      Semester {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="bg-dark-grey border-grey/30 text-white">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent className="bg-dark-grey border-grey/30">
                  <SelectItem value="all">All Years</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-4">
          <p className="text-grey">
            Showing {filteredPyqs.length} of {pyqs.length} question papers
          </p>
        </div>

        {/* PYQs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-black border-grey/20 animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-grey/20 rounded mb-4"></div>
                  <div className="h-3 bg-grey/20 rounded mb-2"></div>
                  <div className="h-3 bg-grey/20 rounded mb-4"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 w-16 bg-grey/20 rounded"></div>
                    <div className="h-6 w-16 bg-grey/20 rounded"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-9 flex-1 bg-grey/20 rounded"></div>
                    <div className="h-9 flex-1 bg-grey/20 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPyqs.map((pyq) => (
              <Card key={pyq.id} className="bg-black border-grey/20 hover:border-orange/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <BookOpen className="h-6 w-6 text-orange flex-shrink-0" />
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-orange/10 text-orange border-orange/20">
                        {pyq.year}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleBookmark(pyq)}
                        className="h-6 w-6 p-0 text-grey hover:text-orange"
                      >
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <h3 className="text-white font-semibold mb-2 line-clamp-2">{pyq.title}</h3>

                  <p className="text-grey text-sm mb-4">
                    {pyq.department} • Semester {pyq.semester}
                  </p>

                  <div className="flex gap-2 mb-4">
                    <Badge variant="outline" className="border-grey/30 text-grey">
                      {pyq.subject}
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleView(pyq)}
                      className="flex-1 border-orange/30 text-orange hover:bg-orange hover:text-black"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDownload(pyq)}
                      disabled={downloadingId === pyq.id}
                      className="flex-1 bg-orange hover:bg-orange/90 text-black"
                    >
                      {downloadingId === pyq.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredPyqs.length === 0 && !loading && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-grey mx-auto mb-4" />
            <h3 className="text-white text-xl font-semibold mb-2">No PYQs Found</h3>
            <p className="text-grey">Try adjusting your search criteria or filters.</p>
          </div>
        )}

        {/* PDF Viewer Modal */}
        {viewingPYQ && (
          <PDFViewer
            fileUrl={viewingPYQ.file_url}
            title={viewingPYQ.title}
            isOpen={!!viewingPYQ}
            onClose={() => setViewingPYQ(null)}
            onDownload={() => handleDownload(viewingPYQ)}
          />
        )}
      </div>
    </div>
  )
}
