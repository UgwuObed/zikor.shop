"use client"

import { useState, useEffect, useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const LogosSection = () => {
  const [hoveredLogo, setHoveredLogo] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
      }
    }, { threshold: 0.2 });

    const section = document.getElementById('logos');
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  // Mouse tracking for subtle parallax effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (rect) {
        setMousePosition({
          x: (e.clientX - rect.left - rect.width / 2) / rect.width,
          y: (e.clientY - rect.top - rect.height / 2) / rect.height,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const logos = [
    {
      id: 'korean-cravings',
      name: 'Korean Cravings',
      src: "https://res.cloudinary.com/dantj20mr/image/upload/t_resize/v1746536677/cat7ylsjqgkhzj9i1wqp.jpg",
      description: "Korean food delivery service nationwide",
      color: "from-red-400 to-orange-400",
      category: "Food & Delivery"
    },
    {
      id: 'adorable',
      name: 'Adorable',
      src: "https://res.cloudinary.com/dantj20mr/image/upload/t_resize/v1746537855/adorable_ijgmxr.jpg",
      description: "Refreshing beverage business specializing in healthy fruit juices and smoothies",
      color: "from-green-400 to-blue-400",
      category: "Beverages"
    },
    {
      id: 'krafted',
      name: 'Krafted',
      src: "https://res.cloudinary.com/dantj20mr/image/upload/t_resize/v1746538092/crafted_pjrybs.jpg",
      description: "Beautifully crafted handmade shoes, bags and accessories",
      color: "from-amber-400 to-orange-400",
      category: "Fashion"
    },
    {
      id: 'shadewears',
      name: 'Shade Wears',
      src: "https://res.cloudinary.com/dantj20mr/image/upload/t_resize/v1746538868/fash_xwqits.png",
      description: "Fashion brand specializing in trendy clothing and accessories",
      color: "from-pink-400 to-purple-400",
      category: "Fashion"
    },
    {
      id: 'trimfit',
      name: 'TrimFit',
      src: "https://res.cloudinary.com/dantj20mr/image/upload/t_resize/v1746539398/tea_qrynhb.jpg",
      description: "Health and wellness brand specializing in weight loss teas and supplements",
      color: "from-emerald-400 to-teal-400",
      category: "Health & Wellness"
    },
    {
      id: 'bonethel',
      name: 'Bonethel',
      src: "https://res.cloudinary.com/dantj20mr/image/upload/t_resize/v1746539660/bonetel_xbog8g.jpg",
      description: "Phone cases and accessories business",
      color: "from-blue-400 to-indigo-400",
      category: "Tech Accessories"
    }
  ];

  const testimonials = [
    {
      quote: "Zikor totally transformed my online business. Setting up my shop was so easy, and now I can handle everything - orders, payments, you name it - all in one spot.",
      author: "Bella",
      position: "CEO, Korean Cravings",
      avatar: "B",
      company: "korean-cravings"
    },
    {
      quote: "The analytics and insights helped us understand our customers better. Our sales increased by 300% in just 3 months!",
      author: "David",
      position: "Founder, Adorable",
      avatar: "D",
      company: "adorable"
    },
    {
      quote: "From inventory management to customer service, everything is seamless. Best investment we've made for our business.",
      author: "Sarah",
      position: "Owner, Krafted",
      avatar: "S",
      company: "krafted"
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="logos" 
      className="relative py-20 px-5 bg-gradient-to-b from-white via-purple-50/30 to-white overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-slow"></div>
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float-slow" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Interactive light effect */}
      <div 
        className="absolute pointer-events-none w-96 h-96 rounded-full bg-gradient-radial from-purple-300/10 via-transparent to-transparent blur-3xl transition-all duration-1000 ease-out"
        style={{
          transform: `translate(${mousePosition.x * 50}px, ${mousePosition.y * 30}px)`,
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          {/* Enhanced header with animations */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-100/50 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-purple-700 font-medium text-sm uppercase tracking-wide">Trusted Partners</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powering Success Across
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                Every Industry
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Trusted by <span className="text-purple-600 font-bold animate-pulse">2000+</span> businesses nationwide to scale and grow
            </p>

            {/* Animated underline */}
            <div className="mx-auto mt-6 h-1 w-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          </div>
          
          {/* Enhanced logos grid */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
            {logos.map((logo, index) => (
              <div 
                key={logo.id}
                className="relative group cursor-pointer"
                onMouseEnter={() => setHoveredLogo(logo.id)}
                onMouseLeave={() => setHoveredLogo(null)}
                style={{
                  animationDelay: `${index * 150}ms`,
                  animation: isVisible ? 'fadeInScale 0.8s ease-out forwards' : 'none'
                }}
              >
                {/* Hover glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${logo.color} rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-all duration-500 scale-150`}></div>
                
                {/* Logo container with enhanced effects */}
                <div className={`relative transform transition-all duration-500 ${
                  hoveredLogo === logo.id ? 'scale-125 -rotate-3' : 'scale-100'
                } group-hover:scale-110`}>
                  <div className={`relative overflow-hidden rounded-full transition-all duration-500 ${
                    hoveredLogo === logo.id ? 'shadow-2xl shadow-purple-500/25' : 'shadow-lg'
                  }`}>
                    <img 
                      src={logo.src} 
                      alt={`${logo.name} logo`} 
                      className={`w-24 h-24 object-cover transition-all duration-500 ${
                        hoveredLogo === logo.id ? 'opacity-100 scale-110' : 'opacity-75'
                      } group-hover:opacity-100`}
                    />
                    
                    {/* Shimmer effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </div>
                  
                  {/* Category badge */}
                  <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-white rounded-full shadow-md text-xs font-medium text-gray-600 transition-all duration-300 ${
                    hoveredLogo === logo.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}>
                    {logo.category}
                  </div>
                </div>
                
                {/* Enhanced tooltip */}
                {hoveredLogo === logo.id && (
                  <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-lg shadow-2xl rounded-xl p-4 w-64 text-center z-20 border border-purple-100 animate-fadeInUp">
                    <div className={`w-full h-1 bg-gradient-to-r ${logo.color} rounded-full mb-3`}></div>
                    <p className="font-bold text-gray-900 mb-2">{logo.name}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{logo.description}</p>
                    
                    {/* Arrow pointer */}
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-purple-100"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Enhanced testimonials section */}
          <div className="mt-20 flex justify-center">
            <div className="w-full max-w-2xl">
              <div className="relative bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-purple-100 overflow-hidden">
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50 opacity-50"></div>
                
                {/* Header with controls */}
                <div className="relative flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">★</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">Success Stories</h3>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={prevTestimonial}
                      className="group w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-lg"
                    >
                      <ChevronLeftIcon className="w-5 h-5 transform group-hover:-translate-x-0.5 transition-transform duration-200" />
                    </button>
                    <button 
                      onClick={nextTestimonial}
                      className="group w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-lg"
                    >
                      <ChevronRightIcon className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform duration-200" />
                    </button>
                  </div>
                </div>
                
                {/* Testimonial content with smooth transitions */}
                <div className="relative min-h-[120px]">
                  {testimonials.map((testimonial, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-all duration-700 ${
                        index === currentTestimonial
                          ? 'opacity-100 translate-x-0'
                          : index < currentTestimonial
                          ? 'opacity-0 -translate-x-full'
                          : 'opacity-0 translate-x-full'
                      }`}
                    >
                      <blockquote className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                        "{testimonial.quote}"
                      </blockquote>
                      
                      <div className="flex items-center">
                        <div className="relative">
                          <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {testimonial.avatar}
                          </div>
                          {/* Company logo overlay */}
                          {logos.find(logo => logo.id === testimonial.company) && (
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full overflow-hidden border-2 border-white">
                              <img 
                                src={logos.find(logo => logo.id === testimonial.company)?.src} 
                                alt="Company logo"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <p className="font-bold text-gray-900">{testimonial.author}</p>
                          <p className="text-gray-600 text-sm">{testimonial.position}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Progress indicators */}
                <div className="flex justify-center mt-6 space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentTestimonial
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-125'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease-out forwards;
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }

        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </section>
  );
};

export default LogosSection;