import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, Mail, Home } from "lucide-react";
import { Link } from "react-router-dom";

const Support: React.FC = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  
  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackSubmitted(false);
      setShowFeedbackForm(false);
    }, 2000);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const faqItems = [
    {
      question: "How do I reset my password?",
      answer: "Go to your account settings and click \"Reset Password\"."
    },
    {
      question: "How do I delete my account?",
      answer: "Contact support and we will assist you with account deletion."
    },
    {
      question: "How is my health data used?",
      answer: <>See our <motion.a href="/privacy" className="underline text-indigo-500" whileHover={{ scale: 1.05 }}>Privacy Policy</motion.a> for details.</>
    }
  ];

  return (
    <motion.div 
      className="max-w-3xl mx-auto px-4 py-12 text-gray-800 dark:text-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="flex items-center mb-6"
          variants={itemVariants}
        >
          <HelpCircle className="text-indigo-600 dark:text-indigo-400 mr-3" size={28} />
          <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">Support</h1>
        </motion.div>
        
        <motion.p 
          className="mb-4"
          variants={itemVariants}
        >
          Need help or have questions about HealthSync? We're here for you!
        </motion.p>
        
        <motion.div 
          className="mt-8 mb-8"
          variants={itemVariants}
        >
          <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
          <motion.div 
            className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg flex items-center"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <Mail className="text-indigo-600 dark:text-indigo-400 mr-3" size={24} />
            <p className="mb-0">
              You can reach our support team at
              <motion.a 
                href="mailto:support@healthsync.com" 
                className="text-indigo-500 underline ml-1"
                whileHover={{ color: "#6366f1" }}
              >
                support@healthsync.com
              </motion.a>
            </p>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="mt-12 mb-8"
          variants={itemVariants}
        >
          <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
          <motion.div 
            className="space-y-4"
            variants={containerVariants}
          >
            {faqItems.map((faq, index) => (
              <motion.div 
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
              >
                <motion.div 
                  className="p-4 flex justify-between items-center cursor-pointer"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <h3 className="font-medium">{faq.question}</h3>
                  <motion.div
                    animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-indigo-500"
                  >
                    ▼
                  </motion.div>
                </motion.div>
                
                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-4 pb-4 text-gray-600 dark:text-gray-400"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="mt-12 mb-8"
          variants={itemVariants}
        >
          <h2 className="text-xl font-semibold mb-4">Feedback</h2>
          <p className="mb-4">
            We value your feedback! Let us know how we can improve HealthSync.
          </p>
          
          {!showFeedbackForm && !feedbackSubmitted && (
            <motion.button
              className="bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800 text-indigo-700 dark:text-indigo-300 font-medium py-2 px-4 rounded-lg transition-all duration-300"
              onClick={() => setShowFeedbackForm(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Share Feedback
            </motion.button>
          )}
          
          <AnimatePresence>
            {showFeedbackForm && !feedbackSubmitted && (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mt-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"
                onSubmit={handleFeedbackSubmit}
              >
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Your Feedback</label>
                  <textarea 
                    className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows={4}
                    placeholder="How can we improve HealthSync?"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <motion.button
                    type="button"
                    className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-1 px-3 rounded transition-all duration-300"
                    onClick={() => setShowFeedbackForm(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-3 rounded transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Submit
                  </motion.button>
                </div>
              </motion.form>
            )}
            
            {feedbackSubmitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mt-4 bg-green-100 dark:bg-green-900 p-4 rounded text-center"
              >
                <p className="text-green-800 dark:text-green-300">Thank you for your feedback!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        <motion.p 
          className="mt-8 text-sm text-gray-500 dark:text-gray-400"
          variants={itemVariants}
        >
          © 2025 HealthSync. All rights reserved.
        </motion.p>
        
        <motion.div 
          className="mt-8 flex justify-center"
          variants={itemVariants}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
            >
              <Home size={18} />
              <span>Go to Dashboard</span>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Support;