import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FaUpload, FaDownload } from "react-icons/fa";
import { ChevronDown } from "lucide-react";

const SnaplogicPlayground3 = () => {
  return (
    <div className="flex flex-col h-screen w-screen bg-white overflow-hidden">
      {/* Navigation Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b">
        <div className="flex items-center space-x-3">
          {/* Snaplogic Logo */}
          <svg
            viewBox="0 0 100 100"
            className="w-8 h-8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="50" cy="50" r="50" fill="#0046BE"/>
            <circle cx="35" cy="35" r="8" fill="white"/>
            <circle cx="65" cy="35" r="8" fill="white"/>
            <circle cx="50" cy="65" r="8" fill="white"/>
            <path d="M35 35 L65 35" stroke="white" strokeWidth="3"/>
            <path d="M65 35 L50 65" stroke="white" strokeWidth="3"/>
            <path d="M35 35 L50 65" stroke="white" strokeWidth="3"/>
          </svg>
          <div style={{ fontSize: "1.51rem", fontWeight: "600", color: "#333333",fontFamily:"Segoe UI"}}>
            SnapLogic 
          </div>
        </div>
        
        <div className="flex items-center">
          {/* Export Button */}
          <button className="flex items-center px-4 py-2 bg-white rounded border-none focus:outline-none group hover:text-blue-500">
            <FaUpload className="mr-2 group-hover:text-blue-500 text-gray-500 h-3 w-3" />
            <span className="text-gray-700 group-hover:text-blue-500" style={{ fontSize: "0.9rem", fontWeight: "400" }}>Export</span>
          </button>
          
          {/* Import Button */}
          <button className="flex items-center px-4 py-2 bg-white rounded border-none focus:outline-none group hover:text-blue-500 ml-1">
            <FaDownload className="mr-2 group-hover:text-blue-500 text-gray-500 h-3 w-3" />
            <span className="text-gray-700 group-hover:text-blue-500" style={{ fontSize: "0.9rem", fontWeight: "400" }}>Import</span>
          </button>
          <div className="space-x-6 ml-8" style={{ fontSize: "0.82rem", fontWeight: "700", color: "#333333" }}>
            <a className="text-black hover:text-blue-500">BLOGS</a>
            <a className="text-black hover:text-blue-500">DOCS</a>
            <a className="text-black hover:text-blue-500">TUTORIAL</a>
            <a className="text-black hover:text-blue-500">PLAYGROUND</a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className="w-72 border-r flex flex-col">
          {/* Input Explorer Section */}
          <div className="h-1/2 border-b">
            <div className="border-b">
              <div className="flex justify-between items-center min-h-[30px] px-4">
                <span className="text-sm font-medium text-gray-600">INPUT EXPLORER</span>
                <button className="text-xl bg-white border-none focus:outline-none flex items-center justify-center h-6 w-6">
                  +
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-blue-500">json</span>
                <span className="text-gray-600">script1</span>
              </div>
            </div>
          </div>

          {/* Script Explorer Section */}
          <div className="h-1/2">
            <div className="border-b">
              <div className="flex justify-between items-center min-h-[30px] px-4">
                <span className="text-sm font-medium text-gray-600">SCRIPT EXPLORER</span>
                <button className="text-xl bg-white border-none focus:outline-none flex items-center justify-center h-6 w-6">
                  +
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-blue-500">main.dwl</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Panel */}
        <div className="flex-1 border-r">
          <div className="border-b">
            <div className="flex items-center min-h-[30px] px-4">
              <span className="text-sm font-medium text-gray-600">SCRIPT</span>
            </div>
          </div>
          <div className="p-4 font-mono text-sm">
            <div className="flex">
              {/* Line Numbers */}
              <div className="pr-4 text-gray-400 select-none">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="text-right text-blue-400 hover:text-blue-800">{num}</div>
                ))}
              </div>
              {/* Code Content */}
              <pre className="text-gray-800">
                {/* <div className="flex">
                  <span className="text-blue-600">%dw</span> 2.0
                </div> */}
                {/* <div>
                  <span className="text-blue-600">output</span> application/json
                </div> */}
                <div className="text-black-600">$.phoneNumbers[:1].type</div>
                {/* <div>payload.message</div>  */}
              </pre>
            </div>
          </div>
        </div>

     {/* Right Panel */}
     <div className="w-96 flex flex-col">
          {/* Actual Output Section */}
          <div className="h-1/2 border-b">
            <div className="border-b">
              <div className="flex justify-between items-center min-h-[30px] px-4">
                <span className="text-sm font-medium text-gray-600">ACTUAL OUTPUT</span>
                <div className="flex items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600">JSON</span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex">
               {/* Line Numbers */}
              <div className="pr-4 text-gray-400 select-none">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="text-right text-blue-400 hover:text-blue-800">{num}</div>
                ))}
              </div>
                <pre className="text-red-500">
                 <div className='flex'>[</div>
                 <div > "Phone"</div>
                 <div >]</div>
                </pre>
              </div>
            </div>
          </div>

          {/* Expected Output Section */}
          <div className="h-1/2">
            <div className="border-b">
              <div className="flex justify-between items-center min-h-[30px] px-4">
                <span className="text-sm font-medium text-gray-600">EXPECTED OUTPUT</span>
                <div className="flex items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600">JSON</span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex">
                 {/* Line Numbers */}
              <div className="pr-4 text-gray-400 select-none">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="text-right text-blue-400 hover:text-blue-800">{num}</div>
                ))}
              </div>
                <pre className="text-red-500">
                <div className='flex'>[</div>
                 <div > "Phone"</div>
                 <div >]</div>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t p-2 text-sm text-gray-500 flex justify-between items-center">
        <div className="flex space-x-4">
          <span>LOG VIEWER</span>
          <span>API REFERENCE</span>
        </div>
        <span>©2023 Snaplogic LLC, a Salesforce company</span>
      </div>
    </div>
  );
};

export default SnaplogicPlayground3;