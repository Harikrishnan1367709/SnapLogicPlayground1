import { ChevronDown } from 'lucide-react';
import React, { useState } from 'react'

 const FormatDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFormat, setSelectedFormat] = useState('JSON');
    const formats = ['JSON', 'XML', 'CSV'];
    
    return (
      <div className="relative ">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center h-[30px] bg-white space-x-2 focus:outline-none focus:ring-0 focus:border-none active:outline-none hover:outline-none border-none outline-none"
  style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <span className="font-bold text-gray-600 hover:text-blue-500 text-xs mr-14">{selectedFormat}</span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>
        
        {isOpen && (
          <div className="absolute right-0 mt-1 bg-white border shadow-lg py-1 z-10">
            {formats.map((format) => (
              <div
                key={format}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-xs"
                onClick={() => {
                  setSelectedFormat(format);
                  setIsOpen(false);
                }}
              >
                {format}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  export default FormatDropdown;










  