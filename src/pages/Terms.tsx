import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, AlertCircle, Check, Home } from "lucide-react";
import { Link } from "react-router-dom";

const Terms: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>("acceptance");
  const [hasAccepted, setHasAccepted] = useState(false);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.8,
        when: "beforeChildren",
        staggerChildren: 0.15
      }
    }
  };
  
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const sections = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      content: "By accessing or using HealthSync, you agree to be bound by these terms. If you disagree with any part of the terms, you may not use our service."
    },
    {
      id: "use",
      title: "Use of the App",
      content: (
        <ul className="list-disc ml-6 mb-4">
          <li>You must be at least 13 years old to use HealthSync.</li>
          <li>You are responsible for maintaining the confidentiality of your account.</li>
          <li>Do not use HealthSync for any unlawful or prohibited purpose.</li>
        </ul>
      )
    },
    {
      id: "ip",
      title: "Intellectual Property",
      content: "All content, features, and functionality of HealthSync are the exclusive property of HealthSync and its licensors."
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      content: "HealthSync is provided \"as is\" and \"as available\". We do not warrant that the app will be error-free or uninterrupted. HealthSync is not a substitute for professional medical advice."
    },
    {
      id: "changes",
      title: "Changes to Terms",
      content: "We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting."
    },
    {
      id: "contact",
      title: "Contact Us",
      content: (
        <p className="mb-4">
          If you have any questions about these Terms, please contact us at{" "}
          <motion.a 
            href="mailto:support@healthsync.com" 
            className="text-indigo-500 underline"
            whileHover={{ scale: 1.05 }}
          >
            support@healthsync.com
          </motion.a>
        </p>
      )
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
          variants={sectionVariants}
        >
          <Layers className="text-indigo-600 dark:text-indigo-400 mr-3" size={28} />
          <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">Terms &amp; Conditions</h1>
        </motion.div>
        
        <motion.p 
          className="mb-4"
          variants={sectionVariants}
        >
          <strong>Last updated:</strong> May 2025
        </motion.p>
        
        <motion.div 
          className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg mb-8 flex items-center"
          variants={sectionVariants}
        >
          <AlertCircle className="text-indigo-600 dark:text-indigo-400 mr-2" size={20} />
          <p className="mb-0 text-sm">
            Please read these terms and conditions ("terms", "terms and conditions") carefully before using the HealthSync application.
          </p>
        </motion.div>
        
        <motion.div 
          className="flex flex-col gap-4 mb-8"
          variants={sectionVariants}
        >
          {sections.map((section) => (
            <motion.div 
              key={section.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div 
                className={`p-4 cursor-pointer flex justify-between items-center ${activeSection === section.id ? "bg-indigo-50 dark:bg-indigo-900/30" : "bg-white dark:bg-gray-800"}`}
                onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
              >
                <h2 className="text-xl font-semibold">{section.title}</h2>
                <motion.div
                  animate={{ rotate: activeSection === section.id ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-indigo-500"
                >
                  ▼
                </motion.div>
              </motion.div>
              
              <AnimatePresence>
                {activeSection === section.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-4 py-3 border-t border-gray-200 dark:border-gray-700"
                  >
                    <div className="text-gray-600 dark:text-gray-300">
                      {section.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-8 flex items-center justify-between"
          variants={sectionVariants}
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="accept-terms" 
              className="mr-3 h-5 w-5 text-indigo-600"
              checked={hasAccepted}
              onChange={() => setHasAccepted(!hasAccepted)}
            />
            <label htmlFor="accept-terms" className="text-gray-700 dark:text-gray-300">
              I have read and accept the Terms &amp; Conditions
            </label>
          </div>
          
          <motion.button
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${hasAccepted ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"}`}
            disabled={!hasAccepted}
            whileHover={hasAccepted ? { scale: 1.05 } : {}}
            whileTap={hasAccepted ? { scale: 0.95 } : {}}
          >
            <Check size={18} />
            <span>Accept</span>
          </motion.button>
        </motion.div>
        
        <motion.p 
          className="mt-8 text-sm text-gray-500 dark:text-gray-400"
          variants={sectionVariants}
        >
          © 2025 HealthSync. All rights reserved.
        </motion.p>
        
        <motion.div 
          className="mt-8 flex justify-center"
          variants={sectionVariants}
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

export default Terms;