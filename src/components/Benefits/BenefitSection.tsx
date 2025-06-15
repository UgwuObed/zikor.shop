"use client"

import React, { useState, useEffect, useRef } from 'react';
import { benefits } from '../../data/benefits';
import { 
  FiArrowRight, 
  FiCheck, 
  FiStar, 
  FiZap, 
  FiTrendingUp, 
  FiShield, 
  FiGlobe,
  FiHeart,
  FiTarget,
  FiAward,
  FiCpu,
  FiLayers,
  FiDollarSign,
  FiShoppingCart,
  FiSmartphone,
  FiUsers,
  FiTruck
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { IBenefit } from '@/src/types';

interface BenefitSectionProps {
  benefit: IBenefit;
  imageAtRight: boolean;
}

// Custom Lottie-style animated components
const EcommerceAnimation = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <svg width="500" height="400" viewBox="0 0 500 400" className="w-full h-full">
      {/* Animated Background Circles */}
      <motion.circle
        cx="250" cy="200" r="120"
        fill="url(#gradient1)"
        opacity="0.1"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 360]
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.circle
        cx="250" cy="200" r="80"
        fill="url(#gradient2)"
        opacity="0.15"
        animate={{ 
          scale: [1.2, 1, 1.2],
          rotate: [360, 0]
        }}
        transition={{ 
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Animated Storefront */}
      <motion.g
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        {/* Building */}
        <motion.rect
          x="150" y="180" width="200" height="180"
          fill="url(#buildingGradient)"
          rx="20"
          animate={{ 
            boxShadow: ["0 0 0 rgba(139, 92, 246, 0)", "0 0 20px rgba(139, 92, 246, 0.3)", "0 0 0 rgba(139, 92, 246, 0)"]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        
        {/* Windows */}
        {[0, 1, 2].map((i) => (
          <motion.rect
            key={i}
            x={180 + i * 40} y="200" width="25" height="30"
            fill="#93C5FD"
            rx="5"
            animate={{ 
              opacity: [0.5, 1, 0.5],
              fill: ["#93C5FD", "#60A5FA", "#93C5FD"]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3
            }}
          />
        ))}

        {/* Door */}
        <motion.rect
          x="230" y="280" width="40" height="80"
          fill="url(#doorGradient)"
          rx="20"
          animate={{ 
            scaleY: [1, 1.05, 1]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Awning */}
        <motion.path
          d="M140 180 L360 180 L340 160 L160 160 Z"
          fill="url(#awningGradient)"
          animate={{ 
            scaleX: [1, 1.1, 1]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </motion.g>

      {/* Floating Shopping Icons */}
      {[...Array(6)].map((_, i) => (
        <motion.g
          key={i}
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 360],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ 
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.5
          }}
        >
          <circle
            cx={100 + i * 60}
            cy={80 + Math.sin(i) * 30}
            r="15"
            fill="url(#iconGradient)"
            opacity="0.8"
          />
          <text
            x={100 + i * 60}
            y={85 + Math.sin(i) * 30}
            textAnchor="middle"
            fontSize="12"
            fill="white"
          >
            {['🛒', '💳', '📱', '📦', '⭐', '💎'][i]}
          </text>
        </motion.g>
      ))}

      {/* Animated Chart */}
      <motion.g
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        {[40, 60, 80, 100, 85].map((height, i) => (
          <motion.rect
            key={i}
            x={380 + i * 15}
            y={200 - height}
            width="10"
            height={height}
            fill="url(#chartGradient)"
            rx="5"
            initial={{ height: 0, y: 200 }}
            animate={{ height, y: 200 - height }}
            transition={{ 
              duration: 1,
              delay: 1.5 + i * 0.2,
              type: "spring",
              stiffness: 100
            }}
          />
        ))}
      </motion.g>

      {/* Floating Money */}
      {[...Array(8)].map((_, i) => (
        <motion.text
          key={i}
          x={50 + i * 50}
          y={350}
          fontSize="20"
          animate={{ 
            y: [350, 50, 350],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            delay: i * 0.8
          }}
        >
          💰
        </motion.text>
      ))}

      {/* Gradients */}
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id="buildingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F3F4F6" />
          <stop offset="100%" stopColor="#E5E7EB" />
        </linearGradient>
        <linearGradient id="doorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
        <linearGradient id="awningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#DC2626" />
        </linearGradient>
        <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

const AnalyticsAnimation = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <svg width="500" height="400" viewBox="0 0 500 400" className="w-full h-full">
      {/* Background Grid */}
      <motion.g opacity="0.1">
        {[...Array(10)].map((_, i) => (
          <motion.line
            key={`v${i}`}
            x1={50 + i * 40} y1="50" x2={50 + i * 40} y2="350"
            stroke="#8B5CF6"
            strokeWidth="1"
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.1 }}
          />
        ))}
        {[...Array(8)].map((_, i) => (
          <motion.line
            key={`h${i}`}
            x1="50" y1={50 + i * 40} x2="450" y2={50 + i * 40}
            stroke="#8B5CF6"
            strokeWidth="1"
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.1 }}
          />
        ))}
      </motion.g>

      {/* Animated Line Chart */}
      <motion.g>
        <motion.path
          d="M50 300 Q150 250 250 200 T450 150"
          stroke="url(#lineGradient)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, delay: 0.5 }}
        />
        
        {/* Data Points */}
        {[
          { x: 50, y: 300 },
          { x: 150, y: 250 },
          { x: 250, y: 200 },
          { x: 350, y: 175 },
          { x: 450, y: 150 }
        ].map((point, i) => (
          <motion.circle
            key={i}
            cx={point.x} cy={point.y}
            r="8"
            fill="url(#pointGradient)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.5,
              delay: 1 + i * 0.2,
              type: "spring",
              stiffness: 200
            }}
          />
        ))}
      </motion.g>

      {/* Floating Numbers */}
      {['$10K', '$25K', '$50K', '$75K', '$100K'].map((value, i) => (
        <motion.text
          key={i}
          x={70 + i * 80}
          y="80"
          fontSize="16"
          fontWeight="bold"
          fill="url(#textGradient)"
          textAnchor="middle"
          animate={{ 
            y: [80, 60, 80],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3
          }}
        >
          {value}
        </motion.text>
      ))}

      {/* Animated Pie Chart */}
      <motion.g transform="translate(380, 320)">
        {[
          { startAngle: 0, endAngle: 120, color: "#8B5CF6" },
          { startAngle: 120, endAngle: 200, color: "#EC4899" },
          { startAngle: 200, endAngle: 280, color: "#10B981" },
          { startAngle: 280, endAngle: 360, color: "#F59E0B" }
        ].map((slice, i) => (
          <motion.path
            key={i}
            d={`M 0 0 L ${Math.cos((slice.startAngle - 90) * Math.PI / 180) * 40} ${Math.sin((slice.startAngle - 90) * Math.PI / 180) * 40} A 40 40 0 0 1 ${Math.cos((slice.endAngle - 90) * Math.PI / 180) * 40} ${Math.sin((slice.endAngle - 90) * Math.PI / 180) * 40} Z`}
            fill={slice.color}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              duration: 1,
              delay: 1.5 + i * 0.2,
              type: "spring",
              stiffness: 100
            }}
          />
        ))}
      </motion.g>

      {/* Floating Analytics Icons */}
      {[
        { icon: '📊', x: 100, y: 120 },
        { icon: '📈', x: 300, y: 100 },
        { icon: '💹', x: 400, y: 250 },
        { icon: '🎯', x: 150, y: 340 }
      ].map((item, i) => (
        <motion.text
          key={i}
          x={item.x} y={item.y}
          fontSize="24"
          textAnchor="middle"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            delay: i * 0.5
          }}
        >
          {item.icon}
        </motion.text>
      ))}

      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="50%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
        <linearGradient id="pointGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

