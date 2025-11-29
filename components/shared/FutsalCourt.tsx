
import React, { ReactNode } from 'react';

interface FutsalCourtProps {
    children?: ReactNode;
    onClick?: (event: React.MouseEvent<SVGSVGElement>) => void;
}

const FutsalCourt: React.FC<FutsalCourtProps> = ({ children, onClick }) => {
  return (
    <div className="relative w-full aspect-[2/1] bg-green-700 border-4 border-white rounded-lg overflow-hidden">
        <svg 
            viewBox="0 0 1000 500" 
            className="w-full h-full"
            onClick={onClick}
        >
            {/* Outlines */}
            <rect x="25" y="25" width="950" height="450" fill="none" stroke="white" strokeWidth="4" />
            
            {/* Halfway line */}
            <line x1="500" y1="25" x2="500" y2="475" stroke="white" strokeWidth="4" />
            
            {/* Center circle */}
            <circle cx="500" cy="250" r="75" fill="none" stroke="white" strokeWidth="4" />
            <circle cx="500" cy="250" r="5" fill="white" />

            {/* Penalty areas */}
            <rect x="25" y="100" width="150" height="300" fill="none" stroke="white" strokeWidth="4" />
            <rect x="825" y="100" width="150" height="300" fill="none" stroke="white" strokeWidth="4" />

            {/* Penalty spots */}
            <circle cx="150" cy="250" r="5" fill="white" />
            <circle cx="850" cy="250" r="5" fill="white" />

            {/* Second penalty spots */}
            <circle cx="250" cy="250" r="5" fill="white" />
            <circle cx="750" cy="250" r="5" fill="white" />

            {/* Corner arcs */}
            <path d="M 25 50 A 25 25 0 0 1 50 25" fill="none" stroke="white" strokeWidth="4" />
            <path d="M 25 450 A 25 25 0 0 0 50 475" fill="none" stroke="white" strokeWidth="4" />
            <path d="M 975 50 A 25 25 0 0 0 950 25" fill="none" stroke="white" strokeWidth="4" />
            <path d="M 975 450 A 25 25 0 0 1 950 475" fill="none" stroke="white" strokeWidth="4" />
            
            {/* Goals */}
            <rect x="10" y="200" width="15" height="100" fill="none" stroke="white" strokeWidth="4" />
            <rect x="975" y="200" width="15" height="100" fill="none" stroke="white" strokeWidth="4" />
            
            {children}
        </svg>
    </div>
  );
};

export default FutsalCourt;
