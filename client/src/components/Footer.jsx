import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export class Footer extends Component {
    render() {
        return (
            <footer className="relative bg-white font-sans">
  {/* Background Overlay */}
  <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white/95"></div>

  <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:pt-24">
    {/* Main Footer Content */}
    <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-4 lg:gap-x-8">
      {/* Brand Section */}
      <div className="lg:col-span-1">
        <div className="flex flex-col items-start">
          {/* Logo */}
          <div className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Scep
            </span>
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Hub
            </span>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Design, Code and Ship!
          </p>

          {/* Social Links */}
          <div className="mt-6 flex space-x-6">
            {/* Facebook */}
            <Link className="group transform text-gray-400 transition-colors duration-200 hover:text-blue-500">
              <span className="sr-only">Facebook</span>
              <svg className="h-6 w-6 transition-transform duration-200 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </Link>

            {/* Twitter */}
            <Link className="group text-gray-400 transition-colors duration-200 hover:text-blue-400">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6 transition-transform duration-200 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </Link>

            {/* LinkedIn */}
            <Link className="group text-gray-400 transition-colors duration-200 hover:text-blue-700">
              <span className="sr-only">LinkedIn</span>
              <svg className="h-6 w-6 transition-transform duration-200 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-3">
        {/* About */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
            About
          </h3>
          <ul className="mt-4 space-y-3">
            <li>
              <Link className="text-sm text-gray-500 transition-colors duration-200 hover:text-blue-600">
                Company
              </Link>
            </li>
            <li>
              <Link className="text-sm text-gray-500 transition-colors duration-200 hover:text-blue-600">
                Careers
              </Link>
            </li>
            <li>
              <Link className="text-sm text-gray-500 transition-colors duration-200 hover:text-blue-600">
                Blog
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
            Support
          </h3>
          <ul className="mt-4 space-y-3">
            <li>
              <Link className="text-sm text-gray-500 transition-colors duration-200 hover:text-blue-600">
                Contact Support
              </Link>
            </li>
            <li>
              <Link className="text-sm text-gray-500 transition-colors duration-200 hover:text-blue-600">
                Help Resources
              </Link>
            </li>
            <li>
              <Link className="text-sm text-gray-500 transition-colors duration-200 hover:text-blue-600">
                Release Updates
              </Link>
            </li>
          </ul>
        </div>

        {/* Platform */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
            Platform
          </h3>
          <ul className="mt-4 space-y-3">
            <li>
              <Link className="text-sm text-gray-500 transition-colors duration-200 hover:text-blue-600">
                Terms & Privacy
              </Link>
            </li>
            <li>
              <Link className="text-sm text-gray-500 transition-colors duration-200 hover:text-blue-600">
                Pricing
              </Link>
            </li>
            <li>
              <Link className="text-sm text-gray-500 transition-colors duration-200 hover:text-blue-600">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
            Contact
          </h3>
          <ul className="mt-4 space-y-3">
            <li>
              <Link className="text-sm text-gray-500 transition-colors duration-200 hover:text-blue-600">
                Send a Message
              </Link>
            </li>
            <li>
              <Link className="text-sm text-gray-500 transition-colors duration-200 hover:text-blue-600">
                Request a Quote
              </Link>
            </li>
            <li>
              <Link className="text-sm text-gray-500 transition-colors duration-200 hover:text-blue-600">
                07 0771 1771
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className="mt-12 border-t border-gray-100 pt-8">
      <p className="text-center text-sm text-gray-500">
        © 2024 ScepHub. All rights reserved.
      </p>
    </div>
  </div>
</footer>
        )
    }
}

export default Footer