const MobileCommerceAnimation = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <svg width="500" height="400" viewBox="0 0 500 400" className="w-full h-full">
      {/* Phone Container */}
      <motion.g
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.rect
          x="200" y="80" width="100" height="180"
          fill="url(#phoneGradient)"
          rx="20"
          animate={{ 
            boxShadow: ["0 0 0 rgba(139, 92, 246, 0)", "0 0 30px rgba(139, 92, 246, 0.5)", "0 0 0 rgba(139, 92, 246, 0)"]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        
        {/* Screen */}
        <rect x="210" y="100" width="80" height="140" fill="#000000" rx="10" />
        
        {/* App Interface */}
        <rect x="215" y="110" width="70" height="30" fill="url(#headerGradient)" rx="5" />
        
        {/* Product Cards */}
        {[0, 1].map((i) => (
          <motion.g key={i}>
            <motion.rect
              x="220" y={150 + i * 40} width="60" height="30"
              fill="url(#cardGradient)"
              rx="5"
              animate={{ 
                scaleX: [1, 1.05, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                delay: i * 0.5
              }}
            />
            <circle cx="230" cy={165 + i * 40} r="8" fill="#60A5FA" />
            <rect x="245" y={160 + i * 40} width="30" height="3" fill="#E5E7EB" rx="1" />
            <rect x="245" y={167 + i * 40} width="20" height="2" fill="#E5E7EB" rx="1" />
          </motion.g>
        ))}
      </motion.g>

      {/* Floating Shopping Elements */}
      {[
        { emoji: '🛒', x: 150, y: 150, delay: 0 },
        { emoji: '💳', x: 350, y: 180, delay: 0.5 },
        { emoji: '📦', x: 120, y: 250, delay: 1 },
        { emoji: '🚚', x: 380, y: 220, delay: 1.5 },
        { emoji: '⭐', x: 160, y: 320, delay: 2 },
        { emoji: '💎', x: 340, y: 280, delay: 2.5 }
      ].map((item, i) => (
        <motion.text
          key={i}
          x={item.x} y={item.y}
          fontSize="32"
          textAnchor="middle"
          animate={{ 
            y: [item.y, item.y - 30, item.y],
            rotate: [0, 360],
            scale: [1, 1.3, 1]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            delay: item.delay
          }}
        >
          {item.emoji}
        </motion.text>
      ))}

      {/* Notification Bubbles */}
      {[...Array(5)].map((_, i) => (
        <motion.g key={i}>
          <motion.circle
            cx={80 + i * 80}
            cy={60}
            r="15"
            fill="url(#notificationGradient)"
            animate={{ 
              scale: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              delay: i * 0.6
            }}
          />
          <motion.text
            x={80 + i * 80}
            y={66}
            fontSize="10"
            textAnchor="middle"
            fill="white"
            fontWeight="bold"
            animate={{ 
              scale: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              delay: i * 0.6
            }}
          >
            +{i + 1}
          </motion.text>
        </motion.g>
      ))}

      {/* Payment Success Animation */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
      >
        <circle cx="250" cy="350" r="25" fill="url(#successGradient)" />
        <motion.path
          d="M240 350 L248 358 L260 342"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 2.5 }}
        />
      </motion.g>

      <defs>
        <linearGradient id="phoneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1F2937" />
          <stop offset="100%" stopColor="#374151" />
        </linearGradient>
        <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
        <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F9FAFB" />
          <stop offset="100%" stopColor="#F3F4F6" />
        </linearGradient>
        <linearGradient id="notificationGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#DC2626" />
        </linearGradient>
        <linearGradient id="successGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

const AutomationAnimation = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <svg width="500" height="400" viewBox="0 0 500 400" className="w-full h-full">
      {/* Central Hub */}
      <motion.circle
        cx="250" cy="200" r="50"
        fill="url(#hubGradient)"
        animate={{ 
          scale: [1, 1.1, 1],
          boxShadow: ["0 0 0 rgba(139, 92, 246, 0)", "0 0 40px rgba(139, 92, 246, 0.6)", "0 0 0 rgba(139, 92, 246, 0)"]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      {/* Central Icon */}
      <motion.text
        x="250" y="210"
        fontSize="32"
        textAnchor="middle"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      >
        ⚙️
      </motion.text>

      {/* Orbiting Elements */}
      {[
        { icon: '📧', angle: 0, radius: 120, color: '#8B5CF6' },
        { icon: '📊', angle: 60, radius: 120, color: '#EC4899' },
        { icon: '🔔', angle: 120, radius: 120, color: '#10B981' },
        { icon: '💰', angle: 180, radius: 120, color: '#F59E0B' },
        { icon: '📱', angle: 240, radius: 120, color: '#3B82F6' },
        { icon: '🎯', angle: 300, radius: 120, color: '#EF4444' }
      ].map((item, i) => (
        <motion.g key={i}>
          <motion.circle
            cx={250 + Math.cos((item.angle - 90) * Math.PI / 180) * item.radius}
            cy={200 + Math.sin((item.angle - 90) * Math.PI / 180) * item.radius}
            r="30"
            fill={item.color}
            opacity="0.8"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 12,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              transformOrigin: "250px 200px"
            }}
          />
          <motion.text
            x={250 + Math.cos((item.angle - 90) * Math.PI / 180) * item.radius}
            y={200 + Math.sin((item.angle - 90) * Math.PI / 180) * item.radius + 8}
            fontSize="24"
            textAnchor="middle"
            animate={{ 
              rotate: [0, 360]
            }}
            transition={{ 
              duration: 12,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              transformOrigin: "250px 200px"
            }}
          >
            {item.icon}
          </motion.text>
        </motion.g>
      ))}

      {/* Connecting Lines */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <motion.line
          key={i}
          x1="250" y1="200"
          x2={250 + Math.cos((angle - 90) * Math.PI / 180) * 80}
          y2={200 + Math.sin((angle - 90) * Math.PI / 180) * 80}
          stroke="url(#connectionGradient)"
          strokeWidth="3"
          opacity="0.6"
          animate={{ 
            opacity: [0.3, 0.8, 0.3],
            strokeWidth: [2, 4, 2]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3
          }}
        />
      ))}

      {/* Data Flow Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.circle
          key={i}
          r="3"
          fill="url(#particleGradient)"
          animate={{ 
            cx: [
              250 + Math.cos((i * 18 - 90) * Math.PI / 180) * 80,
              250 + Math.cos((i * 18 + 45 - 90) * Math.PI / 180) * 140,
              250 + Math.cos((i * 18 + 90 - 90) * Math.PI / 180) * 80
            ],
            cy: [
              200 + Math.sin((i * 18 - 90) * Math.PI / 180) * 80,
              200 + Math.sin((i * 18 + 45 - 90) * Math.PI / 180) * 140,
              200 + Math.sin((i * 18 + 90 - 90) * Math.PI / 180) * 80
            ],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            delay: i * 0.15
          }}
        />
      ))}

      <defs>
        <radialGradient id="hubGradient" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="70%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#6366F1" />
        </radialGradient>
        <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
        <radialGradient id="particleGradient" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#10B981" />
        </radialGradient>
      </defs>
    </svg>
  </div>
);

// Animation selector based on benefit type
const getAnimationComponent = (benefitTitle: string) => {
  const title = benefitTitle.toLowerCase();
  
  if (title.includes('store') || title.includes('ecommerce') || title.includes('shop')) {
    return <EcommerceAnimation />;
  } else if (title.includes('analytics') || title.includes('data') || title.includes('insights')) {
    return <AnalyticsAnimation />;
  } else if (title.includes('mobile') || title.includes('app') || title.includes('responsive')) {
    return <MobileCommerceAnimation />;
  } else if (title.includes('automation') || title.includes('workflow') || title.includes('integration')) {
    return <AutomationAnimation />;
  } else {
    // Default animation
    return <EcommerceAnimation />;
  }
};

const BenefitSection: React.FC<BenefitSectionProps> = ({ benefit, imageAtRight }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [bulletHover, setBulletHover] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Enhanced mouse tracking for 3D effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left - rect.width / 2) / rect.width,
          y: (e.clientY - rect.top - rect.height / 2) / rect.height,
        });
      }
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Premium floating particles
  const FloatingParticles = () => {
    const [particles, setParticles] = useState<Array<{
      id: number;
      left: string;
      top: string;
      animationDelay: string;
      animationDuration: string;
      size: string;
      color: string;
      icon: React.ReactNode;
    }>>([]);

    useEffect(() => {
      const colors = [
        'from-purple-400 to-pink-400', 
        'from-blue-400 to-purple-400', 
        'from-pink-400 to-red-400',
        'from-yellow-400 to-orange-400',
        'from-green-400 to-emerald-400',
        'from-indigo-400 to-purple-400'
      ];
      
      const icons = [
        <FiStar key="star" className="w-3 h-3" />,
        <FiZap key="zap" className="w-3 h-3" />,
        <FiHeart key="heart" className="w-3 h-3" />,
        <FiTarget key="target" className="w-3 h-3" />,
        <FiAward key="award" className="w-3 h-3" />,
        <FiShield key="shield" className="w-3 h-3" />
      ];
      
      const sizes = ['w-8 h-8', 'w-10 h-10', 'w-6 h-6'];
      
      const newParticles = [...Array(20)].map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 20}s`,
        animationDuration: `${15 + Math.random() * 20}s`,
        size: sizes[Math.floor(Math.random() * sizes.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        icon: icons[Math.floor(Math.random() * icons.length)]
      }));
      setParticles(newParticles);
    }, []);

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute ${particle.size} bg-gradient-to-r ${particle.color} rounded-2xl opacity-20 animate-float-premium backdrop-blur-sm border border-white/20 shadow-lg flex items-center justify-center text-white`}
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.animationDelay,
              animationDuration: particle.animationDuration,
            }}
          >
            {particle.icon}
          </div>
        ))}
      </div>
    );
  };

  // Enhanced bullet point icons based on index
  const getBulletIcon = (index: number) => {
    const icons = [
      <FiZap key="zap" className="w-6 h-6" />,
      <FiShield key="shield" className="w-6 h-6" />,
      <FiTrendingUp key="trending" className="w-6 h-6" />,
      <FiGlobe key="globe" className="w-6 h-6" />,
      <FiCpu key="cpu" className="w-6 h-6" />,
      <FiLayers key="layers" className="w-6 h-6" />
    ];
    return icons[index % icons.length];
  };

  const getGradientColor = (index: number) => {
    const gradients = [
      'from-purple-500 to-pink-500',
      'from-blue-500 to-purple-500',
      'from-green-500 to-emerald-500',
      'from-yellow-500 to-orange-500',
      'from-pink-500 to-red-500',
      'from-indigo-500 to-purple-500'
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div
      ref={sectionRef}
      className={`relative mb-32 transition-all duration-1500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
      }`}
      style={{ transform: `translateY(${scrollY * 0.02}px)` }}
    >
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Premium floating orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-float-elegant"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-blue-300/20 to-purple-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-float-elegant animation-delay-8000"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-br from-pink-300/20 to-red-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-float-elegant animation-delay-16000"></div>
        
        {/* Animated grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8000bb05_1px,transparent_1px),linear-gradient(to_bottom,#8000bb05_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] animate-grid-drift"></div>
      </div>

      {/* Floating particles */}
      <FloatingParticles />

      {/* Interactive light effect */}
      <div 
        className="absolute pointer-events-none w-[800px] h-[800px] rounded-full bg-gradient-radial from-purple-400/10 via-pink-400/5 to-transparent blur-3xl transition-all duration-1000 ease-out"
        style={{
          transform: `translate(${mousePosition.x * 120}px, ${mousePosition.y * 80}px)`,
        }}
      />

      <div className={`grid lg:grid-cols-2 gap-20 items-center ${
        imageAtRight ? 'lg:grid-flow-col-dense' : ''
      }`}>
        
        {/* Enhanced Content Section */}
        <div className={`relative ${imageAtRight ? 'lg:col-start-2' : ''}`}>
          {/* Premium content container */}
          <motion.div 
            className="relative bg-white/80 backdrop-blur-2xl border border-white/50 rounded-3xl p-12 shadow-2xl hover:shadow-3xl transition-all duration-1000 group overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              transform: `perspective(1000px) rotateY(${mousePosition.x * 2}deg) rotateX(${-mousePosition.y * 1}deg)`,
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            
            {/* Animated background gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/40 via-white/30 to-pink-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/30 via-transparent to-purple-50/30 opacity-0 group-hover:opacity-80 transition-opacity duration-500"></div>
            
            {/* Top gradient border with shimmer */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-shimmer rounded-t-3xl"></div>

            {/* Corner accent elements */}
            <div className="absolute top-4 left-4 w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-60 animate-pulse-premium"></div>
            <div className="absolute top-4 right-4 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-40 animate-bounce-premium"></div>

            {/* Content */}
            <div className="relative z-10">
              {/* Enhanced title section */}
              <div className="mb-8">
                <motion.div 
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-200/30 px-4 py-2 rounded-full mb-6"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <FiStar className="w-4 h-4 text-purple-600 animate-spin-slow" />
                  <span className="text-purple-700 font-semibold text-sm uppercase tracking-wide">Feature Spotlight</span>
                </motion.div>

                <motion.h3 
                  className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <span className="text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-500">
                    {benefit.title}
                  </span>
                </motion.h3>

                {/* Decorative line */}
                <motion.div 
                  className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6"
                  whileHover={{ width: "8rem" }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Enhanced description */}
              <motion.div 
                className="relative mb-10 p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/30"
                whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <p className="text-xl text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors duration-300 font-light">
                  {benefit.description}
                </p>
                
                {/* Quote decoration */}
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                  "
                </div>
              </motion.div>

              {/* Enhanced bullet points with premium animations */}
              <div className="space-y-6 mb-10">
                <AnimatePresence>
                  {benefit.bullets.map((bullet, bulletIndex) => (
                    <motion.div
                      key={bulletIndex}
                      className="group/bullet relative transform"
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        duration: 0.6,
                        delay: bulletIndex * 0.2,
                        type: "spring",
                        stiffness: 100
                      }}
                      onMouseEnter={() => setBulletHover(bulletIndex)}
                      onMouseLeave={() => setBulletHover(null)}
                      whileHover={{ scale: 1.02, y: -5 }}
                    >
                      {/* Premium bullet container */}
                      <div className="relative p-6 rounded-3xl bg-white/60 backdrop-blur-xl border border-white/40 hover:border-purple-200/60 hover:bg-white/80 transition-all duration-500 hover:shadow-xl overflow-hidden">
                        
                        {/* Background effect */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${getGradientColor(bulletIndex)} opacity-0 group-hover/bullet:opacity-10 transition-opacity duration-500 rounded-3xl`}></div>
                        
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform -translate-x-full group-hover/bullet:translate-x-full transition-transform duration-1000"></div>

                        <div className="flex items-start gap-6 relative z-10">
                          {/* Enhanced icon container with 3D effects */}
                          <motion.div 
                            className="relative"
                            whileHover={{ scale: 1.2, rotate: 12 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          >
                            <div className={`w-16 h-16 bg-gradient-to-r ${getGradientColor(bulletIndex)} rounded-3xl flex items-center justify-center text-white shadow-2xl relative`}>
                              {getBulletIcon(bulletIndex)}
                              
                              {/* Pulsing ring effect */}
                              <div className={`absolute inset-0 bg-gradient-to-r ${getGradientColor(bulletIndex)} rounded-3xl opacity-0 group-hover/bullet:opacity-40 animate-ping`}></div>
                            </div>
                            
                            {/* Glow effect */}
                            <div className={`absolute inset-0 bg-gradient-to-r ${getGradientColor(bulletIndex)} rounded-3xl blur-xl opacity-0 group-hover/bullet:opacity-50 transition-opacity duration-500 scale-110`}></div>
                            
                            {/* Floating micro-particles */}
                            <motion.div 
                              className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-0 group-hover/bullet:opacity-100"
                              animate={{ y: [0, -10, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                            <motion.div 
                              className="absolute -bottom-1 -left-1 w-2 h-2 bg-gradient-to-r from-pink-400 to-red-400 rounded-full opacity-0 group-hover/bullet:opacity-100"
                              animate={{ y: [0, -8, 0] }}
                              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                            />
                          </motion.div>

                          {/* Content with enhanced typography */}
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 text-xl mb-3 group-hover/bullet:text-transparent group-hover/bullet:bg-clip-text group-hover/bullet:bg-gradient-to-r group-hover/bullet:from-purple-600 group-hover/bullet:to-pink-600 transition-all duration-300">
                              {bullet.title}
                            </h4>
                            <p className="text-gray-600 leading-relaxed text-lg group-hover/bullet:text-gray-700 transition-colors duration-300 font-light">
                              {bullet.description}
                            </p>
                          </div>

                          {/* Enhanced check icon with animation */}
                          <motion.div 
                            className="relative"
                            whileHover={{ scale: 1.2, rotate: 15 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          >
                            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                              <FiCheck size={16} />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur-lg opacity-0 group-hover/bullet:opacity-40 transition-opacity duration-300"></div>
                          </motion.div>
                        </div>

                        {/* Bottom accent line */}
                        <motion.div 
                          className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r ${getGradientColor(bulletIndex)} rounded-full opacity-60`}
                          initial={{ width: "5rem" }}
                          whileHover={{ width: "10rem", opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Enhanced CTA Button with multiple effects */}
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button className="group/cta relative overflow-hidden bg-gradient-to-r from-[#8000bb] via-purple-600 to-pink-600 text-white px-10 py-5 rounded-3xl font-bold text-lg transition-all duration-700 shadow-2xl hover:shadow-purple-500/40 transform-gpu">
                  
                  {/* Background effects */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 transform scale-x-0 group-hover/cta:scale-x-100 transition-transform duration-500 origin-left rounded-3xl"></div>
                  
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform -translate-x-full group-hover/cta:translate-x-full transition-transform duration-1000"></div>
                  
                  {/* Ripple effect */}
                  <div className="absolute inset-0 bg-white/20 rounded-3xl transform scale-0 group-hover/cta:scale-100 group-hover/cta:opacity-0 transition-all duration-500"></div>

                  <span className="relative z-10 flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <FiZap className="w-6 h-6" />
                    </motion.div>
                    Explore Feature
                    <motion.div
                      whileHover={{ x: 5, scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <FiArrowRight className="w-6 h-6" />
                    </motion.div>
                  </span>
                </button>

                {/* Button glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#8000bb] via-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-700 scale-110"></div>
              </motion.div>
            </div>

            {/* Bottom gradient border */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent rounded-b-3xl"></div>
          </motion.div>
        </div>

        {/* Enhanced Animation Section with Lottie-style animations */}
        <div className={`relative ${imageAtRight ? 'lg:col-start-1' : ''}`}>
          <motion.div 
            className="relative group perspective-1000"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
          >
            
            {/* Multiple layered glow effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-3xl blur-3xl opacity-25 transform scale-125 animate-pulse-glow group-hover:opacity-40 transition-opacity duration-1000"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-3xl blur-2xl opacity-20 transform scale-115 animate-pulse-glow animation-delay-2000 group-hover:opacity-35 transition-opacity duration-1000"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-red-400 to-orange-400 rounded-3xl blur-xl opacity-15 transform scale-105 animate-pulse-glow animation-delay-4000 group-hover:opacity-25 transition-opacity duration-1000"></div>
            
            {/* Enhanced animation container with glassmorphism */}
            <div className="relative overflow-hidden rounded-3xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-3xl group-hover:shadow-purple-500/30 transition-all duration-1000 transform-gpu">
              
              {/* Lottie-style animation */}
              <div className="relative p-10 h-[500px]">
                <div 
                  className="relative overflow-hidden rounded-2xl h-full"
                  style={{
                    transform: `perspective(1000px) rotateY(${mousePosition.x * 8}deg) rotateX(${-mousePosition.y * 5}deg) translateZ(${isHovered ? '50px' : '0px'})`,
                  }}
                >
                  {getAnimationComponent(benefit.title)}
                  
                  {/* Enhanced shimmer overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1500"></div>
                  
                  {/* Holographic effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-pink-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </div>
              </div>
              
              {/* Enhanced corner decorations */}
              <motion.div 
                className="absolute top-6 left-6 w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-70 shadow-lg"
                animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div 
                className="absolute top-6 right-6 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-50 shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div 
                className="absolute bottom-6 left-6 w-5 h-5 bg-gradient-to-r from-pink-400 to-red-400 rounded-full opacity-60 shadow-lg"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 4, repeat: Infinity, delay: 2 }}
              />
              <motion.div 
                className="absolute bottom-6 right-6 w-6 h-6 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-70 shadow-lg"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
              />
            </div>

            {/* Enhanced floating elements around animation */}
            <motion.div 
              className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl opacity-80 shadow-2xl flex items-center justify-center text-white"
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              <FiStar className="w-8 h-8" />
            </motion.div>
            
            <motion.div 
              className="absolute -top-4 -right-12 w-12 h-12 bg-gradient-to-r from-pink-400 to-red-400 rounded-3xl opacity-80 shadow-2xl flex items-center justify-center text-white"
              animate={{ 
                y: [0, -25, 0],
                rotate: [0, -360],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
            >
              <FiZap className="w-6 h-6" />
            </motion.div>
            
            <motion.div 
              className="absolute -bottom-8 -left-12 w-20 h-20 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-3xl opacity-80 shadow-2xl flex items-center justify-center text-white"
              animate={{ 
                y: [0, -30, 0],
                rotate: [0, 180, 360],
                scale: [1, 0.9, 1]
              }}
              transition={{ duration: 8, repeat: Infinity, delay: 1 }}
            >
              <FiAward className="w-10 h-10" />
            </motion.div>
            
            <motion.div 
              className="absolute -bottom-4 -right-8 w-14 h-14 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-3xl opacity-80 shadow-2xl flex items-center justify-center text-white"
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 270],
                scale: [1, 1.15, 1]
              }}
              transition={{ duration: 7, repeat: Infinity, delay: 1.5 }}
            >
              <FiTarget className="w-7 h-7" />
            </motion.div>

            {/* Orbiting elements */}
            <motion.div 
              className="absolute top-1/2 left-1/2 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"
              animate={{ 
                rotate: [0, 360]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "0 100px" }}
            />
            <motion.div 
              className="absolute top-1/2 left-1/2 w-2 h-2 bg-gradient-to-r from-red-400 to-pink-400 rounded-full"
              animate={{ 
                rotate: [0, -360]
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "0 150px" }}
            />
          </motion.div>
        </div>
      </div>

      {/* Enhanced Custom CSS */}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        @keyframes float-elegant {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          25% { transform: translateY(-20px) rotate(1deg) scale(1.02); }
          50% { transform: translateY(-40px) rotate(0deg) scale(0.98); }
          75% { transform: translateY(-20px) rotate(-1deg) scale(1.01); }
        }

        @keyframes float-premium {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          50% { transform: translateY(-30px) rotate(180deg) scale(1.1); }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.05); }
        }

        @keyframes pulse-premium {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        @keyframes bounce-premium {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-15px) scale(1.1); }
        }

        @keyframes grid-drift {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }

        .animate-float-elegant {
          animation: float-elegant 20s ease-in-out infinite;
        }

        .animate-float-premium {
          animation: float-premium 15s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 4s ease-in-out infinite;
        }

        .animate-pulse-premium {
          animation: pulse-premium 3s ease-in-out infinite;
        }

        .animate-bounce-premium {
          animation: bounce-premium 4s ease-in-out infinite;
        }

        .animate-grid-drift {
          animation: grid-drift 12s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animation-delay-8000 {
          animation-delay: 8s;
        }

        .animation-delay-16000 {
          animation-delay: 16s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }

        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default BenefitSection;