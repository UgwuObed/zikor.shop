"use client"

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { heroDetails } from '../data/hero';

interface HeroProps {
  className?: string; 
}

const Hero: React.FC<HeroProps> = ({ className }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const [scrollY, setScrollY] = useState(0);
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

        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
        };
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

    const FloatingElements = () => {
        const [elements, setElements] = useState<Array<{
            id: number;
            left: string;
            top: string;
            animationDelay: string;
            animationDuration: string;
            size: string;
            color: string;
        }>>([]);

        useEffect(() => {
            const colors = ['from-purple-400 to-pink-400', 'from-blue-400 to-purple-400', 'from-pink-400 to-red-400', 'from-indigo-400 to-purple-400'];
            const sizes = ['w-2 h-2', 'w-3 h-3', 'w-1 h-1', 'w-4 h-4'];
            
            const newElements = [...Array(25)].map((_, i) => ({
                id: i,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${10 + Math.random() * 20}s`,
                size: sizes[Math.floor(Math.random() * sizes.length)],
                color: colors[Math.floor(Math.random() * colors.length)],
            }));
            setElements(newElements);
        }, []);

        return (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {elements.map((element) => (
                    <div
                        key={element.id}
                        className={`absolute ${element.size} bg-gradient-to-r ${element.color} rounded-full opacity-20 animate-float-complex`}
                        style={{
                            left: element.left,
                            top: element.top,
                            animationDelay: element.animationDelay,
                            animationDuration: element.animationDuration,
                        }}
                    />
                ))}
            </div>
        );
    };

    const TrustedByLogos = () => (
        <div className="flex items-center justify-center gap-8 opacity-60 mt-12">
            <div className="text-sm text-gray-500 font-medium">Trusted by</div>
            {['Songdis', 'Korean Kravings', 'Queridas', 'Payaza'].map((brand, index) => (
                <div key={brand} className="font-semibold text-gray-400 hover:text-purple-600 transition-colors duration-300 cursor-pointer">
                    {brand}
                </div>
            ))}
        </div>
    );

    return (
        <section
        ref={heroRef}
        id="hero"
        className="relative z-0 min-h-screen flex items-center justify-center top-3 pt-32 md:pt-20 px-5 overflow-hidden"
        >
            <div 
                className="absolute left-0 top-0 bottom-0 -z-20 w-full"
                style={{ transform: `translateY(${scrollY * 0.1}px)` }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50 animate-gradient-shift"></div>
                
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/50 via-transparent to-purple-50/50 animate-gradient-shift-reverse"></div>
                
                <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#8000bb08_1px,transparent_1px),linear-gradient(to_bottom,#8000bb08_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_40%,#000_70%,transparent_100%)] animate-grid-float">
                </div>
            </div>

            <div 
                className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-purple-300/30 to-pink-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow backdrop-blur-sm -z-10"
                style={{ transform: `translateY(${scrollY * 0.15}px)` }}
            ></div>
            <div 
                className="absolute top-40 right-10 w-80 h-80 bg-gradient-to-br from-blue-300/30 to-purple-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow animation-delay-4000 backdrop-blur-sm -z-10"
                style={{ transform: `translateY(${scrollY * 0.08}px)` }}
            ></div>
            <div 
                className="absolute -bottom-20 left-20 w-72 h-72 bg-gradient-to-br from-pink-300/30 to-red-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow animation-delay-8000 backdrop-blur-sm -z-10"
                style={{ transform: `translateY(${scrollY * 0.12}px)` }}
            ></div>
            <div 
                className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-br from-indigo-300/30 to-purple-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow animation-delay-6000 backdrop-blur-sm -z-10"
                style={{ transform: `translateY(${scrollY * 0.05}px)` }}
            ></div>

            <FloatingElements />

            <div 
                className="absolute pointer-events-none -z-10 w-[600px] h-[600px] rounded-full bg-gradient-radial from-purple-400/30 via-pink-400/10 to-transparent blur-3xl transition-all duration-1000 ease-out"
                style={{
                    transform: `translate(${mousePosition.x * 150}px, ${mousePosition.y * 100}px) scale(${1 + Math.abs(mousePosition.x) * 0.2})`,
                }}
            />

            <div 
                className="absolute pointer-events-none -z-10 w-96 h-96 rounded-full bg-gradient-radial from-blue-400/20 via-transparent to-transparent blur-2xl transition-all duration-500 ease-out"
                style={{
                    transform: `translate(${-mousePosition.x * 80}px, ${-mousePosition.y * 60}px)`,
                }}
            />

            {/* Enhanced bottom gradient */}
            <div className="absolute left-0 right-0 bottom-0 backdrop-blur-sm h-80 bg-gradient-to-b from-transparent via-white/40 to-white/80 -z-10">
            </div>

            {/* Main Content Container */}
            <div className="text-center relative z-10 max-w-7xl mx-auto">
                {/* Premium Badge */}
                <div className={`inline-flex items-center gap-2 bg-white/60 backdrop-blur-xl border border-purple-200/50 text-purple-700 px-6 py-3 rounded-full text-sm font-medium mb-8 shadow-lg hover:shadow-xl transition-all duration-500 ${
                    isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-8'
                }`}
                style={{ animationDelay: '0.1s' }}>
                    <span className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></span>
                    🚀 New: AI-Powered Store Builder
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </div>

                {/* Enhanced Main Heading */}
                <div className="relative mb-8">
                    <h1 className={`text-5xl md:text-7xl lg:text-8xl font-bold max-w-5xl mx-auto leading-tight transition-all duration-1000 ${
                        isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'
                    }`}
                    style={{ animationDelay: '0.3s' }}>
                        <span className="relative inline-block">
                            <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent animate-gradient-text">
                                {heroDetails.heading.split(' ').slice(0, -1).join(' ')}
                            </span>
                            
                            {/* Animated highlight for last word */}
                            <span className="relative ml-4">
                                <span className="bg-gradient-to-r from-[#8000bb] via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-text">
                                    {heroDetails.heading.split(' ').slice(-1)}
                                </span>
                                
                                {/* Decorative elements */}
                                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-60 animate-bounce-slow"></div>
                                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-40 animate-pulse-slow"></div>
                            </span>
                        </span>
                    </h1>
                    
                    {/* Enhanced animated underline */}
                    <div className={`mx-auto mt-6 h-1.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent transition-all duration-1000 rounded-full ${
                        isVisible ? 'w-40 opacity-100' : 'w-0 opacity-0'
                    }`}
                    style={{ animationDelay: '0.8s' }}>
                        <div className="h-full bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 rounded-full animate-shimmer"></div>
                    </div>
                </div>

                {/* Enhanced subheading */}
                <p className={`mt-8 text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light transition-all duration-1000 ${
                    isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-8'
                }`}
                style={{ animationDelay: '0.5s' }}>
                    <span className="relative">
                        {heroDetails.subheading}
                        <span className="absolute -top-1 -right-8 text-2xl animate-bounce-slow">✨</span>
                    </span>
                </p>

                {/* Enhanced CTA buttons */}
                <div className={`mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 transition-all duration-1000 ${
                    isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-8'
                }`}
                style={{ animationDelay: '0.7s' }}>
                    {/* Primary CTA */}
                    <button className="group relative overflow-hidden bg-gradient-to-r from-[#8000bb] via-purple-600 to-[#8000bb] text-white px-10 py-5 rounded-2xl font-semibold text-lg transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 bg-size-200 hover:bg-right">
                        <span className="relative z-10 flex items-center gap-3">
                            Start Building Free
                            <div className="relative">
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                                <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500"></div>
                            </div>
                        </span>
                        
                        {/* Enhanced shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10 scale-110"></div>
                    </button>
                    
                    {/* Secondary CTA */}
                    <button className="group relative bg-white/80 backdrop-blur-xl text-gray-800 px-10 py-5 rounded-2xl font-semibold text-lg border-2 border-gray-200/50 transition-all duration-500 transform hover:scale-105 hover:bg-white hover:shadow-xl hover:border-purple-300/50 hover:text-purple-700">
                        <span className="flex items-center gap-3">
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h2m4 0h2" />
                            </svg>
                            Watch Demo
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl transform scale-0 group-hover:scale-100 transition-transform duration-500 -z-10"></div>
                    </button>
                </div>

                {/* Trusted by section */}
                <div className={`transition-all duration-1000 ${
                    isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-8'
                }`}
                style={{ animationDelay: '0.9s' }}>
                    <TrustedByLogos />
                </div>

                {/* Enhanced Stats */}
                <div className={`mt-20 grid grid-cols-3 gap-8 md:gap-16 max-w-2xl mx-auto transition-all duration-1000 ${
                    isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-8'
                }`}
                style={{ animationDelay: '1.1s' }}>
                    {[
                        { number: '50K+', label: 'Active Stores', icon: '🏪' },
                        { number: '99.9%', label: 'Uptime SLA', icon: '⚡' },
                        { number: '$2.5B+', label: 'Sales Volume', icon: '💰' }
                    ].map((stat, index) => (
                        <div key={index} className="text-center group cursor-pointer relative">
                            <div className="relative bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-purple-100/50 hover:border-purple-300/50 transition-all duration-500 hover:shadow-lg hover:-translate-y-1">
                                <div className="text-2xl mb-2">{stat.icon}</div>
                                <div className="text-2xl md:text-3xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors duration-300 mb-1">
                                    {stat.number}
                                </div>
                                <div className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300 font-medium">
                                    {stat.label}
                                </div>
                                
                                {/* Hover glow */}
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Enhanced Hero Image with subtle parallax */}
                <div 
                    className={`relative mt-20 md:mt-24 transition-all duration-1000 ${
                        isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-8'
                    }`}
                    style={{ 
                        animationDelay: '1.3s',
                        transform: `translateY(${scrollY * 0.03}px)`
                    }}
                >
                    {/* Multiple layered glowing backgrounds */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-3xl blur-3xl opacity-20 transform scale-110 animate-pulse-glow"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-3xl blur-2xl opacity-15 transform scale-105 animate-pulse-glow animation-delay-2000"></div>
                    
                    {/* Image container with enhanced effects */}
                    <div className="relative group perspective-1000">
                        {/* Background decoration layers */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 transform rotate-1 scale-105"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 transform -rotate-1 scale-110"></div>
                        
                        {/* Main image with enhanced interactions */}
                        <div className="relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
                            <Image
                                src={heroDetails.centerImageSrc}
                                width={600}
                                height={440}
                                quality={100}
                                sizes="(max-width: 768px) 100vw, 600px"
                                priority={true}
                                unoptimized={true}
                                alt="app mockup"
                                className="relative mx-auto z-10 transform transition-all duration-700 group-hover:scale-105"
                                style={{
                                    transform: `perspective(1000px) rotateX(${mousePosition.y * 3}deg) rotateY(${mousePosition.x * 3}deg) translateZ(0)`,
                                }}
                            />
                            
                            {/* Image overlay effects */}
                            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                        
                        {/* Enhanced floating elements around image */}
                        <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-float opacity-70 shadow-lg"></div>
                        <div className="absolute -top-4 -right-8 w-8 h-8 bg-gradient-to-r from-pink-400 to-red-400 rounded-full animate-float opacity-70 shadow-lg" style={{ animationDelay: '0.5s' }}></div>
                        <div className="absolute -bottom-6 -left-8 w-14 h-14 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full animate-float opacity-70 shadow-lg" style={{ animationDelay: '1s' }}></div>
                        <div className="absolute -bottom-4 -right-6 w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-float opacity-70 shadow-lg" style={{ animationDelay: '1.5s' }}></div>
                        
                        {/* Corner decorations */}
                        <div className="absolute top-4 left-4 w-3 h-3 bg-white/60 rounded-full animate-ping"></div>
                        <div className="absolute top-4 right-4 w-2 h-2 bg-purple-400/60 rounded-full animate-pulse"></div>
                        <div className="absolute bottom-4 left-4 w-2 h-2 bg-pink-400/60 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                        <div className="absolute bottom-4 right-4 w-3 h-3 bg-blue-400/60 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                    </div>
                </div>

                {/* Enhanced scroll indicator */}
                <div className={`absolute bottom-12 left-1/2 transform -translate-x-1/2 transition-all duration-1000 ${
                    isVisible ? 'animate-fade-in opacity-100' : 'opacity-0'
                }`}
                style={{ animationDelay: '1.5s' }}>
                    <div className="flex flex-col items-center gap-2 group cursor-pointer">
                        <div className="text-sm text-gray-500 font-medium group-hover:text-purple-600 transition-colors duration-300">Scroll to explore</div>
                        <div className="w-6 h-10 border-2 border-gray-400 group-hover:border-purple-400 rounded-full flex justify-center transition-colors duration-300">
                            <div className="w-1 h-3 bg-gray-400 group-hover:bg-purple-400 rounded-full mt-2 animate-bounce transition-colors duration-300"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Custom CSS */}
            <style jsx>{`
                @keyframes gradient-shift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }

                @keyframes gradient-shift-reverse {
                    0%, 100% { background-position: 100% 50%; }
                    50% { background-position: 0% 50%; }
                }

                @keyframes float-slow {
                    0%, 100% { transform: translate(0px, 0px) scale(1) rotate(0deg); }
                    25% { transform: translate(20px, -30px) scale(1.05) rotate(1deg); }
                    50% { transform: translate(-15px, -20px) scale(0.95) rotate(-1deg); }
                    75% { transform: translate(-25px, 10px) scale(1.02) rotate(0.5deg); }
                }

                @keyframes float-complex {
                    0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
                    25% { transform: translateY(-20px) rotate(90deg) scale(1.1); }
                    50% { transform: translateY(-40px) rotate(180deg) scale(0.9); }
                    75% { transform: translateY(-20px) rotate(270deg) scale(1.05); }
                }

                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(40px);
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

                @keyframes pulse-glow {
                    0%, 100% { opacity: 0.1; transform: scale(1); }
                    50% { opacity: 0.3; transform: scale(1.05); }
                }

                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }

                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 0.8; }
                }

                @keyframes gradient-text {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }

                @keyframes shimmer {
                    0% { background-position: -100% 0; }
                    100% { background-position: 100% 0; }
                }

                @keyframes grid-float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-5px); }
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(180deg); }
                }

                .animate-gradient-shift {
                    background-size: 400% 400%;
                    animation: gradient-shift 20s ease infinite;
                }

                .animate-gradient-shift-reverse {
                    background-size: 400% 400%;
                    animation: gradient-shift-reverse 25s ease infinite;
                }

                .animate-float-slow {
                    animation: float-slow 8s ease-in-out infinite;
                }

                .animate-float-complex {
                    animation: float-complex 15s ease-in-out infinite;
                }

                .animate-fade-in-up {
                    animation: fade-in-up 1s ease-out forwards;
                }

                .animate-fade-in {
                    animation: fade-in 1s ease-out forwards;
                }

                .animate-pulse-glow {
                    animation: pulse-glow 6s ease-in-out infinite;
                }

                .animate-bounce-slow {
                    animation: bounce-slow 3s ease-in-out infinite;
                }

                .animate-pulse-slow {
                    animation: pulse-slow 4s ease-in-out infinite;
                }

                .animate-gradient-text {
                    background-size: 200% 200%;
                    animation: gradient-text 3s ease infinite;
                }

                .animate-shimmer {
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                    background-size: 200% 100%;
                    animation: shimmer 2s infinite;
                }

                .animate-grid-float {
                    animation: grid-float 6s ease-in-out infinite;
                }

                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }

                .animation-delay-2000 {
                    animation-delay: 2s;
                }

                .animation-delay-4000 {
                    animation-delay: 4s;
                }

                .animation-delay-6000 {
                    animation-delay: 6s;
                }

                .animation-delay-8000 {
                    animation-delay: 8s;
                }

                .bg-gradient-radial {
                    background: radial-gradient(circle, var(--tw-gradient-stops));
                }

                .bg-size-200 {
                    background-size: 200% 100%;
                
                .hover\\:bg-right:hover {
                    background-position: right center;
                }

                .perspective-1000 {
                    perspective: 1000px;
                }
            `}</style>
        </section>
    );
};

export default Hero;