import { ReactNode } from 'react'
import Navbar from './Navbar'
import backgroundImage from '../assets/slam-dunk-background.jpg' // Import your image

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div 
      className="min-h-screen bg-no-repeat bg-cover bg-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="min-h-screen bg-white/80"> {/* This adds a semi-transparent white overlay */}
        <Navbar />
        <main className="container mx-auto p-4">
          {children}
        </main>
      </div>
    </div>
  )
}