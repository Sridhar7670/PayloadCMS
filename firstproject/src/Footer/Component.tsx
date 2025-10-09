import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa'
import type { Footer } from '@/payload-types'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'


const icons: Record<string, string> = {
    facebook: '🌐',
    twitter: '🐦',
    instagram: '📸',
    linkedin: '💼',
    github: '💻',
  }
// Simple component to render social icons
const SocialIcon = ({ iconName }: { iconName: string }) => {


  return (
    <span className="text-lg">
      {icons[iconName.toLowerCase()] || iconName.charAt(0)}
    </span>
  )
}

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()
  
  const navItems = footerData?.navItems || []
  const socialLinks = footerData?.socialLinks || []

  return (
    <footer className="mt-auto border-t border-border bg-black dark:bg-card text-white">
      <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
        {/* Left Side */}
        <Link className="flex items-center" href="/">
          <Logo />
        </Link>

        {/* Right Side */}
        <div className="flex flex-col items-start gap-4 md:items-end">
          {/* Theme + Nav */}
          <div className="flex flex-col-reverse md:flex-row gap-4 md:items-center">
            <ThemeSelector />
            <nav className="flex flex-col md:flex-row gap-4">
              {navItems.map(({ link }, i) => (
                <CMSLink className="text-white hover:underline" key={i} {...link} />
              ))}
            </nav>
          </div>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex gap-4 mt-4">
              {socialLinks.map((item:any, i:number) => (
                <Link
                  key={i}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <SocialIcon iconName={item.icon} />
                  <span className="text-sm capitalize">{item.icon}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
