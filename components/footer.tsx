import Link from "next/link"
import { Mail, MessageSquare, Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-black border-t border-grey/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-bold text-white mb-4">
              Crack <span className="text-orange">BATU</span>
            </div>
            <p className="text-grey mb-4 max-w-md">
              Your ultimate destination for Dr. Babasaheb Ambedkar Technological University previous years' question
              papers. Join thousands of students in their exam preparation journey.
            </p>
            <div className="flex space-x-4">
              <Link href="mailto:support@crackbatu.com" className="text-grey hover:text-orange transition-colors">
                <Mail className="h-5 w-5" />
              </Link>
              <Link href="/feedback" className="text-grey hover:text-orange transition-colors">
                <MessageSquare className="h-5 w-5" />
              </Link>
              <Link href="https://github.com" className="text-grey hover:text-orange transition-colors">
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/free-pyqs" className="text-grey hover:text-orange transition-colors">
                  Free PYQs
                </Link>
              </li>
              <li>
                <Link href="/premium" className="text-grey hover:text-orange transition-colors">
                  Premium Access
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-grey hover:text-orange transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="text-grey hover:text-orange transition-colors">
                  Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-grey hover:text-orange transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-grey hover:text-orange transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-grey hover:text-orange transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-grey hover:text-orange transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-grey/20 mt-8 pt-8 text-center">
          <p className="text-grey">© 2024 Crack BATU. All rights reserved. Made with ❤️ for BATU students.</p>
        </div>
      </div>
    </footer>
  )
}
