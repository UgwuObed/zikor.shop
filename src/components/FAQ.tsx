"use client"

import React, { useState, useEffect } from 'react';
import { BiMinus, BiPlus } from "react-icons/bi";
import { FiMail, FiMessageCircle, FiHelpCircle, FiArrowRight } from "react-icons/fi";

// Mock FAQ data
const faqs = [
  {
    question: "How do I get started with Zikor?",
    answer: "Getting started is easy! Simply sign up for a free account, choose your store name, and start adding products. Our setup wizard will guide you through the process in just a few minutes."
  },
  {
    question: "What payment methods do you support?",
    answer: "We support all major payment methods including credit cards, debit cards, bank transfers, and popular Nigerian payment gateways like Paystack and Flutterwave."
  },
  {
    question: "Can I use my own domain name?",
    answer: "Yes! With our Professional and Enterprise plans, you can connect your own custom domain name to give your store a more professional appearance."
  },
  {
    question: "Is there a transaction fee?",
    answer: "We don't charge any additional transaction fees. You only pay the standard payment processor fees (usually 2-3%) which go directly to the payment gateway."
  },
  {
    question: "How do I manage my inventory?",
    answer: "Our platform includes built-in inventory management tools. You can track stock levels, set low-stock alerts, and manage product variants all from your dashboard."
  },
  {
    question: "Can I migrate from another platform?",
    answer: "Absolutely! We offer migration assistance to help you move your products, customers, and order history from other e-commerce platforms like Shopify, WooCommerce, or others."
  },
  {
    question: "Do you provide customer support?",
    answer: "Yes! We offer 24/7 customer support via email, live chat, and phone. Our Professional and Enterprise plans include priority support with faster response times."
  },
  {
    question: "Can I sell digital products?",
    answer: "Yes, you can sell both physical and digital products on Zikor. Digital products are automatically delivered to customers upon purchase completion."
  }
];

// Custom Disclosure Component
const Disclosure: React.FC<{
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ question, answer, isOpen, onToggle }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
      <button 
        onClick={onToggle}
        className="flex items-center justify-between w-full p-6 text-left hover:bg-gray-50 transition-colors rounded-2xl"
      >
        <span className="text-lg font-semibold text-gray-900 pr-4">
          {question}
        </span>
        
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
          isOpen 
            ? 'bg-purple-500 text-white rotate-180' 
            : 'bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-600'
        }`}>
          {isOpen ? (
            <BiMinus className="w-5 h-5" />
          ) : (
            <BiPlus className="w-5 h-5" />
          )}
        </div>
      </button>
      
      {isOpen && (
        <div className="px-6 pb-6">
          <div className="border-t border-gray-100 pt-4">
            <p className="text-gray-700 leading-relaxed">
              {answer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const FAQ: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('faq');
    if (section) observer.observe(section);
    return () => { if (section) observer.unobserve(section); };
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 md:py-24 px-5 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Left Section */}
          <div className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          }`}>
            <div className="inline-flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full mb-6">
              <FiHelpCircle className="w-4 h-4 text-purple-600" />
              <span className="text-purple-700 font-medium text-sm">FAQ's</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Frequently
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                Asked Questions
              </span>
            </h2>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Get answers to common questions about Zikor.
              <span className="text-purple-600 font-semibold"> Ask us anything!</span>
            </p>

            {/* Contact Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white">
                  <FiMail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Need More Help?</h3>
                  <p className="text-gray-600 text-sm">We're here to assist you</p>
                </div>
              </div>
              
              <a 
                href="mailto:help@zikor.shop" 
                className="flex items-center justify-between w-full p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:scale-105 transition-all duration-200 group"
              >
                <span className="flex items-center gap-2">
                  <FiMessageCircle className="w-5 h-5" />
                  help@zikor.shop
                </span>
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* FAQ Section */}
          <div className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index}
                  className={`transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <Disclosure
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openIndex === index}
                    onToggle={() => toggleFAQ(index)}
                  />
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className={`mt-12 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '800ms' }}>
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center">
                <h3 className="text-2xl font-bold mb-4">
                  Still have questions?
                </h3>
                
                <p className="text-purple-100 mb-6">
                  Our team is here to help you succeed. Reach out anytime!
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="mailto:help@zikor.shop"
                    className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-200 flex items-center gap-2 justify-center"
                  >
                    <FiMail className="w-5 h-5" />
                    Contact Support
                  </a>
                  
                  <button className="border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-purple-600 transition-all duration-200 flex items-center gap-2 justify-center">
                    <FiMessageCircle className="w-5 h-5" />
                    Live Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;