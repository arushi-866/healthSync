import React from "react";

const Privacy: React.FC = () => (
  <div className="max-w-3xl mx-auto px-4 py-12 text-gray-800 dark:text-gray-100">
    <h1 className="text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">Privacy Policy</h1>
    <p className="mb-4">
      <strong>Last updated:</strong> May 2025
    </p>
    <p className="mb-4">
      <span className="font-semibold">HealthSync</span> is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our application.
    </p>
    <h2 className="text-xl font-semibold mt-8 mb-2">Information We Collect</h2>
    <ul className="list-disc ml-6 mb-4">
      <li>Personal information you provide (such as your name and email).</li>
      <li>Health data you enter or sync from devices.</li>
      <li>Usage data (such as app interactions and preferences).</li>
    </ul>
    <h2 className="text-xl font-semibold mt-8 mb-2">How We Use Your Information</h2>
    <ul className="list-disc ml-6 mb-4">
      <li>To provide and improve HealthSync features.</li>
      <li>To personalize your experience.</li>
      <li>To communicate updates and support.</li>
    </ul>
    <h2 className="text-xl font-semibold mt-8 mb-2">Data Security</h2>
    <p className="mb-4">
      We use industry-standard security measures to protect your data. Your health data is stored securely and is never sold to third parties.
    </p>
    <h2 className="text-xl font-semibold mt-8 mb-2">Your Choices</h2>
    <p className="mb-4">
      You can update or delete your data at any time from your account settings. For any privacy concerns, contact us at <a href="mailto:support@healthsync.com" className="text-indigo-500 underline">support@healthsync.com</a>.
    </p>
    <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
      © 2025 HealthSync. All rights reserved.
    </p>
  </div>
);

export default Privacy;