import { PDFDocument, rgb, StandardFonts } from "pdf-lib"

export async function addWatermarkToPDF(pdfUrl: string, watermarkText = "Crack BATU"): Promise<Blob> {
  try {
    // Fetch the PDF
    const response = await fetch(pdfUrl)
    if (!response.ok) {
      throw new Error("Failed to fetch PDF")
    }

    const pdfBytes = await response.arrayBuffer()

    // Load the PDF
    const pdfDoc = await PDFDocument.load(pdfBytes)

    // Get font
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    // Get all pages
    const pages = pdfDoc.getPages()

    // Add watermark to each page
    pages.forEach((page) => {
      const { width, height } = page.getSize()

      // Add watermark in bottom-right corner
      page.drawText(watermarkText, {
        x: width - 120,
        y: 20,
        size: 12,
        font: font,
        color: rgb(1, 0.5, 0), // Orange color
        opacity: 0.7,
      })

      // Add subtle background watermark in center
      page.drawText(watermarkText, {
        x: width / 2 - 50,
        y: height / 2,
        size: 48,
        font: font,
        color: rgb(0.9, 0.9, 0.9), // Light gray
        opacity: 0.1,
        rotate: { angle: Math.PI / 4, x: width / 2, y: height / 2 }, // 45 degree rotation
      })
    })

    // Save the PDF
    const watermarkedPdfBytes = await pdfDoc.save()

    // Return as blob
    return new Blob([watermarkedPdfBytes], { type: "application/pdf" })
  } catch (error) {
    console.error("Error adding watermark to PDF:", error)
    throw error
  }
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Convert Google Drive share URL to direct download URL
export function getDirectPDFUrl(driveUrl: string): string {
  if (driveUrl.includes("drive.google.com")) {
    const fileId = driveUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1]
    if (fileId) {
      return `https://drive.google.com/uc?export=download&id=${fileId}`
    }
  }
  return driveUrl
}

// Get Google Drive file ID from URL
export function getGoogleDriveFileId(url: string): string | null {
  const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/)
  return match ? match[1] : null
}

// Convert Google Drive URL to embeddable URL
export function getGoogleDriveEmbedUrl(driveUrl: string): string {
  const fileId = getGoogleDriveFileId(driveUrl)
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/preview`
  }
  return driveUrl
}
