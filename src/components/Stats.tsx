"use client"

import React, { useState, useEffect } from 'react';
import { BsShop, BsFillStarFill } from "react-icons/bs";
import { FiGlobe, FiTrendingUp, FiUsers, FiAward } from "react-icons/fi";

// Mock stats data
const stats = [
  {
    title: "Active Stores",
    value: 10000,
    suffix: "+",
    decimal: false,
    description: "Businesses growing with Zikor",
    icon: <BsShop className="w-8 h-8" />,
    color: "blue"
  },
  {
    title: "Rating",
    value: 4.9,
    suffix: "",
    decimal: true,
    description: "Average customer satisfaction",
    icon: <BsFillStarFill className="w-8 h-8" />,
    color: "yellow"
  },
  {
    title: "Countries",
    value: 50,
    suffix: "+",
    decimal: false,
    description: "Countries served worldwide",
    icon: <FiGlobe className="w-8 h-8" />,
    color: "green"
  }
];

// Counter Component with smooth animation
const Counter: React.FC<{
  end: number;
  duration: number;
  isVisible: boolean;
  suffix?: string;
  decimal?: boolean;
}> = ({ end, duration, isVisible, suffix = "", decimal = false }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!isVisible) return;
    
    let startTime: number;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Smooth easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = end * easeOutQuart;
      
      setCount(currentCount);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isVisible]);
  
  const formatNumber = (num: number) => {
    if (decimal) {
      return num.toFixed(1);
    }
    return Math.floor(num).toLocaleString();
  };
  
  return <span>{formatNumber(count)}{suffix}</span>;
};

// Floating particles component
const FloatingParticles: React.FC = () => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    left: number;
    top: number;
    delay: number;
    duration: number;
    size: number;
  }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 4,
      size: 2 + Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-float"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

const Stats: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const section = document.getElementById('stats');
    if (section) observer.observe(section);
    return () => { if (section) observer.unobserve(section); };
  }, []);

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          gradient: 'from-blue-500 to-purple-600',
          bg: 'bg-blue-500',
          text: 'text-blue-600',
          glow: 'shadow-blue-500/25'
        };
      case 'yellow':
        return {
          gradient: 'from-yellow-400 to-orange-500',
          bg: 'bg-yellow-500',
          text: 'text-yellow-600',
          glow: 'shadow-yellow-500/25'
        };
      case 'green':
        return {
          gradient: 'from-green-500 to-emerald-600',
          bg: 'bg-green-500',
          text: 'text-green-600',
          glow: 'shadow-green-500/25'
        };
      default:
        return {
          gradient: 'from-gray-500 to-gray-600',
          bg: 'bg-gray-500',
          text: 'text-gray-600',
          glow: 'shadow-gray-500/25'
        };
    }
  };

  return (
    <section 
      id="stats" 
      className="relative py-20 px-5 bg-gradient-to-b from-white via-blue-50/30 to-purple-50/20 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-blue-300/20 to-purple-300/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-yellow-300/20 to-orange-300/20 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '4s' }}></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f608_1px,transparent_1px),linear-gradient(to_bottom,#3b82f608_1px,transparent_1px)] bg-[size:50px_50px] opacity-30"></div>
      </div>

      {/* Floating particles */}
      <FloatingParticles />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full mb-6">
            <FiTrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 font-medium text-sm">Our Impact</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Trusted by
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Thousands Worldwide
            </span>
          </h2>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join a growing community of entrepreneurs who have transformed their businesses with Zikor
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => {
            const colors = getColorClasses(stat.color);
            const isHovered = hoveredIndex === index;
            
            return (
              <div 
                key={index}
                className={`relative group transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Main Card */}
                <div className={`relative bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl ${colors.glow} transition-all duration-500 p-8 text-center group-hover:scale-105 overflow-hidden`}>
                  
                  {/* Top accent */}
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${colors.gradient} rounded-t-2xl`}></div>
                  
                  {/* Icon */}
                  <div className="relative mb-6">
                    <div className={`w-16 h-16 mx-auto bg-gradient-to-r ${colors.gradient} rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 ${
                      isHovered ? 'scale-110 rotate-3' : 'scale-100 rotate-0'
                    }`}>
                      <div className="text-white transition-transform duration-500">
                        {stat.icon}
                      </div>
                    </div>
                    
                    {/* Floating elements */}
                    <div className={`absolute -top-1 -right-1 w-3 h-3 ${colors.bg} rounded-full opacity-60 transition-all duration-500 ${
                      isHovered ? 'scale-125 animate-bounce' : 'scale-100'
                    }`}></div>
                  </div>

                  {/* Counter */}
                  <div className="mb-4">
                    <h3 className={`text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${colors.gradient}`}>
                      <Counter 
                        end={stat.value} 
                        duration={2000} 
                        isVisible={isVisible} 
                        suffix={stat.suffix}
                        decimal={stat.decimal}
                      />
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 font-medium">
                    {stat.description}
                  </p>

                  {/* Special badge for rating */}
                  {index === 1 && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                        <FiAward className="w-3 h-3" />
                        Top Rated
                      </div>
                    </div>
                  )}

                  {/* Hover effect overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`}></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className={`text-center transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionDelay: '600ms' }}>
          <div className="inline-flex items-center gap-3 bg-white border border-gray-200 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group">
            <FiUsers className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
            <span className="text-gray-700 font-medium">Join thousands of successful entrepreneurs</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          50% { 
            transform: translateY(-20px) rotate(180deg); 
          }
        }

        @keyframes float-slow {
          0%, 100% { 
            transform: translateY(0px) scale(1); 
          }
          50% { 
            transform: translateY(-30px) scale(1.05); 
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Stats;