'use client'

import React, { useEffect, useState } from 'react'

export default function ContactPage() {
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false)
    }, 1500)
    return () => clearTimeout(timeout)
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess(false)

    try {
      const res = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'your-email@example.com', // replace with your actual recipient
          subject: `Message from ${form.name}`,
          message: form.message + `<br/><br/>Sender: ${form.email}`,
        }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Something went wrong.')

      setSuccess(true)
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white animate-pulse">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-12">
      <div className="text-center space-y-4">
        <p className="uppercase text-sm tracking-widest text-gray-500 font-medium">Contact Me</p>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Let’s Start a Conversation</h1>
        <p className="text-gray-500 text-sm">Get in touch—we’d love to hear from you</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-xl mt-10 space-y-6 text-gray-600">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Your Email"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Message"
          rows={5}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
        ></textarea>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 text-white bg-violet-600 hover:bg-violet-700 transition-all duration-200 rounded-lg font-medium text-base"
        >
          {submitting ? 'Sending...' : 'Send Message'}
        </button>

        {success && <p className="text-green-600 text-sm">Email sent successfully!</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>
    </div>
  )
}
