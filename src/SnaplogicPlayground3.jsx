import React, { useEffect, useState } from 'react';
import { ChevronDown, Upload, Download } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog"
import { Input } from "./components/ui/input"
import { Label } from "./components/ui/label"
import { Button } from './components/ui/button';
import FormatDropdown from './FormatDropdown';



const SnapLogicPlayground3 = () => {

  
   // State declarations
   const [leftWidth, setLeftWidth] = useState(288);
   const [middleWidth, setMiddleWidth] = useState(500);
   const [rightWidth, setRightWidth] = useState(384);
 
   const resizableStyles = (width, panelType) => ({
    width: `${width}px`,
    minWidth: '200px',
    position: 'relative',
    cursor: panelType === 'middle' ? 'text' : 'pointer',
    userSelect: 'none'
  });

   const ResizeHandle = () => (
     <div
       style={{
         position: 'absolute',
         right: -3,
         top: 0,
         bottom: 0,
         width: 6,
         cursor: 'default',
         zIndex: 10
       }}
     />
   );
 

  // Add these states at the top of your component
const [isDragging, setIsDragging] = useState(false);
// const [leftWidth, setLeftWidth] = useState(288);
// const [rightWidth, setRightWidth] = useState(384);

// Add this style to prevent text selection during dragging
useEffect(() => {
  if (isDragging) {
    document.body.style.userSelect = 'none';
  } else {
    document.body.style.userSelect = 'text';
  }
}, [isDragging]);

// Add these handlers
const handleMouseDown = (e, isLeft) => {
  setIsDragging(true);
  const startX = e.clientX;
  const startLeftWidth = leftWidth;
  const startRightWidth = rightWidth;

  const handleMouseMove = (e) => {
    if (isLeft) {
      const newWidth = startLeftWidth + (e.clientX - startX);
      setLeftWidth(Math.max(200, Math.min(600, newWidth)));
    } else {
      const newWidth = startRightWidth - (e.clientX - startX);
      setRightWidth(Math.max(200, Math.min(600, newWidth)));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
};

  

  const [isInputDialogOpen, setIsInputDialogOpen] = useState(false);
const [isScriptDialogOpen, setIsScriptDialogOpen] = useState(false);

  const [inputs, setInputs] = useState([]); // State to store created inputs
  const [newInput, setNewInput] = useState(""); // State to store current input
  // const [scriptContent, setScriptContent] = useState('$.phoneNumbers[:1].type');
  const [scriptContent, setScriptContent] = useState('$.phoneNumbers[:1].type');
  const [expectedOutput, setExpectedOutput] = useState('[\n  "Phone"\n]');
  const [actualOutput, setActualOutput] = useState('[\n  "Phone"\n]');
  const [scripts, setScripts] = useState([]); // State to store created scripts
  const [newScript, setNewScript] = useState(""); // State to store current script

  // Convert content to array of lines
  const scriptLines = scriptContent.split('\n');
  const expectedLines = expectedOutput.split('\n');
  const actualLines = actualOutput.split('\n');

  const isCreateInputDisabled = newInput.trim() === ""; // Disable create button if input is empty
  const isCreateScriptDisabled = newScript.trim() === ""; // Disable create button if script is empty

  const renderLineNumbers = (content) => {
    return (
      <div className="pr-4 text-gray-400 select-none">
        {Array.from({ length: content.length }, (_, i) => (
          <div key={i} className="text-right text-blue-400 hover:text-blue-800 h-6">
            {i + 1}
          </div>
        ))}
      </div>
    );
  };

  const handleInputChange = (e) => {
    setNewInput(e.target.value);
  };

  const handleCreateInput = () => {
    if (newInput.trim() !== "") {
      setInputs([...inputs, newInput]);
      setNewInput("");
      setIsInputDialogOpen(false); // Close the dialog
    }
  };
  

  const handleScriptChange = (e) => {
    setNewScript(e.target.value);
  };

  const handleCreateScript = () => {
    if (newScript.trim() !== "") {
      const newScripts = newScript.split('\n').map(line => ({
        id: Date.now() + Math.random(),
        content: line,
      }));
      setScripts([...scripts, ...newScripts]);
      setNewScript("");
      setIsScriptDialogOpen(false); // Close the dialog
    }
  };
  

  const handleExpectedOutputChange = (e) => {
    setExpectedOutput(e.target.value);
  };
  const handleScriptContentChange=(e)=>{
    setScriptContent(e.target.value);
  }

  // Common styles for textareas
  const textAreaStyles = {
    minHeight: '100px',
    lineHeight: '1.5rem',
    padding: '0',
    border: 'none'
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-white overflow-hidden">
      {/* Navigation Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b">
        <div className="flex items-center space-x-3">
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
          <div className="text-[21px] font-bold text-[#444444] font-['OpenSans']">
            SnapLogic 
          </div>
        </div>
        
        <div className="flex items-center">
  <button className="flex items-center px-4 py-2 bg-white rounded border-none focus:outline-none group hover:text-blue-500 -ml-3">
    <Upload className="mr-2 group-hover:text-blue-500 text-gray-500 h-3 w-3" />
    <span className="text-gray-700 group-hover:text-blue-500 text-[0.9rem] font-normal">Export</span>
  </button>
  
  <button className="flex items-center px-4 py-2 bg-white rounded border-none focus:outline-none group hover:text-blue-500 -ml-4">
    <Download className="mr-2 group-hover:text-blue-500 text-gray-500 h-3 w-3" />
    <span className="text-gray-700 group-hover:text-blue-500 text-[0.9rem] font-normal">Import</span>
  </button>
  
  <div className="h-6 w-[1px] bg-gray-500 mx-4"></div>
  
  <div className="space-x-12 text-[0.82rem] font-bold text-[#333333]">
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
         <div style={resizableStyles(leftWidth,'left')} className="flex-shrink-0 border-r flex flex-col relative" >
          <div className="h-1/2 border-b">
            <div className="border-b">
              <div className="flex justify-between items-center min-h-[30px] px-4">
                <span className="font-bold text-gray-600 text-xs">
                  INPUT EXPLORER
                </span>
                <Dialog open={isInputDialogOpen} onOpenChange={setIsInputDialogOpen}>

                  <DialogTrigger asChild>
                    <button className="text-xl bg-white border-none focus:outline-none flex items-center justify-center h-6 w-6">
                      +
                    </button>
                  </DialogTrigger>
                  <DialogContent
                    className="sm:max-w-[425px] bg-gray-100 p-6 shadow-md border-none"
                    style={{ borderRadius: "0" }}
                  >
                    <DialogHeader>
                      <DialogTitle className="text-[31px] font-semibold text-gray mb-6">
                        Create new input
                      </DialogTitle>
                      <div className="border-b border-gray-300 mt-5"></div>
                    </DialogHeader>
                    <div className="py-4">
                      <Label
                        htmlFor="identifier"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Identifier
                      </Label>
                      <Input
                        id="identifier"
                        value={newInput}
                        onChange={handleInputChange}
                        placeholder=""
                        className="w-full h-12 px-3 text-lg border-b border-l border-black focus:outline-none focus:border-l-black focus:border-r-black focus:border-t-white focus:border-b-white hover:border-l-black hover:border-r-black"
                        style={{
                          borderTop: "0",
                          borderBottom: "0",
                          borderRadius: "0",
                        }}
                      />
                    </div>
                    <DialogFooter className="flex justify-end gap-2">
                    <Button
  variant="outline"
  onClick={() => setIsInputDialogOpen(false)}
  className="h-10 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-200"
  style={{ borderRadius: "0", borderColor: "rgb(209 213 219)" }}
>
  Cancel
</Button>

                      <Button
                        type="button"
                        disabled={isCreateInputDisabled}
                        onClick={handleCreateInput}
                        className={`h-10 px-4 text-sm font-medium ${
                          isCreateInputDisabled
                            ? "text-white bg-gray-300 cursor-not-allowed"
                            : "text-white bg-blue-500 hover:bg-blue-600 cursor-pointer"
                        }`}
                        style={{ borderRadius: "0" }}
                      >
                        Create
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="p-4">
              {inputs.map((input, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 text-sm text-gray-600"
                >
                  <span className="text-blue-500">json</span>
                  <span>{input}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-1/2">
            <div className="border-b">
              <div className="flex justify-between items-center min-h-[30px] px-4">
                <span className="font-bold text-gray-600 text-xs">SCRIPT EXPLORER</span>
                <Dialog open={isScriptDialogOpen} onOpenChange={setIsScriptDialogOpen}>

                  <DialogTrigger asChild>
                    <button className="text-xl bg-white border-none focus:outline-none flex items-center justify-center h-6 w-6">
                      +
                    </button>
                  </DialogTrigger>
                  <DialogContent
                    className="sm:max-w-[425px] bg-gray-100 p-6 shadow-md border-none"
                    style={{ borderRadius: "0" }}
                  >
                    <DialogHeader>
                      <DialogTitle className="text-[31px] font-semibold text-gray mb-6">
                        Create new script
                      </DialogTitle>
                      <div className="border-b border-gray-300 mt-5"></div>
                    </DialogHeader>
                    <div className="py-4">
                      <Label
                        htmlFor="script"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Identifier
                      </Label>
                      <Input
                        id="script"
                        value={newScript}
                        onChange={handleScriptChange}
                        placeholder=""
                        className="w-full h-12 px-3 text-lg border-b border-l border-black focus:outline-none focus:border-l-black focus:border-r-black focus:border-t-white focus:border-b-white hover:border-l-black hover:border-r-black"
                        style={{
                          borderTop: "0",
                          borderBottom: "0",
                          borderRadius: "0",
                        }}
                      />
                    </div>
                    <DialogFooter className="flex justify-end gap-2">
                    <Button
  variant="outline"
  onClick={() => setIsScriptDialogOpen(false)}
  className="h-10 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-200"
  style={{ borderRadius: "0", borderColor: "rgb(209 213 219)" }}
>
  Cancel
</Button>

                      <Button
                        type="button"
                        disabled={isCreateScriptDisabled}
                        onClick={handleCreateScript}
                        className={`h-10 px-4 text-sm font-medium ${
                          isCreateScriptDisabled
                            ? "text-white bg-gray-300 cursor-not-allowed"
                            : "text-white bg-blue-500 hover:bg-blue-600 cursor-pointer"
                        }`}
                        style={{ borderRadius: "0" }}
                      >
                        Create
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="p-4">
              {scripts.map((script) => (
                <div
                  key={script.id}
                  className="flex items-center space-x-2 text-sm text-gray-600"
                >
                  <span className="text-blue-500">dwl</span>
                  <span>{script.content}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
       {/* Left Resize Handle */}
  <div
    className="w-[1px] bg-gray-200 relative"
    onMouseDown={(e) => handleMouseDown(e, true)}
  >
    <div 
      className="absolute -left-2 -right-2 top-0 bottom-0 hover:cursor-col-resize"
      style={{ cursor: isDragging ? 'col-resize' : 'auto' }} 
    >
      <div className="w-[1px] h-full mx-auto hover:bg-blue-500" />
    </div>
  </div>
        {/* Middle Panel */}
        <div style={resizableStyles(middleWidth,'middle')} className="flex-1 border-r relative">
          <div className="border-b">
            <div className="flex items-center min-h-[30px] px-4">
              <span className="font-bold text-gray-600 text-xs">SCRIPT</span>
            </div>
          </div>
          {/* <div className="p-4">
              <div className="flex">
                {renderLineNumbers(expectedLines)}
                <textarea
                  value={expectedOutput}
                  onChange={handleExpectedOutputChange}
                  className="flex-1 bg-transparent outline-none resize-none overflow-hidden text-red-500 font-mono"
                  style={textAreaStyles}
                />
              </div>
            </div> */}
          <div className="p-4 font-mono text-sm">
            <div className="flex relative">
              {renderLineNumbers(scriptLines)}
              <textarea
             value={scriptContent}
             onChange={handleScriptContentChange}
               className="flex-1 bg-transparent outline-none resize-none overflow-hidden text-gray-800 font-mono"
             style={textAreaStyles}
               />
            </div>
          </div>
        </div>
        {/* Right Resize Handle */}
  <div
    className="w-[1px] bg-gray-200 relative"
    onMouseDown={(e) => handleMouseDown(e, false)}
  >
    <div 
      className="absolute -left-2 -right-2 top-0 bottom-0 hover:cursor-col-resize"
      style={{ cursor: isDragging ? 'col-resize' : 'auto' }} 
    >
      <div className="w-[1px] h-full mx-auto hover:bg-blue-500" />
    </div>
  </div>
        {/* Right Panel */}
        <div style={resizableStyles(rightWidth,'right')} className="flex-shrink-0 relative">
          {/* Actual Output Section */}
          <div className="h-1/2 border-b">
            <div className="border-b">
              <div className="flex justify-between items-center min-h-[30px] px-4">
                <span className="font-bold text-gray-600 text-xs">ACTUAL OUTPUT</span>
                <div className="flex items-center space-x-2">
                  {/* <span className="font-bold text-gray-600 text-xs">JSON</span> */}
                  <div className="flex items-center space-x-2">
  <FormatDropdown />
</div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex">
                {renderLineNumbers(actualLines)}
                <pre className="text-red-500">
                  {actualLines.map((line, index) => (
                    <div key={index} className="h-6" >{line}</div>
                  ))}
                </pre>
              </div>
            </div>
          </div>

          {/* Expected Output Section */}
          <div className="h-1/2">
            <div className="border-b">
              <div className="flex justify-between items-center min-h-[30px] px-4">
                <span className="font-bold text-gray-600 text-xs">EXPECTED OUTPUT</span>
                <div className="flex items-center space-x-2 ">
                  {/* <span className="font-bold text-gray-600 text-xs">JSON</span> */}
                  <div className="flex items-center space-x-2">
  <FormatDropdown />
</div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex">
                {renderLineNumbers(expectedLines)}
                <textarea
                  value={expectedOutput}
                  onChange={handleExpectedOutputChange}
                  className="flex-1 bg-transparent outline-none resize-none overflow-hidden text-red-500 font-mono"
                  style={textAreaStyles}
                />
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

export default SnapLogicPlayground3;
