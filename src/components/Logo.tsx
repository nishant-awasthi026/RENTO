
import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "h-10 w-auto" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="bg-rento-yellow px-1 py-1 rounded">
        <span className="text-rento-dark font-bold text-xl">RENTO</span>
      </div>
    </div>
  );
};

export default Logo;
