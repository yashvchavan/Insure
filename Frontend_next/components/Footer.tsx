"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  const socialLinks = [
    { icon: Facebook, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Instagram, href: "#" },
    { icon: Linkedin, href: "#" }
  ]

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "User Dashboard", href: "/user-dashboard" },
    { name: "Claims", href: "/claims" },
    { name: "Document Vault", href: "/vault" },
    { name: "About Us", href: "#" }
  ]

  const insuranceTypes = [
    { name: "Health Insurance", href: "#" },
    { name: "Vehicle Insurance", href: "#" },
    { name: "Life Insurance", href: "#" },
    { name: "Home Insurance", href: "#" },
    { name: "Travel Insurance", href: "#" }
  ]

  const contactInfo = [
    { icon: Phone, text: "+91 9657846967" },
    { icon: Mail, text: "insure@gmail.com" },
    { icon: MapPin, text: "K. K. Wagh Institute of Engineering Education & Research, Nashik, Maharashtra, India" }
  ]

  const legalLinks = [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" }
  ]

  return (
    <footer className="bg-gradient-to-b from-muted/20 to-muted/50 border-t">
      <div className="container py-12 px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link href="/">
              
              <Image
                src="/images/logo.png"
                alt="Insure Logo"
                width={200}
                height={50}
                className="object-contain h-200 w-50"
                priority
              />
          </Link>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-muted-foreground mb-6"
            >
              Your one-stop solution for all insurance needs. We make insurance simple, affordable, and accessible.
            </motion.p>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -3, scale: 1.1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white shadow-sm hover:shadow-primary/30"
                >
                  <social.icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <motion.h3 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-lg font-bold mb-4"
            >
              Quick Links
            </motion.h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link 
                    href={link.href} 
                    className="text-muted-foreground hover:text-primary flex items-center transition-colors duration-200"
                  >
                    <span className="w-2 h-2 bg-primary/50 rounded-full mr-2"></span>
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Insurance Types */}
          <div>
            <motion.h3 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-lg font-bold mb-4"
            >
              Insurance Types
            </motion.h3>
            <ul className="space-y-3">
              {insuranceTypes.map((type, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link 
                    href={type.href} 
                    className="text-muted-foreground hover:text-primary flex items-center transition-colors duration-200"
                  >
                    <span className="w-2 h-2 bg-primary/50 rounded-full mr-2"></span>
                    {type.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <motion.h3 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-lg font-bold mb-4"
            >
              Contact Us
            </motion.h3>
            <ul className="space-y-4">
              {contactInfo.map((info, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start"
                >
                  <info.icon className="h-5 w-5 mr-3 mt-0.5 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{info.text}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border-t border-muted mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {new Date().getFullYear()} InsureEase. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {legalLinks.map((link, index) => (
              <Link 
                key={index}
                href={link.href} 
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  )
}