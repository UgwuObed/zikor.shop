"use client"

import React, { useState, useEffect } from 'react';
import clsx from "clsx";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { FiStar, FiArrowRight, FiTrendingUp, FiZap } from "react-icons/fi";

import { IPricing } from "../../types";

interface Props {
    tier: IPricing;
    highlight?: boolean;
    isVisible?: boolean;
    animationDelay?: number;
}

const PricingColumn: React.FC<Props> = ({ tier, highlight, isVisible = false, animationDelay = 0 }: Props) => {
    const [isHovered, setIsHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const { name, price, features, popular } = tier;

    const isPopular = highlight || popular;
    const isFree = typeof price === 'number' && price === 0;

 
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const card = document.getElementById(`pricing-card-${name}`);
            const rect = card?.getBoundingClientRect();
            if (rect) {
                setMousePosition({
                    x: (e.clientX - rect.left - rect.width / 2) / rect.width,
                    y: (e.clientY - rect.top - rect.height / 2) / rect.height,
                });
            }
        };

        if (isHovered) {
            window.addEventListener('mousemove', handleMouseMove);
        }

        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isHovered, name]);

    const formatPrice = (price: number | string) => {
        if (typeof price === 'number') {
            if (price === 0) return 'Free';
            return `₦${price.toLocaleString()}`;
        }
        return price;
    };

    const getPlanIcon = () => {
        if (isFree) return <FiStar className="w-5 h-5" />;
        if (isPopular) return <FiZap className="w-5 h-5" />;
        return <FiTrendingUp className="w-5 h-5" />;
    };

    const getPlanColor = () => {
        if (isFree) return 'from-gray-500 to-gray-600';
        if (isPopular) return 'from-[#8000bb] to-purple-600';
        return 'from-blue-500 to-indigo-600';
    };

    return (
        <div
            id={`pricing-card-${name}`}
            className={clsx(
                "relative w-full max-w-sm mx-auto lg:max-w-full group perspective-1000 transition-all duration-1000",
                {
                    "opacity-100 translate-y-0": isVisible,
                    "opacity-0 translate-y-10": !isVisible,
                }
            )}
            style={{ animationDelay: `${animationDelay}ms` }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Popular badge */}
            {isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="bg-gradient-to-r from-[#8000bb] to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse-badge">
                        <span className="flex items-center gap-2">
                            <FiStar className="w-4 h-4" />
                            Most Popular
                        </span>
                    </div>
                </div>
            )}

            {/* Glow effects */}
            <div className={clsx(
                "absolute inset-0 rounded-3xl blur-2xl transition-all duration-700 -z-10",
                {
                    "bg-gradient-to-r from-purple-400/30 to-pink-400/30 opacity-0 group-hover:opacity-60": isPopular,
                    "bg-gradient-to-r from-blue-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-40": !isPopular && !isFree,
                    "bg-gradient-to-r from-gray-400/20 to-gray-500/20 opacity-0 group-hover:opacity-30": isFree,
                }
            )}></div>

            {/* Main card */}
            <div
                className={clsx(
                    "relative bg-white/80 backdrop-blur-xl rounded-3xl border transition-all duration-700 overflow-hidden h-full",
                    {
                        "border-purple-200/50 shadow-2xl shadow-purple-500/10 scale-105 lg:scale-110": isPopular,
                        "border-gray-200/50 shadow-xl hover:shadow-2xl hover:scale-105": !isPopular,
                        "group-hover:border-purple-300/50": isPopular,
                        "group-hover:border-blue-300/50": !isPopular && !isFree,
                        "group-hover:border-gray-300/50": isFree,
                    }
                )}
                style={{
                    transform: isHovered
                        ? `perspective(1000px) rotateY(${mousePosition.x * 3}deg) rotateX(${-mousePosition.y * 3}deg) translateZ(20px)`
                        : 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px)',
                }}
            >
                {/* Animated background gradient */}
                <div className={clsx(
                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                    {
                        "bg-gradient-to-br from-purple-50/50 via-white/30 to-pink-50/50": isPopular,
                        "bg-gradient-to-br from-blue-50/50 via-white/30 to-indigo-50/50": !isPopular && !isFree,
                        "bg-gradient-to-br from-gray-50/50 via-white/30 to-gray-100/50": isFree,
                    }
                )}></div>

                {/* Top gradient border */}
                <div className={clsx(
                    "absolute top-0 left-0 w-full h-1 animate-shimmer rounded-t-3xl",
                    {
                        "bg-gradient-to-r from-[#8000bb] via-purple-600 to-pink-600": isPopular,
                        "bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600": !isPopular && !isFree,
                        "bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600": isFree,
                    }
                )}></div>

                {/* Header section */}
                <div className="relative p-8 border-b border-gray-200/50">
                    {/* Plan name with icon */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className={clsx(
                            "w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300",
                            `bg-gradient-to-r ${getPlanColor()}`
                        )}>
                            {getPlanIcon()}
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors duration-300">
                            {name}
                        </h3>
                    </div>

                    {/* Price display */}
                    <div className="mb-8">
                        <div className="flex items-baseline gap-2">
                            <span className={clsx(
                                "text-4xl md:text-6xl font-bold transition-colors duration-300",
                                {
                                    "text-transparent bg-clip-text bg-gradient-to-r from-[#8000bb] to-purple-600": isPopular,
                                    "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600": !isPopular && !isFree,
                                    "text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-700": isFree,
                                }
                            )}>
                                {formatPrice(price)}
                            </span>
                            {typeof price === 'number' && price > 0 && (
                                <span className="text-lg font-normal text-gray-600">/month</span>
                            )}
                        </div>
                        
                        {/* Yearly pricing hint */}
                        {typeof price === 'number' && price > 0 && typeof tier.yearlyPrice === 'number' && (
                            <p className="text-sm text-gray-500 mt-2">
                                Save ₦{((price * 12) - tier.yearlyPrice).toLocaleString()} annually
                            </p>
                        )}
                    </div>

                    {/* Enhanced CTA button */}
                    <button className={clsx(
                        "group/btn relative w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-500 overflow-hidden",
                        {
                            "bg-gradient-to-r from-[#8000bb] to-purple-600 text-white hover:shadow-xl hover:shadow-purple-500/25 hover:scale-105": isPopular,
                            "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-xl hover:shadow-blue-500/25 hover:scale-105": !isPopular && !isFree,
                            "bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:shadow-xl hover:shadow-gray-500/25 hover:scale-105": isFree,
                        }
                    )}>
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {isFree ? 'Get Started Free' : 'Choose Plan'}
                            <FiArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                        </span>
                        
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                        
                        {/* Hover gradient overlay */}
                        <div className={clsx(
                            "absolute inset-0 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left",
                            {
                                "bg-gradient-to-r from-purple-600 to-pink-600": isPopular,
                                "bg-gradient-to-r from-indigo-600 to-blue-700": !isPopular && !isFree,
                                "bg-gradient-to-r from-gray-600 to-gray-700": isFree,
                            }
                        )}></div>
                    </button>
                </div>

                {/* Features section */}
                <div className="relative p-8">
                    <div className="flex items-center gap-2 mb-6">
                        <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Features</h4>
                        <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                    </div>
                    
                    <ul className="space-y-4">
                        {features.map((feature, index) => (
                            <li 
                                key={index} 
                                className="group/feature flex items-start gap-3 p-2 rounded-xl hover:bg-white/60 transition-all duration-300"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="relative mt-0.5">
                                    <BsFillCheckCircleFill className={clsx(
                                        "h-5 w-5 transition-all duration-300 group-hover/feature:scale-110",
                                        {
                                            "text-purple-500": isPopular,
                                            "text-blue-500": !isPopular && !isFree,
                                            "text-gray-500": isFree,
                                        }
                                    )} />
                                    <div className={clsx(
                                        "absolute inset-0 rounded-full blur-sm opacity-0 group-hover/feature:opacity-30 transition-opacity duration-300",
                                        {
                                            "bg-purple-500": isPopular,
                                            "bg-blue-500": !isPopular && !isFree,
                                            "bg-gray-500": isFree,
                                        }
                                    )}></div>
                                </div>
                                <span className="text-gray-700 leading-relaxed group-hover/feature:text-gray-900 transition-colors duration-300">
                                    {feature}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* Additional info for popular plan */}
                    {isPopular && (
                        <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200/30">
                            <div className="flex items-center gap-2 text-purple-700">
                                <FiZap className="w-4 h-4" />
                                <span className="text-sm font-semibold">Most businesses choose this plan</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Floating corner decorations */}
                <div className="absolute top-4 right-4 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-60 animate-pulse"></div>
                <div className="absolute bottom-4 left-4 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-40 animate-bounce-slow"></div>
            </div>
        </div>
    );
};

export default PricingColumn;