'use client';

import React, { useState } from 'react';
import Button from './Button';

function SubscribeCTA() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);

  try {
    const res = await fetch('/api/subscriber', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const result = await res.json();

    if (!res.ok) throw new Error(result.error || 'Subscription failed');

    alert(result.message || 'Subscribed successfully!');
    setEmail('');
  } catch (error) {
    alert(error.message || 'Something went wrong.');
  }

  setSubmitting(false);
};


  return (
    <div id='subcribe' className="text-center max-w-7xl mx-auto p-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-4">Join the Philosophical Journey</h1>
      <p className="mb-6 text-gray-700 text-sm max-w-xl mx-auto">
        Subscribe to receive the latest philosophical poetry, maxims, and essays directly in your inbox. No spam, just thoughtful content.
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto"
      >
        <input
          type="email"
          placeholder="Enter your email address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-grow px-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          disabled={submitting}
        />
        <Button
          type="submit"
          disabled={submitting}
          text={submitting ? 'Submitting...' : 'Subscribe'}
        />
      </form>

      <p className="text-sm text-gray-500 mt-4 max-w-xs mx-auto">
        By subscribing, you agree to receive email communications from us.
      </p>
    </div>
  );
}

export default SubscribeCTA;
