"use client"

import React, { useState, useEffect } from 'react';
import { FiCheck, FiStar, FiArrowRight, FiTrendingUp, FiZap, FiDollarSign } from 'react-icons/fi';
import { BsCheckCircleFill } from "react-icons/bs";

// Types
interface IPricing {
  name: string;
  price: number | string;
  yearlyPrice?: number;
  features: string[];
  popular?: boolean;
}

// Mock pricing data
const pricingTiers: IPricing[] = [
  {
    name: "Starter",
    price: 0,
    features: [
      "Up to 10 products",
      "Basic analytics", 
      "SSL certificate",
      "Email support",
      "Mobile responsive"
    ],
    popular: false
  },
  {
    name: "Professional",
    price: 29000,
    yearlyPrice: 290000,
    features: [
      "Unlimited products",
      "Advanced analytics",
      "Priority support",
      "Custom domain",
      "SEO optimization",
      "Payment processing",
      "Inventory management"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: 99000,
    yearlyPrice: 990000,
    features: [
      "Everything in Professional",
      "White-label solution",
      "API access",
      "Dedicated support",
      "Custom integrations",
      "Advanced reporting",
      "Multi-store management"
    ],
    popular: false
  }
];

// PricingColumn Component
const PricingColumn: React.FC<{
  tier: IPricing;
  isVisible?: boolean;
  animationDelay?: number;
}> = ({ tier, isVisible = false, animationDelay = 0 }) => {
  const { name, price, features, popular } = tier;
  const isFree = typeof price === 'number' && price === 0;

  const formatPrice = (price: number | string) => {
    if (typeof price === 'number') {
      if (price === 0) return 'Free';
      return `₦${price.toLocaleString()}`;
    }
    return price;
  };

  const getPlanIcon = () => {
    if (isFree) return <FiStar className="w-5 h-5" />;
    if (popular) return <FiZap className="w-5 h-5" />;
    return <FiTrendingUp className="w-5 h-5" />;
  };

  const getCardStyles = () => {
    if (popular) return {
      gradient: 'from-purple-500 to-pink-500',
      border: 'border-purple-200',
      shadow: 'shadow-purple-500/20'
    };
    if (isFree) return {
      gradient: 'from-gray-500 to-gray-600', 
      border: 'border-gray-200',
      shadow: 'shadow-gray-500/20'
    };
    return {
      gradient: 'from-blue-500 to-indigo-500',
      border: 'border-blue-200', 
      shadow: 'shadow-blue-500/20'
    };
  };

  const cardStyles = getCardStyles();

  return (
    <div
      className={`relative transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${popular ? 'scale-105 z-10' : 'z-0'}`}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Popular badge */}
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className={`bg-gradient-to-r ${cardStyles.gradient} text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg`}>
            <span className="flex items-center gap-2">
              <FiStar className="w-4 h-4" />
              Most Popular
            </span>
          </div>
        </div>
      )}

      {/* Main card */}
      <div className={`relative bg-white rounded-2xl border-2 ${cardStyles.border} ${popular ? 'shadow-2xl' : 'shadow-lg hover:shadow-xl'} ${cardStyles.shadow} transition-all duration-300 hover:scale-105 overflow-hidden h-full`}>
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 bg-gradient-to-r ${cardStyles.gradient} rounded-xl flex items-center justify-center text-white shadow-lg`}>
              {getPlanIcon()}
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{name}</h3>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline gap-1">
              <span className={`text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${cardStyles.gradient}`}>
                {formatPrice(price)}
              </span>
              {typeof price === 'number' && price > 0 && (
                <span className="text-lg text-gray-600">/month</span>
              )}
            </div>
            
            {typeof price === 'number' && price > 0 && typeof tier.yearlyPrice === 'number' && (
              <p className="text-sm text-gray-500 mt-1">
                Save ₦{((price * 12) - tier.yearlyPrice).toLocaleString()} annually
              </p>
            )}
          </div>

          <button className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
            popular 
              ? `bg-gradient-to-r ${cardStyles.gradient} text-white hover:shadow-lg hover:scale-105` 
              : `border-2 ${cardStyles.border} text-gray-900 hover:bg-gradient-to-r hover:${cardStyles.gradient} hover:text-white hover:border-transparent`
          }`}>
            <span className="flex items-center justify-center gap-2">
              {isFree ? 'Get Started Free' : 'Choose Plan'}
              <FiArrowRight className="w-5 h-5" />
            </span>
          </button>
        </div>

        {/* Features */}
        <div className="p-6">
          <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-4">What's Included</h4>
          
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <BsCheckCircleFill className={`w-5 h-5 mt-0.5 text-${popular ? 'purple' : isFree ? 'gray' : 'blue'}-500 flex-shrink-0`} />
                <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>

          {popular && (
            <div className="mt-6 p-3 bg-purple-50 rounded-xl border border-purple-200">
              <div className="flex items-center gap-2 text-purple-700">
                <FiZap className="w-4 h-4" />
                <span className="text-sm font-semibold">Recommended for most businesses</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main PricingSection Component
const PricingSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('pricing');
    if (section) observer.observe(section);
    return () => { if (section) observer.unobserve(section); };
  }, []);

  return (
    <section id="pricing" className="py-16 md:py-24 px-5 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full mb-6">
            <FiDollarSign className="w-4 h-4 text-purple-600" />
            <span className="text-purple-700 font-medium text-sm">Simple Pricing</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Choose Your
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Perfect Plan
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Start free, scale as you grow. No hidden fees, 
            <span className="text-purple-600 font-semibold"> cancel anytime</span>
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-4 bg-white border border-gray-200 p-1 rounded-xl shadow-sm">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                billingCycle === 'monthly'
                  ? 'bg-purple-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-lg font-medium text-sm transition-all duration-200 relative ${
                billingCycle === 'yearly'
                  ? 'bg-purple-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                Save 15%
              </span>
            </button>
          </div>
        </div>
        
        {/* Pricing Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {pricingTiers.map((tier, index) => (
            <PricingColumn
              key={tier.name}
              tier={tier}
              isVisible={isVisible}
              animationDelay={index * 200}
            />
          ))}
        </div>

        {/* Features Comparison */}
        <div className={`transition-all duration-1000 mb-16 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                What's Included
              </h3>
              <p className="text-lg text-gray-600">
                All plans include essential e-commerce features
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: <FiCheck className="w-5 h-5" />, title: 'SSL Security', desc: 'Bank-level encryption' },
                { icon: <FiStar className="w-5 h-5" />, title: '24/7 Support', desc: 'Expert help anytime' },
                { icon: <FiTrendingUp className="w-5 h-5" />, title: 'Analytics', desc: 'Track your growth' },
                { icon: <FiDollarSign className="w-5 h-5" />, title: 'Payment Processing', desc: 'Accept payments globally' },
                { icon: <FiArrowRight className="w-5 h-5" />, title: 'Easy Setup', desc: 'Launch in minutes' },
                { icon: <FiZap className="w-5 h-5" />, title: 'Mobile Optimized', desc: 'Perfect on all devices' },
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                    <p className="text-gray-600 text-sm">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className={`text-center transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Start Your Free Trial Today
            </h3>
            <p className="text-lg text-purple-100 mb-6 max-w-2xl mx-auto">
              Join thousands of successful entrepreneurs. No credit card required.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-purple-600 px-8 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-200 shadow-lg">
                <span className="flex items-center gap-2">
                  Start Free Trial
                  <FiArrowRight className="w-5 h-5" />
                </span>
              </button>
              
              <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-purple-600 transition-all duration-200">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;