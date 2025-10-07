
import React from 'react';

interface SectionProps {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ icon, title, children }) => {
    return (
        <section className="mb-8 p-6 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                   {icon}
                </div>
                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            </div>
            <div className="pl-0 sm:pl-13">
                {children}
            </div>
        </section>
    );
};

export default Section;
