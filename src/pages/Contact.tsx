import React from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const Contact: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 transition-colors duration-300">
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-lg w-full border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Contact Us</h1>
      <p className="mb-4 text-gray-600 dark:text-gray-300">
        Have questions, feedback, or need support? Reach out to us!
      </p>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1" htmlFor="email">
            Your Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-colors duration-200"
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition-colors duration-200"
            rows={4}
            placeholder="How can we help you?"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-blue-600 hover:to-green-600 transition-colors duration-200"
        >
          Send Message
        </button>
      </form>
      <div className="mt-6 text-sm text-gray-500 dark:text-gray-400 text-center">
        Or email us directly at <a href="mailto:support@healthsync.com" className="text-blue-500 dark:text-blue-400 underline">support@healthsync.com</a>
      </div>
      <div className="mt-8 flex justify-center">
        <Link
          to="/"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
        >
          <Home size={18} />
          <span>Go to Dashboard</span>
        </Link>
      </div>
    </div>
  </div>
);

export default Contact;