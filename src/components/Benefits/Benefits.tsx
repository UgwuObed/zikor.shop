"use client"

import React from 'react';
import { benefits } from '../../data/benefits'; 
import BenefitSection from './BenefitSection'; 

const Benefits: React.FC = () => {
    return (
        <section className="relative py-32 px-5 bg-gradient-to-b from-white via-purple-50/30 to-white overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div id="features">
                    <h2 className="sr-only">Features</h2>
                    {benefits.map((item, index) => {
                        return <BenefitSection key={index} benefit={item} imageAtRight={index % 2 !== 0} />
                    })}
                </div>
            </div>
        </section>
    );
};

export default Benefits;