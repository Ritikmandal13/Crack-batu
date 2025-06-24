"use client"

import { useState, useEffect } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

interface PDFViewerProps {
  fileUrl: string
  title: string
  isOpen: boolean
  onClose: () => void
  onDownload: () => void
}

export function PDFViewer({ fileUrl, title, isOpen, onClose, onDownload }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const { toast } = useToast()

  // Convert Google Drive share URL to direct download URL
  const getDirectPDFUrl = (driveUrl: string) => {
    if (driveUrl.includes("drive.google.com")) {
      const fileId = driveUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1]
      if (fileId) {
        return `https://drive.google.com/uc?export=download&id=${fileId}`
      }
    }
    return driveUrl
  }

  const directUrl = getDirectPDFUrl(fileUrl)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setLoading(false)
  }

  function onDocumentLoadError(error: Error) {
    console.error("PDF load error:", error)
    setError("Failed to load PDF. Please try again later.")
    setLoading(false)
    toast({
      title: "Error",
      description: "Failed to load PDF document",
      variant: "destructive",
    })
  }

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1))
  }

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages))
  }

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 3.0))
  }

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5))
  }

  const resetZoom = () => {
    setScale(1.0)
  }

  useEffect(() => {
    if (isOpen) {
      setPageNumber(1)
      setScale(1.0)
      setLoading(true)
      setError("")
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] bg-black border-grey/20 p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white text-lg font-semibold truncate">{title}</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-grey hover:text-orange">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="text-grey">Preview and interact with the PDF document.</DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Controls */}
          <div className="flex items-center justify-between p-4 border-b border-grey/20">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPrevPage}
                disabled={pageNumber <= 1}
                className="border-grey/30 text-grey hover:text-orange"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-white text-sm">
                Page {pageNumber} of {numPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={pageNumber >= numPages}
                className="border-grey/30 text-grey hover:text-orange"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={zoomOut}
                disabled={scale <= 0.5}
                className="border-grey/30 text-grey hover:text-orange"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetZoom}
                className="border-grey/30 text-grey hover:text-orange"
              >
                {Math.round(scale * 100)}%
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={zoomIn}
                disabled={scale >= 3.0}
                className="border-grey/30 text-grey hover:text-orange"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button onClick={onDownload} size="sm" className="bg-orange hover:bg-orange/90 text-black ml-4">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>

          {/* PDF Content */}
          <div className="flex-1 overflow-auto bg-grey/10 flex items-center justify-center p-4">
            {loading && (
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange mx-auto mb-4"></div>
                Loading PDF...
              </div>
            )}

            {error && (
              <div className="text-center">
                <p className="text-red-400 mb-4">{error}</p>
                <Button
                  onClick={() => {
                    setError("")
                    setLoading(true)
                  }}
                  className="bg-orange hover:bg-orange/90 text-black"
                >
                  Retry
                </Button>
              </div>
            )}

            {!loading && !error && (
              <div className="relative">
                <Document
                  file={directUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  loading={
                    <div className="text-white text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange mx-auto mb-4"></div>
                      Loading PDF...
                    </div>
                  }
                >
                  <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className="shadow-lg"
                  />
                </Document>

                {/* Watermark overlay */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-orange px-3 py-1 rounded text-sm font-semibold pointer-events-none">
                  Crack BATU
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
