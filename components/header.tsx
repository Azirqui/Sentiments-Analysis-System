"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Heart } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-darkblue"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            <span className="text-xl font-bold text-darkblue">HeartPredict</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/app/home" className="text-gray-700 hover:text-darkblue font-medium">
              Home
            </Link>
            <Link href="/app/about" className="text-gray-700 hover:text-darkblue font-medium">
              About Us
            </Link>
            <Link href="/app/predict" className="text-gray-700 hover:text-darkblue font-medium">
              Prediction Test
            </Link>
          </nav>

          <div className="hidden md:block">
            <Button className="bg-darkblue hover:bg-opacity-90">
              <Link href="/app/safety-measures" className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>Safety Measures</span>
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-gray-700" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-4">
            <Link href="/" className="block text-gray-700 hover:text-darkblue font-medium" onClick={toggleMenu}>
              Home
            </Link>
            <Link href="/app/about" className="block text-gray-700 hover:text-darkblue font-medium" onClick={toggleMenu}>
              About Us
            </Link>
            <Link href="/app/predict" className="block text-gray-700 hover:text-darkblue font-medium" onClick={toggleMenu}>
              Prediction Test
            </Link>
            <Button className="w-full bg-darkblue hover:bg-opacity-90">
              <Link href="/app/safety-measures" onClick={toggleMenu} className="flex items-center justify-center gap-1">
                <Heart className="h-4 w-4" />
                <span>Safety Measures</span>
              </Link>
            </Button>
          </nav>
        )}
      </div>
    </header>
  )
}
