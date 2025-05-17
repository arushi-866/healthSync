import React from "react";

const Support: React.FC = () => (
  <div className="max-w-3xl mx-auto px-4 py-12 text-gray-800 dark:text-gray-100">
    <h1 className="text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">Support</h1>
    <p className="mb-4">
      Need help or have questions about HealthSync? We're here for you!
    </p>
    <h2 className="text-xl font-semibold mt-8 mb-2">Contact Us</h2>
    <p className="mb-4">
      You can reach our support team at
      <a href="mailto:support@healthsync.com" className="text-indigo-500 underline ml-1">support@healthsync.com</a>.
    </p>
    <h2 className="text-xl font-semibold mt-8 mb-2">Frequently Asked Questions</h2>
    <ul className="list-disc ml-6 mb-4">
      <li>How do I reset my password? <br /><span className="text-gray-600 dark:text-gray-400">Go to your account settings and click "Reset Password".</span></li>
      <li>How do I delete my account? <br /><span className="text-gray-600 dark:text-gray-400">Contact support and we will assist you with account deletion.</span></li>
      <li>How is my health data used? <br /><span className="text-gray-600 dark:text-gray-400">See our <a href="/privacy" className="underline text-indigo-500">Privacy Policy</a> for details.</span></li>
    </ul>
    <h2 className="text-xl font-semibold mt-8 mb-2">Feedback</h2>
    <p className="mb-4">
      We value your feedback! Let us know how we can improve HealthSync.
    </p>
    <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
      © 2025 HealthSync. All rights reserved.
    </p>
  </div>
);

export default Support;