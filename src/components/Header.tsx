'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { Transition } from '@headlessui/react';
import { HiOutlineXMark, HiBars3 } from 'react-icons/hi2';
// import { FaFingerprint } from 'react-icons/fa';

import Container from './Container';
// import { siteDetails } from '@/data/siteDetails';
import { menuItems } from '../data/menuItems';

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="bg-transparent fixed top-0 left-0 right-0 md:absolute z-50 mx-auto w-full">
            <Container className="!px-0">
                <nav className="shadow-md md:shadow-none bg-white md:bg-transparent mx-auto flex justify-between items-center py-2 px-5 md:py-10">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        <svg 
                            version="1.0" 
                            xmlns="http://www.w3.org/2000/svg"
                            width="60"  
                            height="60" 
                            viewBox="0 0 500 500"
                            preserveAspectRatio="xMidYMid meet"
                            className="text-[#8000bb]"
                        >
                            <g 
                            transform="translate(0,500) scale(0.1,-0.1)"
                            fill="currentColor"
                            stroke="none"
                            >
                            <path d="M2325 3765 c-444 -71 -840 -356 -1043 -752 -123 -240 -169 -450 -159 -720 11 -279 89 -517 243 -745 264 -390 711 -628 1179 -628 406 0 821 187 1077 485 361 422 455 984 248 1491 -191 468 -615 796 -1127 873 -94 14 -317 12 -418 -4z m773 -716 c82 -40 121 -137 88 -222 -13 -34 -81 -103 -360 -367 -189 -179 -343 -329 -342 -333 1 -5 190 -89 421 -188 455 -195 472 -205 495 -288 20 -77 -26 -178 -96 -207 -74 -31 -86 -27 -667 223 -303 131 -565 247 -581 258 -36 23 -76 97 -76 138 0 76 30 112 316 382 l275 260 -389 5 -389 5 -42 28 c-93 62 -108 202 -30 274 60 55 34 53 708 53 616 0 625 0 669 -21z"/>
                            </g>
                        </svg>
                        {/* <span className="manrope text-xl font-semibold text-[#8000bb] cursor-pointer">
                            {siteDetails.siteName}
                        </span> */}
                        </Link>

                    {/* Desktop Menu */}
                    <ul className="hidden md:flex space-x-6">
                        {menuItems.map(item => (
                            <li key={item.text}>
                                <Link href={item.url} className="text-foreground hover:text-foreground-accent transition-colors">
                                    {item.text}
                                </Link>
                            </li>
                        ))}
                        <li>
                        <Link 
                                href="/auth/signup" 
                                className="text-white bg-[#8000bb] hover:bg-[#6a0094] px-8 py-3 rounded-full transition-colors">
                                Register
                            </Link>
                        </li>
                    </ul>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            type="button"
                            className="bg-primary text-black focus:outline-none rounded-full w-10 h-10 flex items-center justify-center"
                            aria-controls="mobile-menu"
                            aria-expanded={isOpen}
                        >
                            {isOpen ? (
                                <HiOutlineXMark className="h-6 w-6" aria-hidden="true" />
                            ) : (
                                <HiBars3 className="h-6 w-6" aria-hidden="true" />
                            )}
                            <span className="sr-only">Toggle navigation</span>
                        </button>
                    </div>
                </nav>
            </Container>

            {/* Mobile Menu with Transition */}
            <Transition
                show={isOpen}
                enter="transition ease-out duration-200 transform"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-75 transform"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <div id="mobile-menu" className="md:hidden bg-white shadow-lg">
                    <ul className="flex flex-col space-y-4 pt-1 pb-6 px-6">
                        {menuItems.map(item => (
                            <li key={item.text}>
                                <Link href={item.url} className="text-foreground hover:text-primary block" onClick={toggleMenu}>
                                    {item.text}
                                </Link>
                            </li>
                        ))}
                        <li>
                            <Link href="/auth/signup" className="text-black bg-primary hover:bg-primary-accent px-5 py-2 rounded-full block w-fit" onClick={toggleMenu}>
                                Get Started
                            </Link>
                        </li>
                    </ul>
                </div>
            </Transition>
        </header>
    );
};

export default Header;
