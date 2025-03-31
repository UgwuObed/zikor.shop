import Link from 'next/link';
import React from 'react';
import { siteDetails } from '../data/siteDetails';
import { footerDetails } from '../data/footer';
import { getPlatformIconByName } from '../utils';

const Footer: React.FC = () => {
    return (
        <footer className="bg-hero-background text-foreground py-10">
            <div className="max-w-7xl w-full mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
                <div>
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
                        <span className="manrope text-xl font-semibold text-[#8000bb] cursor-pointer">
                            {siteDetails.siteName}
                        </span>
                        </Link>
                    <p className="mt-3.5 text-foreground-accent">
                        {footerDetails.subheading}
                    </p>
                </div>
                <div>
                    <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                    <ul className="text-foreground-accent">
                        {footerDetails.quickLinks.map(link => (
                            <li key={link.text} className="mb-2">
                                <Link href={link.url} className="hover:text-foreground">{link.text}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="text-lg font-semibold mb-4">Contact Us</h4>

                    {footerDetails.email && <a href={`mailto:${footerDetails.email}`}  className="block text-foreground-accent hover:text-foreground">Email: {footerDetails.email}</a>}

                    {footerDetails.telephone && <a href={`tel:${footerDetails.telephone}`} className="block text-foreground-accent hover:text-foreground">Phone: {footerDetails.telephone}</a>}

                    {footerDetails.socials && (
                        <div className="mt-5 flex items-center gap-5 flex-wrap">
                            {Object.keys(footerDetails.socials).map(platformName => {
                                if (platformName && footerDetails.socials[platformName]) {
                                    return (
                                        <Link
                                            href={footerDetails.socials[platformName]}
                                            key={platformName}
                                            aria-label={platformName}
                                        >
                                            {getPlatformIconByName(platformName)}
                                        </Link>
                                    )
                                }
                            })}
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-8 md:text-center text-foreground-accent px-6">
                <p>Copyright &copy; {new Date().getFullYear()} {siteDetails.siteName}. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
