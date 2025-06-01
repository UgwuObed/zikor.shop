"use client"

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { heroDetails } from '../data/hero';

const Hero: React.FC = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const heroRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const rect = heroRef.current?.getBoundingClientRect();
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


    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        if (heroRef.current) {
            observer.observe(heroRef.current);
        }

        return () => observer.disconnect();
    }, []);

const FloatingParticles = () => {
  const [particles, setParticles] = useState<{left: string; top: string; animationDelay: string; animationDuration: string;}[]>([]);

  useEffect(() => {
   
    const newParticles = [...Array(20)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 10}s`,
      animationDuration: `${3 + Math.random() * 4}s`,
    }));
    setParticles(newParticles);
  }, []);

  if (particles.length === 0) return null; 

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((style, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-float"
          style={style}
        />
      ))}
    </div>
  );
};


    return (
        <section
            ref={heroRef}
            id="hero"
            className="relative min-h-screen flex items-center justify-center pb-0 pt-32 md:pt-20 px-5 overflow-hidden"
        >
            {/* Enhanced Background with Multiple Layers */}
            <div className="absolute left-0 top-0 bottom-0 -z-20 w-full">
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 animate-gradient-shift"></div>
                
                {/* Dynamic grid pattern */}
                <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#8000bb08_1px,transparent_1px),linear-gradient(to_bottom,#8000bb08_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] animate-pulse-slow">
                </div>

                {/* Floating orbs */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            {/* Floating Particles */}
            <FloatingParticles />

            {/* Interactive light effect following mouse */}
            <div 
                className="absolute pointer-events-none -z-10 w-96 h-96 rounded-full bg-gradient-radial from-purple-400/20 via-transparent to-transparent blur-3xl transition-all duration-1000 ease-out"
                style={{
                    transform: `translate(${mousePosition.x * 100}px, ${mousePosition.y * 50}px)`,
                }}
            />

            {/* Bottom gradient overlay */}
            <div className="absolute left-0 right-0 bottom-0 backdrop-blur-sm h-60 bg-gradient-to-b from-transparent via-white/30 to-white/60 -z-10">
            </div>

            {/* Main Content */}
            <div className="text-center relative z-10 max-w-6xl mx-auto">
                {/* Animated heading */}
                <div className="relative">
                    <h1 className={`text-4xl md:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 max-w-lg md:max-w-4xl mx-auto leading-tight transition-all duration-1000 ${
                        isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
                    }`}
                    style={{ animationDelay: '0.2s' }}
                    >
                        {heroDetails.heading}
                    </h1>
                    
                    {/* Animated underline */}
                    <div className={`mx-auto mt-4 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent transition-all duration-1000 ${
                        isVisible ? 'w-32 opacity-100' : 'w-0 opacity-0'
                    }`}
                    style={{ animationDelay: '0.8s' }}
                    ></div>
                </div>

                {/* Animated subheading */}
                <p className={`mt-8 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed transition-all duration-1000 ${
                    isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-8'
                }`}
                style={{ animationDelay: '0.4s' }}
                >
                    {heroDetails.subheading}
                </p>

                {/* Animated CTA buttons */}
                <div className={`mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 ${
                    isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-8'
                }`}
                style={{ animationDelay: '0.6s' }}
                >
                    <button className="group relative overflow-hidden bg-gradient-to-r from-[#8000bb] to-[#a855f7] text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
                        <span className="relative z-10">Get Started Free</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#6a0094] to-[#9333ea] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </button>
                    
                    <button className="group relative bg-white/80 backdrop-blur-sm text-gray-800 px-8 py-4 rounded-full font-semibold text-lg border-2 border-gray-200 transition-all duration-300 transform hover:scale-105 hover:bg-white hover:shadow-xl hover:border-purple-300">
                        <span className="group-hover:text-purple-700 transition-colors duration-300">Watch Demo</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-pink-50 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></div>
                    </button>
                </div>

                {/* Stats or features */}
                <div className={`mt-16 flex flex-wrap justify-center gap-8 md:gap-12 transition-all duration-1000 ${
                    isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-8'
                }`}
                style={{ animationDelay: '1s' }}
                >
                    {[
                        { number: '10K+', label: 'Happy Users' },
                        { number: '99.9%', label: 'Uptime' },
                        { number: '24/7', label: 'Support' }
                    ].map((stat, index) => (
                        <div key={index} className="text-center group cursor-pointer">
                            <div className="text-2xl md:text-3xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors duration-300">
                                {stat.number}
                            </div>
                            <div className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Enhanced Image with multiple animation layers */}
                <div className={`relative mt-16 md:mt-20 transition-all duration-1000 ${
                    isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-8'
                }`}
                style={{ animationDelay: '0.8s' }}
                >
                    {/* Glowing background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-3xl blur-3xl opacity-20 transform scale-110 animate-pulse-slow"></div>
                    
                    {/* Image container with hover effects */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 transform rotate-1"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 transform -rotate-1 scale-105"></div>
                        
                        <Image
                            src={heroDetails.centerImageSrc}
                            width={500}
                            height={440}
                            quality={100}
                            sizes="(max-width: 768px) 100vw, 500px"
                            priority={true}
                            unoptimized={true}
                            alt="app mockup"
                            className="relative mx-auto z-10 rounded-2xl shadow-2xl transform transition-all duration-700 group-hover:scale-105 group-hover:-rotate-1 group-hover:shadow-purple-500/25"
                            style={{
                                transform: `perspective(1000px) rotateX(${mousePosition.y * 5}deg) rotateY(${mousePosition.x * 5}deg)`,
                            }}
                        />
                        
                        {/* Floating elements around image */}
                        <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce opacity-60"></div>
                        <div className="absolute -top-2 -right-6 w-6 h-6 bg-pink-400 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.5s' }}></div>
                        <div className="absolute -bottom-4 -left-6 w-10 h-10 bg-purple-400 rounded-full animate-bounce opacity-60" style={{ animationDelay: '1s' }}></div>
                        <div className="absolute -bottom-2 -right-4 w-7 h-7 bg-blue-400 rounded-full animate-bounce opacity-60" style={{ animationDelay: '1.5s' }}></div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 ${
                    isVisible ? 'animate-fade-in opacity-100' : 'opacity-0'
                }`}
                style={{ animationDelay: '1.2s' }}
                >
                    <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-bounce"></div>
                    </div>
                </div>
            </div>

            {/* Custom CSS for animations */}
            <style jsx>{`
                @keyframes gradient-shift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }

                @keyframes blob {
                    0%, 100% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(180deg); }
                }

                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.1; }
                    50% { opacity: 0.3; }
                }

                .animate-gradient-shift {
                    background-size: 400% 400%;
                    animation: gradient-shift 15s ease infinite;
                }

                .animate-blob {
                    animation: blob 7s infinite;
                }

                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }

                .animate-fade-in-up {
                    animation: fade-in-up 1s ease-out forwards;
                }

                .animate-fade-in {
                    animation: fade-in 1s ease-out forwards;
                }

                .animate-pulse-slow {
                    animation: pulse-slow 4s ease-in-out infinite;
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
            `}</style>
        </section>
    );
};

export default Hero;