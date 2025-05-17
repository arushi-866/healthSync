import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Home } from "lucide-react";
import { Link } from "react-router-dom";

const Privacy: React.FC = () => {
  // Track whether sections are expanded
  const [expandedSection, setExpandedSection] = useState<string | null>("information");
  
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

  const listItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

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
          variants={sectionVariants}
          className="flex items-center mb-6"
        >
          <FileText className="text-indigo-600 dark:text-indigo-400 mr-3" size={28} />
          <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">Privacy Policy</h1>
        </motion.div>

        <motion.p 
          className="mb-4"
          variants={sectionVariants}
        >
          <strong>Last updated:</strong> May 2025
        </motion.p>
        
        <motion.p 
          className="mb-4"
          variants={sectionVariants}
        >
          <span className="font-semibold">HealthSync</span> is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our application.
        </motion.p>
        
        <motion.div 
          className="my-8"
          variants={sectionVariants}
        >
          <motion.div
            className="cursor-pointer flex items-center"
            onClick={() => toggleSection("information")}
            whileHover={{ scale: 1.01 }}
          >
            <h2 className="text-xl font-semibold mb-2">Information We Collect</h2>
            <motion.span 
              className="ml-2 text-indigo-500"
              animate={{ rotate: expandedSection === "information" ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              ▼
            </motion.span>
          </motion.div>
          
          <motion.ul 
            className="list-disc ml-6 mb-4"
            animate={{ 
              height: expandedSection === "information" ? "auto" : 0,
              opacity: expandedSection === "information" ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            style={{ overflow: "hidden" }}
          >
            {expandedSection === "information" && (
              <>
                <motion.li variants={listItemVariants}>Personal information you provide (such as your name and email).</motion.li>
                <motion.li variants={listItemVariants}>Health data you enter or sync from devices.</motion.li>
                <motion.li variants={listItemVariants}>Usage data (such as app interactions and preferences).</motion.li>
              </>
            )}
          </motion.ul>
        </motion.div>
        
        <motion.div 
          className="my-8"
          variants={sectionVariants}
        >
          <motion.div
            className="cursor-pointer flex items-center"
            onClick={() => toggleSection("usage")}
            whileHover={{ scale: 1.01 }}
          >
            <h2 className="text-xl font-semibold mb-2">How We Use Your Information</h2>
            <motion.span 
              className="ml-2 text-indigo-500"
              animate={{ rotate: expandedSection === "usage" ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              ▼
            </motion.span>
          </motion.div>
          
          <motion.ul 
            className="list-disc ml-6 mb-4"
            animate={{ 
              height: expandedSection === "usage" ? "auto" : 0,
              opacity: expandedSection === "usage" ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            style={{ overflow: "hidden" }}
          >
            {expandedSection === "usage" && (
              <>
                <motion.li variants={listItemVariants}>To provide and improve HealthSync features.</motion.li>
                <motion.li variants={listItemVariants}>To personalize your experience.</motion.li>
                <motion.li variants={listItemVariants}>To communicate updates and support.</motion.li>
              </>
            )}
          </motion.ul>
        </motion.div>
        
        <motion.div 
          className="my-8"
          variants={sectionVariants}
        >
          <motion.div
            className="cursor-pointer flex items-center"
            onClick={() => toggleSection("security")}
            whileHover={{ scale: 1.01 }}
          >
            <h2 className="text-xl font-semibold mb-2">Data Security</h2>
            <motion.span 
              className="ml-2 text-indigo-500"
              animate={{ rotate: expandedSection === "security" ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              ▼
            </motion.span>
          </motion.div>
          
          <motion.p 
            className="mb-4"
            animate={{ 
              height: expandedSection === "security" ? "auto" : 0,
              opacity: expandedSection === "security" ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            style={{ overflow: "hidden" }}
          >
            {expandedSection === "security" && (
              "We use industry-standard security measures to protect your data. Your health data is stored securely and is never sold to third parties."
            )}
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="my-8"
          variants={sectionVariants}
        >
          <motion.div
            className="cursor-pointer flex items-center"
            onClick={() => toggleSection("choices")}
            whileHover={{ scale: 1.01 }}
          >
            <h2 className="text-xl font-semibold mb-2">Your Choices</h2>
            <motion.span 
              className="ml-2 text-indigo-500"
              animate={{ rotate: expandedSection === "choices" ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              ▼
            </motion.span>
          </motion.div>
          
          <motion.p 
            className="mb-4"
            animate={{ 
              height: expandedSection === "choices" ? "auto" : 0,
              opacity: expandedSection === "choices" ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            style={{ overflow: "hidden" }}
          >
            {expandedSection === "choices" && (
              <>
                You can update or delete your data at any time from your account settings. For any privacy concerns, contact us at <motion.a 
                  href="mailto:support@healthsync.com" 
                  className="text-indigo-500 underline"
                  whileHover={{ scale: 1.05 }}
                >
                  support@healthsync.com
                </motion.a>.
              </>
            )}
          </motion.p>
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

export default Privacy;