export default function Loading() {
  return (
    <div className="min-h-screen bg-dark-grey flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange mx-auto mb-4"></div>
        <p className="text-white">Loading...</p>
      </div>
    </div>
  )
}
