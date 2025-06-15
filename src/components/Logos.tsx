"use client"

import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const LogosSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
      }
    }, { threshold: 0.2 });

    const section = document.getElementById('logos');
    if (section) observer.observe(section);
    return () => { if (section) observer.unobserve(section); };
  }, []);

  const logos = [
    {
      name: 'Korean Cravings',
      src: "https://res.cloudinary.com/dantj20mr/image/upload/t_resize/v1746536677/cat7ylsjqgkhzj9i1wqp.jpg",
      category: "Food & Delivery",
      growth: "+250%"
    },
    {
      name: 'Adorable',
      src: "https://res.cloudinary.com/dantj20mr/image/upload/t_resize/v1746537855/adorable_ijgmxr.jpg",
      category: "Beverages",
      growth: "+180%"
    },
    {
      name: 'Krafted',
      src: "https://res.cloudinary.com/dantj20mr/image/upload/t_resize/v1746538092/crafted_pjrybs.jpg",
      category: "Fashion",
      growth: "+320%"
    },
    {
      name: 'Shade Wears',
      src: "https://res.cloudinary.com/dantj20mr/image/upload/t_resize/v1746538868/fash_xwqits.png",
      category: "Fashion",
      growth: "+200%"
    },
    {
      name: 'TrimFit',
      src: "https://res.cloudinary.com/dantj20mr/image/upload/t_resize/v1746539398/tea_qrynhb.jpg",
      category: "Health & Wellness",
      growth: "+290%"
    },
    {
      name: 'Bonethel',
      src: "https://res.cloudinary.com/dantj20mr/image/upload/t_resize/v1746539660/bonetel_xbog8g.jpg",
      category: "Tech",
      growth: "+150%"
    }
  ];

  const testimonials = [
    {
      quote: "Zikor totally transformed my online business. Setting up my shop was so easy, and our revenue increased by 250% in just 6 months!",
      author: "Bella Kim",
      company: "Korean Cravings",
      avatar: "https://res.cloudinary.com/dantj20mr/image/upload/t_resize/v1746536677/cat7ylsjqgkhzj9i1wqp.jpg",
      growth: "250%"
    },
    {
      quote: "The analytics helped us understand our customers better. Our sales increased by 300% in just 3 months with automated tools!",
      author: "David Chen",
      company: "Adorable Beverages",
      avatar: "https://res.cloudinary.com/dantj20mr/image/upload/t_resize/v1746537855/adorable_ijgmxr.jpg",
      growth: "300%"
    },
    {
      quote: "From inventory to customer service, everything is seamless. Best investment we've made for our handcrafted business.",
      author: "Sarah Johnson",
      company: "Krafted Accessories",
      avatar: "https://res.cloudinary.com/dantj20mr/image/upload/t_resize/v1746538092/crafted_pjrybs.jpg",
      growth: "320%"
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      id="logos" 
      className="py-20 px-5 bg-gradient-to-b from-white via-gray-50 to-white"
    >
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full mb-6">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="text-purple-700 font-medium text-sm">2000+ Success Stories</span>
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <StarIconSolid key={i} className="w-3 h-3" />
              ))}
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Powering Success
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Across Every Industry
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join <span className="font-bold text-purple-600">2000+</span> businesses scaling their dreams into reality
          </p>
        </div>
        
        {/* Logos Grid - Simplified */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-20">
          {logos.map((logo, index) => (
            <div 
              key={logo.name}
              className="group relative"
              style={{
                animation: isVisible ? `fadeIn 0.8s ease-out ${index * 0.1}s both` : 'none'
              }}
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200 group-hover:scale-105">
                <div className="relative">
                  <img 
                    src={logo.src} 
                    alt={`${logo.name} logo`} 
                    className="w-16 h-16 object-cover rounded-xl mx-auto mb-3"
                  />
                  
                  {/* Growth badge */}
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    {logo.growth}
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-900 text-center text-sm">
                  {logo.name}
                </h3>
                <p className="text-xs text-gray-500 text-center mt-1">
                  {logo.category}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Testimonials - Simplified */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <StarIconSolid className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-xl">Success Stories</h3>
                <p className="text-gray-500 text-sm">Real results from real businesses</p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button 
                onClick={prevTestimonial}
                className="w-10 h-10 bg-gray-100 hover:bg-purple-500 hover:text-white rounded-xl flex items-center justify-center transition-all duration-200"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <button 
                onClick={nextTestimonial}
                className="w-10 h-10 bg-gray-100 hover:bg-purple-500 hover:text-white rounded-xl flex items-center justify-center transition-all duration-200"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="relative overflow-hidden h-48">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-500 ${
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
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.author}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="ml-4">
                      <p className="font-semibold text-gray-900">{testimonial.author}</p>
                      <p className="text-gray-500 text-sm">{testimonial.company}</p>
                    </div>
                  </div>
                  
                  <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-bold">
                    +{testimonial.growth}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`h-2 transition-all duration-300 rounded-full ${
                  index === currentTestimonial
                    ? 'w-8 bg-purple-500'
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default LogosSection;