'use client';
import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-gray-800 text-sm dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4">Last updated: 2025-06-23</p>

      <p className="mb-6">
        Welcome to Chest of Contemplation ("we", "our", "us"). Your privacy is important to us. This Privacy Policy
        explains how we collect, use, and protect your information when you visit our blog at http://chestofcontemplation.com
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">1. Information We Collect</h2>
      <p className="mb-4">We may collect the following types of information:</p>
      <ul className="list-disc ml-6 mb-4">
        <li>Personal information (name, email, etc.) when you comment, contact us, or subscribe.</li>
        <li>Usage data such as pages visited, time spent, IP address, and browser info.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">2. Cookies and Tracking</h2>
      <p className="mb-4">
        We use cookies and similar technologies to enhance your experience. You can manage your cookie
        preferences through your browser settings.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">3. Third-Party Services</h2>
      <p className="mb-4">
        We may use services like Google Analytics, newsletter providers, or comment platforms. These services
        may collect data independently. Please review their privacy policies.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">4. How We Use Your Data</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>To improve our site</li>
        <li>Respond to user inquiries</li>
        <li>Send updates or newsletters (if subscribed)</li>
        <li>Protect against misuse or fraud</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">5. Your Rights</h2>
      <p className="mb-4">
        You have the right to access, update, or delete your personal data. You may also unsubscribe from any
        communication at any time.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">6. Data Retention</h2>
      <p className="mb-4">We retain data only as long as necessary for the purposes outlined in this policy.</p>

      <h2 className="text-xl font-semibold mt-8 mb-2">7. Children's Privacy</h2>
      <p className="mb-4">
        Our content is not intended for children under 13. We do not knowingly collect personal information
        from minors.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">8. Changes to This Policy</h2>
      <p className="mb-4">
        We may update this Privacy Policy periodically. Please review it regularly for updates.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">9. Contact Us</h2>
      <p className="mb-4">
        If you have any questions about this Privacy Policy, contact us at:{' '}
        <strong>http://chestofcontemplation.com</strong>
      </p>
    </div>
  );
};

export default PrivacyPolicyPage;
