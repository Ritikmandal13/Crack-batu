"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, FileText, Users, MessageSquare, BarChart3, Eye, ExternalLink } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { getGoogleDriveFileId } from "@/lib/pdf-watermark"

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

interface User {
  id: string
  email: string
  name: string
  role: string
  is_premium: boolean
  created_at: string
}

interface Feedback {
  id: string
  user_id: string
  message: string
  type: string
  status: string
  created_at: string
  users: { name: string; email: string }
}

export default function AdminPage() {
  const { user, isAdmin } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [pyqs, setPyqs] = useState<PYQ[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddingPYQ, setIsAddingPYQ] = useState(false)
  const [editingPYQ, setEditingPYQ] = useState<PYQ | null>(null)

  // Form states
  const [newPYQ, setNewPYQ] = useState({
    title: "",
    subject: "",
    department: "Computer Engineering",
    semester: "",
    year: "",
    file_url: "",
    view_url: "",
    is_premium: false,
  })

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    if (!isAdmin) {
      router.push("/")
      return
    }

    fetchData()
  }, [user, isAdmin, router])

  const fetchData = async () => {
    try {
      // Fetch PYQs
      const { data: pyqsData, error: pyqsError } = await supabase
        .from("pyqs")
        .select("*")
        .order("created_at", { ascending: false })

      if (pyqsError) throw pyqsError
      setPyqs(pyqsData || [])

      // Fetch Users
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false })

      if (usersError) throw usersError
      setUsers(usersData || [])

      // Fetch Feedback
      const { data: feedbackData, error: feedbackError } = await supabase
        .from("feedback")
        .select(`
          *,
          users (name, email)
        `)
        .order("created_at", { ascending: false })

      if (feedbackError) throw feedbackError
      setFeedback(feedbackData || [])
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch admin data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const processGoogleDriveUrl = (url: string) => {
    const fileId = getGoogleDriveFileId(url)
    if (fileId) {
      return {
        file_url: `https://drive.google.com/uc?export=download&id=${fileId}`,
        view_url: `https://drive.google.com/file/d/${fileId}/preview`,
      }
    }
    return { file_url: url, view_url: url }
  }

  const handleAddPYQ = async () => {
    if (!user) return

    try {
      setIsAddingPYQ(true)

      console.time('Process Google Drive URL')
      // Process Google Drive URLs
      const processedUrls = processGoogleDriveUrl(newPYQ.file_url)
      console.timeEnd('Process Google Drive URL')

      console.time('Supabase Insert')
      const { data, error } = await supabase
        .from("pyqs")
        .insert({
          ...newPYQ,
          file_url: processedUrls.file_url,
          view_url: processedUrls.view_url,
          created_by: user.id,
        })
        .select()
        .single()
      console.timeEnd('Supabase Insert')

      if (error) throw error

      setPyqs([data, ...pyqs])
      setNewPYQ({
        title: "",
        subject: "",
        department: "Computer Engineering",
        semester: "",
        year: "",
        file_url: "",
        view_url: "",
        is_premium: false,
      })

      toast({
        title: "Success",
        description: "PYQ added successfully",
      })
    } catch (error) {
      console.error("Error adding PYQ:", error)
      toast({
        title: "Error",
        description: "Failed to add PYQ",
        variant: "destructive",
      })
    } finally {
      setIsAddingPYQ(false)
    }
  }

  const handleUpdatePYQ = async () => {
    if (!editingPYQ) return

    try {
      // Process Google Drive URLs if file_url was changed
      const processedUrls = processGoogleDriveUrl(editingPYQ.file_url)

      const updatedPYQ = {
        ...editingPYQ,
        file_url: processedUrls.file_url,
        view_url: processedUrls.view_url,
      }

      const { data, error } = await supabase.from("pyqs").update(updatedPYQ).eq("id", editingPYQ.id).select().single()

      if (error) throw error

      setPyqs(pyqs.map((pyq) => (pyq.id === editingPYQ.id ? data : pyq)))
      setEditingPYQ(null)

      toast({
        title: "Success",
        description: "PYQ updated successfully",
      })
    } catch (error) {
      console.error("Error updating PYQ:", error)
      toast({
        title: "Error",
        description: "Failed to update PYQ",
        variant: "destructive",
      })
    }
  }

  const handleDeletePYQ = async (id: string) => {
    try {
      const { error } = await supabase.from("pyqs").delete().eq("id", id)

      if (error) throw error

      setPyqs(pyqs.filter((pyq) => pyq.id !== id))

      toast({
        title: "Success",
        description: "PYQ deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting PYQ:", error)
      toast({
        title: "Error",
        description: "Failed to delete PYQ",
        variant: "destructive",
      })
    }
  }

  const handleUpdateFeedbackStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from("feedback").update({ status }).eq("id", id)

      if (error) throw error

      setFeedback(feedback.map((f) => (f.id === id ? { ...f, status } : f)))

      toast({
        title: "Success",
        description: "Feedback status updated",
      })
    } catch (error) {
      console.error("Error updating feedback:", error)
      toast({
        title: "Error",
        description: "Failed to update feedback status",
        variant: "destructive",
      })
    }
  }

  const departments = ["Computer Engineering"]

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-grey flex items-center justify-center">
        <div className="text-white">Loading admin panel...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-grey py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Admin <span className="text-orange">Panel</span>
          </h1>
          <p className="text-grey">Manage PYQs, users, and platform content</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black border-grey/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-grey text-sm">Total PYQs</p>
                  <p className="text-2xl font-bold text-white">{pyqs.length}</p>
                </div>
                <FileText className="h-8 w-8 text-orange" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border-grey/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-grey text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-white">{users.length}</p>
                </div>
                <Users className="h-8 w-8 text-orange" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border-grey/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-grey text-sm">Premium PYQs</p>
                  <p className="text-2xl font-bold text-white">{pyqs.filter((p) => p.is_premium).length}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-orange" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black border-grey/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-grey text-sm">Pending Feedback</p>
                  <p className="text-2xl font-bold text-white">
                    {feedback.filter((f) => f.status === "pending").length}
                  </p>
                </div>
                <MessageSquare className="h-8 w-8 text-orange" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pyqs" className="space-y-6">
          <TabsList className="bg-black border-grey/20">
            <TabsTrigger value="pyqs" className="data-[state=active]:bg-orange data-[state=active]:text-black">
              Manage PYQs
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-orange data-[state=active]:text-black">
              Users
            </TabsTrigger>
            <TabsTrigger value="feedback" className="data-[state=active]:bg-orange data-[state=active]:text-black">
              Feedback
            </TabsTrigger>
          </TabsList>

          {/* PYQs Management */}
          <TabsContent value="pyqs">
            <Card className="bg-black border-grey/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Manage PYQs</CardTitle>
                    <CardDescription className="text-grey">Add, edit, and delete question papers</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-orange hover:bg-orange/90 text-black">
                        <Plus className="h-4 w-4 mr-2" />
                        Add PYQ
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-black border-grey/20 max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-white">Add New PYQ</DialogTitle>
                        <DialogDescription className="text-grey">
                          Fill in the details to add a new question paper. Paste the Google Drive share link and we'll
                          handle the rest.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title" className="text-white">
                            Title
                          </Label>
                          <Input
                            id="title"
                            value={newPYQ.title}
                            onChange={(e) => setNewPYQ({ ...newPYQ, title: e.target.value })}
                            className="bg-dark-grey border-grey/30 text-white"
                            placeholder="e.g., Data Structures and Algorithms"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject" className="text-white">
                            Subject
                          </Label>
                          <Input
                            id="subject"
                            value={newPYQ.subject}
                            onChange={(e) => setNewPYQ({ ...newPYQ, subject: e.target.value })}
                            className="bg-dark-grey border-grey/30 text-white"
                            placeholder="e.g., DSA"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="department" className="text-white">
                            Department
                          </Label>
                          <Input
                            id="department"
                            value="Computer Engineering"
                            readOnly
                            className="bg-dark-grey border-grey/30 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="semester" className="text-white">
                            Semester
                          </Label>
                          <Select
                            value={newPYQ.semester}
                            onValueChange={(value) => setNewPYQ({ ...newPYQ, semester: value })}
                          >
                            <SelectTrigger className="bg-dark-grey border-grey/30 text-white">
                              <SelectValue placeholder="Select semester" />
                            </SelectTrigger>
                            <SelectContent className="bg-dark-grey border-grey/30">
                              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                                <SelectItem key={sem} value={sem.toString()}>
                                  Semester {sem}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="year" className="text-white">
                            Year
                          </Label>
                          <Input
                            id="year"
                            value={newPYQ.year}
                            onChange={(e) => setNewPYQ({ ...newPYQ, year: e.target.value })}
                            className="bg-dark-grey border-grey/30 text-white"
                            placeholder="e.g., 2023"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={newPYQ.is_premium}
                              onChange={(e) => setNewPYQ({ ...newPYQ, is_premium: e.target.checked })}
                              className="rounded"
                            />
                            <span>Premium Content</span>
                          </Label>
                        </div>
                        <div className="col-span-2 space-y-2">
                          <Label htmlFor="file_url" className="text-white">
                            Google Drive Share Link
                          </Label>
                          <Input
                            id="file_url"
                            value={newPYQ.file_url}
                            onChange={(e) => setNewPYQ({ ...newPYQ, file_url: e.target.value })}
                            className="bg-dark-grey border-grey/30 text-white"
                            placeholder="https://drive.google.com/file/d/FILE_ID/view?usp=sharing"
                          />
                          <p className="text-xs text-grey">
                            Paste the Google Drive share link. We'll automatically generate the download and view URLs.
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={handleAddPYQ}
                        disabled={isAddingPYQ}
                        className="bg-orange hover:bg-orange/90 text-black"
                      >
                        {isAddingPYQ ? "Adding..." : "Add PYQ"}
                      </Button>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pyqs.map((pyq) => (
                    <div key={pyq.id} className="flex items-center justify-between p-4 rounded-lg bg-dark-grey">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="text-white font-medium">{pyq.title}</h4>
                          {pyq.is_premium && (
                            <Badge className="bg-orange/10 text-orange border-orange/20">Premium</Badge>
                          )}
                        </div>
                        <p className="text-grey text-sm">
                          {pyq.department} • Semester {pyq.semester} • {pyq.year}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(pyq.view_url, "_blank")}
                          className="border-blue-500/30 text-blue-400 hover:bg-blue-500 hover:text-white"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(pyq.file_url, "_blank")}
                          className="border-green-500/30 text-green-400 hover:bg-green-500 hover:text-white"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingPYQ(pyq)}
                          className="border-orange/30 text-orange hover:bg-orange hover:text-black"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeletePYQ(pyq.id)}
                          className="border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Management */}
          <TabsContent value="users">
            <Card className="bg-black border-grey/20">
              <CardHeader>
                <CardTitle className="text-white">Users</CardTitle>
                <CardDescription className="text-grey">Manage platform users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 rounded-lg bg-dark-grey">
                      <div>
                        <h4 className="text-white font-medium">{user.name}</h4>
                        <p className="text-grey text-sm">{user.email}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                        {user.is_premium && (
                          <Badge className="bg-orange/10 text-orange border-orange/20">Premium</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feedback Management */}
          <TabsContent value="feedback">
            <Card className="bg-black border-grey/20">
              <CardHeader>
                <CardTitle className="text-white">Feedback</CardTitle>
                <CardDescription className="text-grey">Manage user feedback and requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {feedback.map((item) => (
                    <div key={item.id} className="p-4 rounded-lg bg-dark-grey">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-white font-medium">{item.users?.name}</h4>
                          <p className="text-grey text-sm">{item.users?.email}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="border-grey/30 text-grey">
                            {item.type}
                          </Badge>
                          <Select
                            value={item.status}
                            onValueChange={(value) => handleUpdateFeedbackStatus(item.id, value)}
                          >
                            <SelectTrigger className="w-32 bg-dark-grey border-grey/30 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-dark-grey border-grey/30">
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="reviewed">Reviewed</SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <p className="text-grey">{item.message}</p>
                      <p className="text-grey text-xs mt-2">{new Date(item.created_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit PYQ Dialog */}
        {editingPYQ && (
          <Dialog open={!!editingPYQ} onOpenChange={() => setEditingPYQ(null)}>
            <DialogContent className="bg-black border-grey/20 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">Edit PYQ</DialogTitle>
                <DialogDescription className="text-grey">Update the question paper details</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title" className="text-white">
                    Title
                  </Label>
                  <Input
                    id="edit-title"
                    value={editingPYQ.title}
                    onChange={(e) => setEditingPYQ({ ...editingPYQ, title: e.target.value })}
                    className="bg-dark-grey border-grey/30 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-subject" className="text-white">
                    Subject
                  </Label>
                  <Input
                    id="edit-subject"
                    value={editingPYQ.subject}
                    onChange={(e) => setEditingPYQ({ ...editingPYQ, subject: e.target.value })}
                    className="bg-dark-grey border-grey/30 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-department" className="text-white">
                    Department
                  </Label>
                  <Select
                    value={editingPYQ.department}
                    onValueChange={(value) => setEditingPYQ({ ...editingPYQ, department: value })}
                  >
                    <SelectTrigger className="bg-dark-grey border-grey/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-grey border-grey/30">
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-semester" className="text-white">
                    Semester
                  </Label>
                  <Select
                    value={editingPYQ.semester}
                    onValueChange={(value) => setEditingPYQ({ ...editingPYQ, semester: value })}
                  >
                    <SelectTrigger className="bg-dark-grey border-grey/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-grey border-grey/30">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <SelectItem key={sem} value={sem.toString()}>
                          Semester {sem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-year" className="text-white">
                    Year
                  </Label>
                  <Input
                    id="edit-year"
                    value={editingPYQ.year}
                    onChange={(e) => setEditingPYQ({ ...editingPYQ, year: e.target.value })}
                    className="bg-dark-grey border-grey/30 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingPYQ.is_premium}
                      onChange={(e) => setEditingPYQ({ ...editingPYQ, is_premium: e.target.checked })}
                      className="rounded"
                    />
                    <span>Premium Content</span>
                  </Label>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="edit-file-url" className="text-white">
                    Google Drive Share Link
                  </Label>
                  <Input
                    id="edit-file-url"
                    value={editingPYQ.file_url}
                    onChange={(e) => setEditingPYQ({ ...editingPYQ, file_url: e.target.value })}
                    className="bg-dark-grey border-grey/30 text-white"
                  />
                </div>
              </div>
              <Button onClick={handleUpdatePYQ} className="bg-orange hover:bg-orange/90 text-black">
                Update PYQ
              </Button>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
