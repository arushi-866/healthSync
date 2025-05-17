import React from "react";

const Terms: React.FC = () => (
  <div className="max-w-3xl mx-auto px-4 py-12 text-gray-800 dark:text-gray-100">
    <h1 className="text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400">Terms &amp; Conditions</h1>
    <p className="mb-4">
      <strong>Last updated:</strong> May 2025
    </p>
    <p className="mb-4">
      Please read these terms and conditions ("terms", "terms and conditions") carefully before using the HealthSync application.
    </p>
    <h2 className="text-xl font-semibold mt-8 mb-2">Acceptance of Terms</h2>
    <p className="mb-4">
      By accessing or using HealthSync, you agree to be bound by these terms. If you disagree with any part of the terms, you may not use our service.
    </p>
    <h2 className="text-xl font-semibold mt-8 mb-2">Use of the App</h2>
    <ul className="list-disc ml-6 mb-4">
      <li>You must be at least 13 years old to use HealthSync.</li>
      <li>You are responsible for maintaining the confidentiality of your account.</li>
      <li>Do not use HealthSync for any unlawful or prohibited purpose.</li>
    </ul>
    <h2 className="text-xl font-semibold mt-8 mb-2">Intellectual Property</h2>
    <p className="mb-4">
      All content, features, and functionality of HealthSync are the exclusive property of HealthSync and its licensors.
    </p>
    <h2 className="text-xl font-semibold mt-8 mb-2">Limitation of Liability</h2>
    <p className="mb-4">
      HealthSync is provided "as is" and "as available". We do not warrant that the app will be error-free or uninterrupted. HealthSync is not a substitute for professional medical advice.
    </p>
    <h2 className="text-xl font-semibold mt-8 mb-2">Changes to Terms</h2>
    <p className="mb-4">
      We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting.
    </p>
    <h2 className="text-xl font-semibold mt-8 mb-2">Contact Us</h2>
    <p className="mb-4">
      If you have any questions about these Terms, please contact us at <a href="mailto:support@healthsync.com" className="text-indigo-500 underline">support@healthsync.com</a>.
    </p>
    <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
      © 2025 HealthSync. All rights reserved.
    </p>
  </div>
);

export default Terms;