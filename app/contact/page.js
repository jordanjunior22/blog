'use client'
import React, { useEffect, useState } from 'react'

export default function ContactPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false)
    }, 1500) // simulate 1.5s loading
    return () => clearTimeout(timeout)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-12 animate-pulse">
        <div className="space-y-4 w-full max-w-xl">
          <div className="h-4 w-24 bg-gray-300 rounded-md"></div>
          <div className="h-8 w-3/4 bg-gray-300 rounded-md"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded-md"></div>

          <div className="mt-8 space-y-6">
            <div className="h-12 bg-gray-300 rounded-md w-full"></div>
            <div className="h-12 bg-gray-300 rounded-md w-full"></div>
            <div className="h-32 bg-gray-300 rounded-md w-full"></div>
            <div className="h-12 bg-gray-300 rounded-md w-full"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-12">
      <div className="text-center space-y-4">
        <p className="uppercase text-sm tracking-widest text-gray-500 font-medium">Contact Me</p>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Let’s Start a Conversation</h1>
        <p className="text-gray-500 text-sm">Get in touch we’d love to hear from you</p>
      </div>

      <form className="w-full max-w-xl mt-10 space-y-6">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <textarea
          placeholder="Message"
          rows={5}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
        ></textarea>

        <button
          type="submit"
          className="w-full py-3 text-white bg-violet-600 hover:bg-violet-700 transition-all duration-200 rounded-lg font-medium text-base"
        >
          Send Message
        </button>
      </form>
    </div>
  )
}
