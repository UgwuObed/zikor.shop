"use client"

import React from 'react';
import Link from 'next/link';
import { siteDetails } from '../data/siteDetails';
import { footerDetails } from '../data/footer';
import { getPlatformIconByName } from '../utils';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-200/50">
            <div className="max-w-7xl w-full mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    
                    {/* Logo Section */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-3 group">
                            <svg 
                                version="1.0" 
                                xmlns="http://www.w3.org/2000/svg"
                                width="60"  
                                height="60" 
                                viewBox="0 0 500 500"
                                preserveAspectRatio="xMidYMid meet"
                                className="text-[#8000bb] group-hover:scale-105 transition-transform duration-300"
                            >
                                <g 
                                    transform="translate(0,500) scale(0.1,-0.1)"
                                    fill="currentColor"
                                    stroke="none"
                                >
                                    <path d="M2325 3765 c-444 -71 -840 -356 -1043 -752 -123 -240 -169 -450 -159 -720 11 -279 89 -517 243 -745 264 -390 711 -628 1179 -628 406 0 821 187 1077 485 361 422 455 984 248 1491 -191 468 -615 796 -1127 873 -94 14 -317 12 -418 -4z m773 -716 c82 -40 121 -137 88 -222 -13 -34 -81 -103 -360 -367 -189 -179 -343 -329 -342 -333 1 -5 190 -89 421 -188 455 -195 472 -205 495 -288 20 -77 -26 -178 -96 -207 -74 -31 -86 -27 -667 223 -303 131 -565 247 -581 258 -36 23 -76 97 -76 138 0 76 30 112 316 382 l275 260 -389 5 -389 5 -42 28 c-93 62 -108 202 -30 274 60 55 34 53 708 53 616 0 625 0 669 -21z"/>
                                </g>
                            </svg>
                            <span className="manrope text-2xl font-bold text-[#8000bb] group-hover:text-purple-600 transition-colors duration-300">
                                {siteDetails.siteName}
                            </span>
                        </Link>
                        
                        <p className="text-gray-600 leading-relaxed max-w-sm">
                            {footerDetails.subheading}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h4 className="text-lg font-semibold text-gray-900">Quick Links</h4>
                        <ul className="space-y-3">
                            {footerDetails.quickLinks.map(link => (
                                <li key={link.text}>
                                    <Link 
                                        href={link.url} 
                                        className="text-gray-600 hover:text-[#8000bb] transition-colors duration-300 flex items-center gap-2 group"
                                    >
                                        <span className="w-1.5 h-1.5 bg-[#8000bb] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                        {link.text}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-6">
                        <h4 className="text-lg font-semibold text-gray-900">Contact Us</h4>
                        
                        <div className="space-y-4">
                            {footerDetails.email && (
                                <a 
                                    href={`mailto:${footerDetails.email}`}  
                                    className="block text-gray-600 hover:text-[#8000bb] transition-colors duration-300"
                                >
                                    Email: {footerDetails.email}
                                </a>
                            )}

                            {footerDetails.telephone && (
                                <a 
                                    href={`tel:${footerDetails.telephone}`} 
                                    className="block text-gray-600 hover:text-[#8000bb] transition-colors duration-300"
                                >
                                    Phone: {footerDetails.telephone}
                                </a>
                            )}
                        </div>

                        {footerDetails.socials && (
                            <div className="space-y-4">
                                <h5 className="font-medium text-gray-900">Follow Us</h5>
                                <div className="flex items-center gap-4 flex-wrap">
                                    {Object.keys(footerDetails.socials).map(platformName => {
                                        if (platformName && footerDetails.socials[platformName]) {
                                            return (
                                                <Link
                                                    href={footerDetails.socials[platformName]}
                                                    key={platformName}
                                                    aria-label={platformName}
                                                    className="w-10 h-10 bg-gray-100 hover:bg-[#8000bb] rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                                                >
                                                    <span className="text-gray-600 group-hover:text-white transition-colors duration-300">
                                                        {getPlatformIconByName(platformName)}
                                                    </span>
                                                </Link>
                                            );
                                        }
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-600 text-center md:text-left">
                            Copyright &copy; {new Date().getFullYear()} {siteDetails.siteName}. All rights reserved.
                        </p>
                        
                        <div className="flex items-center gap-6">
                            <Link href="/privacy" className="text-gray-600 hover:text-[#8000bb] transition-colors duration-300 text-sm">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="text-gray-600 hover:text-[#8000bb] transition-colors duration-300 text-sm">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;