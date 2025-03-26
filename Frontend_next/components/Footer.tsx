"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-muted/40 border-t">
      <div className="container py-12 px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">InsureEase</h3>
            <p className="text-muted-foreground mb-4">
              Your one-stop solution for all insurance needs. We make insurance simple, affordable, and accessible.
            </p>
            <div className="flex space-x-4">
              <motion.a
                href="#"
                whileHover={{ y: -3 }}
                className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Facebook className="h-4 w-4" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ y: -3 }}
                className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Twitter className="h-4 w-4" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ y: -3 }}
                className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Instagram className="h-4 w-4" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ y: -3 }}
                className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Linkedin className="h-4 w-4" />
              </motion.a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/user-dashboard" className="text-muted-foreground hover:text-primary">
                  User Dashboard
                </Link>
              </li>
              <li>
                <Link href="/claims" className="text-muted-foreground hover:text-primary">
                  Claims
                </Link>
              </li>
              <li>
                <Link href="/vault" className="text-muted-foreground hover:text-primary">
                  Document Vault
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Insurance Types</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  Health Insurance
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  Vehicle Insurance
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  Life Insurance
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  Home Insurance
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  Travel Insurance
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Phone className="h-5 w-5 mr-2 text-primary" />
                <span className="text-muted-foreground">+91 9657846967</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-2 text-primary" />
                <span className="text-muted-foreground">insure@gmail.com</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                <span className="text-muted-foreground">
                  K. K. Wagh Institute of Engineering Education & Research, Nashik, Maharashtra, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">© 2023 Insure. All rights reserved.</p>
          <div className="flex space-x-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

