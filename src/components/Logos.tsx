"use client"

import { useState, useEffect } from 'react';

const LogosSection = () => {
  const [hoveredLogo, setHoveredLogo] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

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

  const logos = [
    {
      id: 'korean cravings',
      name: 'Korean Cravings',
      src: "https://res.cloudinary.com/dantj20mr/image/upload/t_resize/v1746536677/cat7ylsjqgkhzj9i1wqp.jpg",
      description: "Korean food delivery service nationwide",
    },
    {
      id: 'adorable',
      name: 'Adorable',
      src: "https://res.cloudinary.com/dantj20mr/image/upload/t_resize/v1746537855/adorable_ijgmxr.jpg",
      description: "Refreshing beverage business specializing in heathly fruit juices and smoothies"
    },
    {
      id: 'krafted',
      name: 'Krafted',
      src: "https://res.cloudinary.com/dantj20mr/image/upload/t_resize/v1746538092/crafted_pjrybs.jpg",
      description: "Beautifully crafted handmade shoes, bags and accessories"
    },
    {
      id: 'shadewears',
      name: 'Shade Wears',
      src: "https://res.cloudinary.com/dantj20mr/image/upload/t_resize/v1746538868/fash_xwqits.png",
      description: "Fashion brand specializing in trendy clothing and accessories"
    },
    {
      id: 'trimfit',
      name: 'TrimFit',
      src: "https://res.cloudinary.com/dantj20mr/image/upload/t_resize/v1746539398/tea_qrynhb.jpg",
      description: "Health and wellness brand specializing in weight loss teas and supplements"
    },
    {
      id: 'bonethel',
      name: 'Bonethel',
      src: "https://res.cloudinary.com/dantj20mr/image/upload/t_resize/v1746539660/bonetel_xbog8g.jpg",
      description: "Phone cases and accessories business"
    }
  ];

  return (
    <section id="logos" className="py-20 px-5 bg-gradient-to-b from-background to-gray-50 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <p className="text-xl font-medium text-center mb-4">
            Trusted by <span className="text-secondary font-bold">2000+</span> customers nationwide
          </p>
          
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
            {logos.map((logo) => (
              <div 
                key={logo.id}
                className="relative group cursor-pointer"
                onMouseEnter={() => setHoveredLogo(logo.id as any)}
                onMouseLeave={() => setHoveredLogo(null)}
              >
                <div className={`transform transition-all duration-300 ${hoveredLogo === logo.id ? 'scale-110' : 'scale-100'}`}>
                  <img 
                    src={logo.src} 
                    alt={`${logo.name} logo`} 
                    className={`w-20 h-20 rounded-full object-cover border-2  ${hoveredLogo === logo.id ? 'opacity-100' : 'opacity-70'} group-hover:opacity-100 transition-all duration-300`}
                  />
                </div>
                
                {hoveredLogo === logo.id && (
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-md p-2 w-48 text-center z-10 text-sm transition-all duration-300">
                    <p className="font-semibold">{logo.name}</p>
                    <p className="text-xs text-gray-600">{logo.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-16 flex justify-center">
            <div className="w-full max-w-xl">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-semibold text-black-800">Success stories</p>
                  <div className="flex space-x-1">
                    <button className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center text-purple-700">
                      <span className="transform -translate-y-px">←</span>
                    </button>
                    <button className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center text-purple-700">
                      <span className="transform -translate-y-px">→</span>
                    </button>
                  </div>
                </div>
                
                <blockquote className="italic text-gray-600">
                "Zikor totally transformed my online business. Setting up my shop was so much easy, and now I can handle everything orders, payments, you name it. all in one spot."
                </blockquote>
                <div className="mt-4 flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-500">
                    B
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-sm">Bella</p>
                    <p className="text-xs text-gray-500">CEO, Korean Cravings</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogosSection;