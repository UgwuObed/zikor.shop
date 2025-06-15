'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import { HiOutlineXMark, HiBars3 } from 'react-icons/hi2';
import Container from './Container';
import { menuItems } from '../data/menuItems';

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 mx-auto w-full transition-all duration-500 ease-out ${
                scrolled 
                    ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-purple-500/10 border-b border-purple-100/20' 
                    : 'bg-transparent'
            }`}>
                <Container className="!px-0">
                    <nav className={`mx-auto flex justify-between items-center transition-all duration-500 ease-out ${
                        scrolled ? 'py-3 px-5' : 'py-6 px-5 md:py-10'
                    }`}>
                        {/* Enhanced Logo */}
                        <Link href="/" className="group flex items-center gap-3 relative">
                            <div className="relative">
                                {/* Glowing background effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-lg opacity-0 group-hover:opacity-20 transition-all duration-500 scale-110"></div>
                                
                                <div className="relative bg-gradient-to-br from-white to-purple-50 p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 border border-purple-100/50">
                                    <svg 
                                        version="1.0" 
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="40"  
                                        height="40" 
                                        viewBox="0 0 500 500"
                                        preserveAspectRatio="xMidYMid meet"
                                        className="text-[#8000bb] group-hover:scale-110 transition-transform duration-300"
                                    >
                                        <g 
                                        transform="translate(0,500) scale(0.1,-0.1)"
                                        fill="currentColor"
                                        stroke="none"
                                        >
                                        <path d="M2325 3765 c-444 -71 -840 -356 -1043 -752 -123 -240 -169 -450 -159 -720 11 -279 89 -517 243 -745 264 -390 711 -628 1179 -628 406 0 821 187 1077 485 361 422 455 984 248 1491 -191 468 -615 796 -1127 873 -94 14 -317 12 -418 -4z m773 -716 c82 -40 121 -137 88 -222 -13 -34 -81 -103 -360 -367 -189 -179 -343 -329 -342 -333 1 -5 190 -89 421 -188 455 -195 472 -205 495 -288 20 -77 -26 -178 -96 -207 -74 -31 -86 -27 -667 223 -303 131 -565 247 -581 258 -36 23 -76 97 -76 138 0 76 30 112 316 382 l275 260 -389 5 -389 5 -42 28 c-93 62 -108 202 -30 274 60 55 34 53 708 53 616 0 625 0 669 -21z"/>
                                        </g>
                                    </svg>
                                </div>

                                {/* Floating particles around logo */}
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-60 group-hover:animate-ping"></div>
                                <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-40 group-hover:animate-pulse"></div>
                            </div>

                            {/* Brand name with enhanced typography */}
                            <div className="hidden sm:block">
                                <span className="text-xl font-bold bg-gradient-to-r from-[#8000bb] via-purple-600 to-[#8000bb] bg-clip-text text-transparent group-hover:from-purple-600 group-hover:via-pink-600 group-hover:to-purple-600 transition-all duration-300">
                                    Zikor
                                </span>
                                <div className="text-xs text-gray-500 font-medium -mt-1">Sell Better</div>
                            </div>
                        </Link>

                        {/* Enhanced Desktop Menu */}
                        <ul className="hidden md:flex items-center space-x-8">
                            {menuItems.map((item, index) => (
                                <li key={item.text} className="relative group">
                                    <Link 
                                        href={item.url} 
                                        className="relative text-gray-700 font-medium hover:text-[#8000bb] transition-all duration-300 py-2 px-3 rounded-lg hover:bg-purple-50/50"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        {item.text}
                                        
                                        {/* Animated underline */}
                                        <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-[#8000bb] to-purple-400 group-hover:w-full group-hover:left-0 transition-all duration-300 rounded-full"></span>
                                        
                                        {/* Hover glow effect */}
                                        <span className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/5 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg blur-sm"></span>
                                    </Link>
                                </li>
                            ))}
                            
                            {/* Enhanced CTA Button */}
                            <li>
                                <Link 
                                    href="/auth/signup" 
                                    className="group relative overflow-hidden bg-gradient-to-r from-[#8000bb] via-purple-600 to-[#8000bb] text-black px-6 py-3 rounded-full  text-sm transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105 bg-size-200 hover:bg-right"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        Get Started
                                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </span>
                                    
                                    {/* Shimmer effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                </Link>
                            </li>
                        </ul>

                        {/* Enhanced Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={toggleMenu}
                                type="button"
                                className={`relative bg-white/80 backdrop-blur-sm text-[#8000bb] focus:outline-none rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 border-2 ${
                                    isOpen ? 'border-purple-300 shadow-lg' : 'border-purple-100 hover:border-purple-200'
                                } hover:shadow-lg hover:scale-105`}
                                aria-controls="mobile-menu"
                                aria-expanded={isOpen}
                            >
                                <div className="relative">
                                    {isOpen ? (
                                        <HiOutlineXMark className="h-6 w-6 transition-transform duration-300 rotate-90" aria-hidden="true" />
                                    ) : (
                                        <HiBars3 className="h-6 w-6 transition-transform duration-300" aria-hidden="true" />
                                    )}
                                </div>
                                <span className="sr-only">Toggle navigation</span>
                                
                                {/* Button glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-0 hover:opacity-10 transition-opacity duration-300 blur-sm"></div>
                            </button>
                        </div>
                    </nav>
                </Container>

                {/* Enhanced Mobile Menu */}
                <Transition
                    show={isOpen}
                    enter="transition ease-out duration-300 transform"
                    enterFrom="opacity-0 scale-95 -translate-y-4"
                    enterTo="opacity-100 scale-100 translate-y-0"
                    leave="transition ease-in duration-200 transform"
                    leaveFrom="opacity-100 scale-100 translate-y-0"
                    leaveTo="opacity-0 scale-95 -translate-y-4"
                >
                    <div id="mobile-menu" className="md:hidden bg-white/95 backdrop-blur-xl shadow-2xl border-t border-purple-100/20">
                        <div className="relative">
                            {/* Background decoration */}
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-pink-50/50"></div>
                            
                            <ul className="relative flex flex-col space-y-2 pt-4 pb-6 px-6">
                                {menuItems.map((item, index) => (
                                    <li key={item.text}>
                                        <Link 
                                            href={item.url} 
                                            className="flex items-center justify-between text-gray-700 hover:text-[#8000bb] hover:bg-purple-50/50 py-3 px-4 rounded-xl transition-all duration-300 font-medium group"
                                            onClick={toggleMenu}
                                            style={{ animationDelay: `${index * 0.1}s` }}
                                        >
                                            <span>{item.text}</span>
                                            <svg className="w-4 h-4 text-gray-400 group-hover:text-[#8000bb] group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </li>
                                ))}
                                
                                <li className="pt-4 border-t border-purple-100/30">
                                    <Link 
                                        href="/auth/signup" 
                                        className="group relative overflow-hidden bg-gradient-to-r from-[#8000bb] to-purple-600 text-white font-semibold py-4 px-6 rounded-xl block text-center transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
                                        onClick={toggleMenu}
                                    >
                                        <span className="relative z-10">Get Started Free</span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </Transition>
            </header>

            {/* Custom Styles */}
            <style jsx>{`
                .bg-size-200 {
                    background-size: 200% 100%;
                }
                
                .hover\\:bg-right:hover {
                    background-position: right center;
                }
            `}</style>
        </>
    );
};

export default Header;