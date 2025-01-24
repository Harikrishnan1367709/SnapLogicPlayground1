import React, { useEffect, useState } from 'react';
import { ChevronDown, Upload, Download, Terminal, Book, ChevronLeft } from "lucide-react";

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

const UpdatedCode = () => {


    const [hoveredLine, setHoveredLine] = useState(null);
const [highlightedLine, setHighlightedLine] = useState(null);

    const [showInputContainer, setShowInputContainer] = useState(false);
    const [showScriptContainer, setShowScriptContainer] = useState(false);
const [activeScript, setActiveScript] = useState(null);


    const [inputContents, setInputContents] = useState({});

  const [isPayloadView, setIsPayloadView] = useState(false);
  const [selectedInputIndex, setSelectedInputIndex] = useState(null);
  const [payloadContent, setPayloadContent] = useState('{\n\n}');
  const [outputMatch, setOutputMatch] = useState(true);
  const [activeNavItem, setActiveNavItem] = useState('playground');
  const [currentView, setCurrentView] = useState('playground');
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [leftWidth, setLeftWidth] = useState(() => 
    parseInt(localStorage.getItem('leftWidth')) || 288
  );
  const [middleWidth, setMiddleWidth] = useState(() => 
    parseInt(localStorage.getItem('middleWidth')) || 500
  );
  const [rightWidth, setRightWidth] = useState(() => 
    parseInt(localStorage.getItem('rightWidth')) || 384
  );
  
  useEffect(() => {
    localStorage.setItem('leftWidth', leftWidth);
    localStorage.setItem('middleWidth', middleWidth);
    localStorage.setItem('rightWidth', rightWidth);
  }, [leftWidth, middleWidth, rightWidth]);

  const [bottomHeight, setBottomHeight] = useState(300);
  const [isBottomExpanded, setIsBottomExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [showToast, setShowToast] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isInputDialogOpen, setIsInputDialogOpen] = useState(false);
  const [isScriptDialogOpen, setIsScriptDialogOpen] = useState(false);
  const [inputs, setInputs] = useState([]);
  const [newInput, setNewInput] = useState("");
  const [scriptContent, setScriptContent] = useState('$.phoneNumbers[:1].type');
  const [expectedOutput, setExpectedOutput] = useState('[\n  "Phone"\n]');
  const [actualOutput, setActualOutput] = useState('[\n  "Phone"\n]');
  const [scripts, setScripts] = useState([]);
  const [newScript, setNewScript] = useState("");
  const resizableStyles = (width, panelType) => ({
    width: `${width}px`,
    minWidth: '250px', // Increased minimum width
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

  useEffect(() => {
    if (isDragging) {
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.userSelect = 'text';
    }
  }, [isDragging]);

  const handleMouseDown = (e, isLeft, isBottom) => {
    setIsDragging(true);
    
    if (isBottom) {
      const startY = e.clientY;
      const startHeight = bottomHeight;

      const handleMouseMove = (e) => {
        const deltaY = startY - e.clientY;
        const newHeight = startHeight + deltaY;
        setBottomHeight(Math.max(32, Math.min(800, newHeight)));
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return;
    }
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
  const scriptLines = scriptContent.split('\n');
  const expectedLines = expectedOutput.split('\n');
  const actualLines = actualOutput.split('\n');

  const isCreateInputDisabled = newInput.trim() === "";
  const isCreateScriptDisabled = newScript.trim() === "";

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

  const handleInputClick = (input, index) => {
    setIsPayloadView(true);
    setSelectedInputIndex(index);
    setPayloadContent(inputContents[input] || '{\n  \n}');
  };

  const handleBackClick = () => {
    if (selectedInputIndex !== null) {
      const currentInput = inputs[selectedInputIndex];
      setInputContents({
        ...inputContents,
        [currentInput]: payloadContent
      });
    }
    setIsPayloadView(false);
  };
  
  const handleCreateInput = () => {
    if (newInput.trim() !== "") {
      setInputs([...inputs, newInput]);
      setInputContents({
        ...inputContents,
        [newInput]: '{\n  \n}'
      });
      setNewInput("");
      setIsInputDialogOpen(false);
    }
  };

  const handleScriptChange = (e) => {
    setNewScript(e.target.value);
  };

  const handleCreateScript = () => {
    if (newScript.trim() !== "") {
      const scriptName = newScript.endsWith('.dwl') ? newScript : `${newScript}.dwl`;
      const newScriptObj = {
        id: Date.now() + Math.random(),
        name: scriptName,
        content: '',
        lastModified: new Date()
      };
      setScripts([...scripts, newScriptObj]);
      setNewScript("");
      setIsScriptDialogOpen(false);
    }
  };

  const handleScriptSelect = (script) => {
    if (activeScript) {
      // Auto-save current script
      const updatedScripts = scripts.map(s => 
        s.id === activeScript.id 
          ? { ...s, content: scriptContent }
          : s
      );
      setScripts(updatedScripts);
    }
    
    setActiveScript(script);
    setScriptContent(script.content);
  };

  const handleActualOutputChange = (e) => {
    setActualOutput(e.target.value);
    compareOutputs();
  };

  const handleExpectedOutputChange = (e) => {
    setExpectedOutput(e.target.value);
  };

  const handleScriptContentChange = (e) => {
    setScriptContent(e.target.value);
    if (activeScript) {
      const updatedScripts = scripts.map(s => 
        s.id === activeScript.id 
          ? { ...s, content: e.target.value }
          : s
      );
      setScripts(updatedScripts);
    }
  };

  const textAreaStyles = {
    minHeight: '100px',
    lineHeight: '1.5rem',
    padding: '0',
    border: 'none'
  };

  const compareOutputs = () => {
    const normalizedActual = actualOutput.trim();
    const normalizedExpected = expectedOutput.trim();
    return normalizedActual === normalizedExpected;
  };
  useEffect(() => {
    setOutputMatch(compareOutputs());
  }, [actualOutput, expectedOutput]);

  return (
    <div className="flex flex-col h-screen w-screen bg-white overflow-hidden">
      {showToast && (
        <div className="bg-[#00A0DF] text-[#00044C] py-2 text-[12px] relative">
          <div className="text-center px-12 font-bold tracking-[0.09em]">
            EXPERIENCE INNOVATION, UNLEASHED. WATCH THE HIGHLIGHTS FROM CONNECT '22
          </div>
          <button
            onClick={() => setShowToast(false)}
            className="absolute right-4 top-0 h-full bg-[#00A0DF] text-[#00044C] border-none outline-none focus:outline-none font-bold text-[18px] flex items-center justify-center font-bold"
          >
            ×
          </button>
        </div>
      )}

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
          <button 
            onClick={() => setShowExportDialog(true)} 
            className="flex items-center px-4 py-2 bg-white rounded border-none focus:outline-none group hover:text-blue-500 -ml-3"
          >
            <Upload className="mr-2 group-hover:text-blue-500 text-gray-500 h-3 w-3" />
            <span className="text-gray-700 group-hover:text-blue-500 text-[0.9rem] font-normal">Export</span>
          </button>

          {showExportDialog && (
            <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
              <div className="bg-white h-[19rem] w-205" style={{ borderRadius: 0 }}>
                <div className="p-6">
                  <h2 className="text-[1.9rem] font-bold mt-[1rem] mb-[2rem] text-gray-700">Open in Visual Studio Code</h2>
                  <div className="h-[1px] bg-gray-200 w-[calc(100%+48px)] -mx-6 mt-4 mb-[1.8rem]"></div>
                  <p className="text-sm mb-3">
                    For the best DataWeave development experience unzip and open the project on <span className="text-blue-500">VSCode</span>
                  </p>
                  <p className="text-sm mb-[3rem]">
                    Don't forget to install the <span className="text-blue-500">DataWeave Playground</span> extension
                  </p>
                  <div className="flex justify-between items-center">
                    <label className="flex items-center text-sm cursor-pointer select-none" onClick={() => setIsChecked(!isChecked)}>
                      <div className="w-5 h-5 mr-2 border border-gray-300 flex items-center justify-center bg-white hover:border-gray-400 cursor-pointer" style={{ borderRadius: 0 }}>
                        {isChecked && (
                          <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      Don't show popup again
                    </label>
                    <button 
                      onClick={() => setShowExportDialog(false)}
                      className="px-3 py-2.5 text-sm bg-white border border-gray-400 hover:border-gray-400 hover:bg-gray-200"
                      style={{ borderRadius: 0 }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
                    <button 
            onClick={() => setShowImportDialog(true)} 
            className="flex items-center px-4 py-2 bg-white rounded border-none focus:outline-none group hover:text-blue-500 -ml-4"
          >
            <Download className="mr-2 group-hover:text-blue-500 text-gray-500 h-3 w-3" />
            <span className="text-gray-700 group-hover:text-blue-500 text-[0.9rem] font-normal">Import</span>
          </button>

          {showImportDialog && (
            <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
              <div className="bg-white h-[28.5rem] w-[31rem]" style={{ borderRadius: 0 }}>
                <div className="p-8 pt-10 flex flex-col h-full">
                  <h2 className="text-[1.9rem] font-bold text-gray-700">Import project</h2>
                  <div className="h-[1px] bg-gray-200 w-[calc(100%+48px)] -mx-6 mt-4 mb-[0.4rem]"></div>
                  <div className="mt-6 flex-1">
                    <div className="border-2 border-dashed border-gray-600 h-[11rem] w-[27.2rem] mx-auto flex flex-col items-center justify-center cursor-pointer hover:border-gray-400">
                      <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-sm text-center mt-2 text-gray-500">Drop project zip here or click to upload</p>
                    </div>
                    <div className="mt-4 w-[28rem] mx-auto mb-[2.2rem]">
                      <p className="text-[#FF0000] text-sm">Upload functionality is only intended for playground exported projects</p>
                      <p className="text-[#FF0000] text-sm mt-1 ml-[3.5rem]">Importing modified files may yield an invalid project.</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button 
                      onClick={() => setShowImportDialog(false)}
                      className="px-3 py-2.5 text-sm bg-white border border-gray-400 hover:border-gray-400 hover:bg-gray-200"
                      style={{ borderRadius: 0 }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="h-6 w-[1px] bg-gray-500 mx-4"></div>

          <div className="space-x-8 text-[0.82rem] font-bold text-[#333333] relative flex items-center">
            <a 
              href="https://www.snaplogic.com/blog" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`text-black hover:text-blue-500 px-2 ${activeNavItem === 'blogs' ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveNavItem('blogs')}
            >
              BLOGS
            </a>
            <a 
              href="https://docs.snaplogic.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`text-black hover:text-blue-500 px-2 ${activeNavItem === 'docs' ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveNavItem('docs')}
            >
              DOCS
            </a>
            <a 
              href="https://www.youtube.com/snaplogic" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`text-black hover:text-blue-500 pb-0 relative ${activeNavItem === 'tutorial' ? 'border-b-2 border-blue-500 -mb-[2px]' : ''}`}
              onClick={() => setActiveNavItem('tutorial')}
            >
              TUTORIAL
            </a>
            <a 
              onClick={() => {
                setCurrentView('playground');
                setActiveNavItem('playground');
              }} 
              className={`text-black hover:text-blue-500 cursor-pointer px-2 ${activeNavItem === 'playground' ? 'border-b-2  border-blue-500' : ''}`}
            >
              PLAYGROUND
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden h-[calc(100vh-100px)]">
        <div style={resizableStyles(leftWidth,'left')} className="flex-shrink-0 border-r flex flex-col relative h-full ">
          {isPayloadView ? (
            <div className="flex flex-col h-full">
              <div className="border-b">
  <div className="flex justify-center items-center h-[30px] px-2">
    <div className="flex items-center gap-1">
      <button onClick={handleBackClick} className="text-gray-600 border-none outline-none h-[30px] flex items-center focus:outline-none focus:border-none">
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span className="font-bold text-gray-600 text-xs mr-4">PAYLOAD</span>
    </div>
    <FormatDropdown />
  </div>
</div>
<div className="flex flex-1">
  <div className="w-12 bg-gray-50 flex flex-col text-right pr-2 py-2 select-none">
    {Array.from({ length: Math.max(2, payloadContent.split('\n').length) }, (_, i) => (
      <div key={i} className="text-blue-500 hover:text-blue-700 leading-6">{i + 1}</div>
    ))}
  </div>
  <textarea
    value={payloadContent}
    onChange={(e) => setPayloadContent(e.target.value)}
    className="flex-1 p-2 font-mono text-sm resize-none outline-none leading-6"
    spellCheck="false"
    style={{ lineHeight: '1.5rem' }}
  />
</div>
            </div>
          ) : (
            <>
            <div className="h-1/2 border-b">
            <div className="border-b">
  <div className="flex justify-between items-center h-[30px] px-4">
    <span className="font-bold text-gray-600 text-xs">INPUT EXPLORER</span>
    <button 
      onClick={() => setShowInputContainer(true)} 
      className="text-l bg-white  text-gray-500 border-none focus:outline-none h-[30px] flex items-center border-r-2"
      style={{ borderRight: "0px" }}
    >
      +
    </button>
  </div>
</div>




{showInputContainer && (
    <>
   <div className="fixed inset-0 bg-black/75 z-40" />
   <div className="fixed inset-0 z-50 flex items-center justify-center">
   <div className="w-[31.5rem] h-[19rem] bg-gray-100 p-6 shadow-md">
      <div className="mb-3">
        <h2 className="text-[31px] font-bold text-[#444444] mb-7 ml-2 mt-4">
          Create new input
        </h2>
        <div className="border-b border-gray-200 mt-5 -mx-6"></div>
      </div>
      <div className="py-2">
<div className="flex items-center justify-between">
        <label className="block text-sm font-small text-[#262626]  text-[14px] mb-2 ml-1">
          Identifier
        </label>
<div className="w-3.5 h-3.5 rounded-full font-bold border border-gray-900 flex items-center justify-center text-[0.7rem] text-gray-900 mb-2">
      i
    </div>
  </div>
        <input
  value={newInput}
  onChange={handleInputChange}
  className="w-full text-[15px] ml-1 h-11 px-3 text-lg outline-none bg-gray-200 border-t-0 border-b-0 border-l-gray-300 border-l-[3px] mt-1 border-r-gray-300 border-r-[3px] hover:bg-gray-100 hover:border-t-0 hover:border-b-0 hover:border-l-gray-400 hover:border-r-gray-400 focus:bg-gray-100 focus:border-t-0 focus:border-b-0 focus:border-l-gray-600 focus:border-r-gray-600"
  style={{
    borderTop: "0",
    borderBottom: "0",
    outline: "none"
  }}
/>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={() => setShowInputContainer(false)}
          className="h-10 px-4 text-sm  font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-200  rounded-none"
          style={{ borderColor: "rgb(209 213 219)",outline: "none" }}
        >
        
          Cancel
        </button>
         <button
          disabled={isCreateInputDisabled}
          onClick={() => {
            handleCreateInput();
            setShowInputContainer(false);
          }}
          className={`h-10 px-4 text-sm  rounded-none font-medium ${
            isCreateInputDisabled
              ? "text-black bg-gray-300 cursor-not-allowed"
              : "text-white bg-blue-500 hover:bg-blue-600 cursor-pointer"
          }`}
          style={{ 
            border: "none",
            outline: "none"
          }}
        >
          Create
        </button>
      </div>
    </div>
  </div>
  </>
)}
              <div className="p-4">
  {inputs.map((input, index) => (
    <div
      key={index}
      className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer hover:bg-gray-100 p-1"
      onClick={() => handleInputClick(input, index)}
    >
      <span className="text-blue-500">json</span>
      <span>{input}</span>
    </div>
  ))}
</div>
              </div>
              <div className="h-1/2">
              <div className="border-b">
  <div className="flex justify-between items-center h-[30px] px-4">
    <span className="font-bold text-gray-600 text-xs">SCRIPT EXPLORER</span>
    <button 
      onClick={() => setShowScriptContainer(true)} 
      className="text-l text-gray-500 bg-white text-gray-300 border-none focus:outline-none h-[30px] flex items-center border-r-2"
      style={{ borderRight: "0px" }}
    >
      +
    </button>
  </div>
</div>
{showScriptContainer && (
    <>
   <div className="fixed inset-0 bg-black/75 z-40" />
   <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="w-[31.5rem] h-[19rem] bg-gray-100 p-6 shadow-md ">
      <div className="mb-3">
        <h2 className="text-[31px] font-bold text-[#444444] mb-7 ml-2 mt-4">
          Create new script
        </h2>
        <div className="border-b border-gray-200 mt-5 -mx-6"></div>
      </div>
      <div className="py-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-small text-[#262626] text-[14px] mb-2 ml-1">
          Identifier
        </label>
        <div className="w-3.5 h-3.5 rounded-full font-bold border border-gray-900 flex items-center justify-center text-[0.7rem] text-gray-900 mb-2">
      i
    </div>
  </div>
  <input
  value={newScript}
  onChange={handleScriptChange}
  className="w-full ml-1 h-11 text-[15px] px-3 text-lg outline-none bg-gray-200 border-t-0 border-b-0 border-l-gray-300 border-l-[3px] mt-1 border-r-gray-300 border-r-[3px] hover:bg-gray-100 hover:border-t-0 hover:border-b-0 hover:border-l-gray-400 hover:border-r-gray-400 focus:bg-gray-100 focus:border-t-0 focus:border-b-0 focus:border-l-gray-600 focus:border-r-gray-600"
  style={{
    borderTop: "0",
    borderBottom: "0",
    outline: "none"
  }}
/>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={() => setShowScriptContainer(false)}
          className="h-10 px-4 text-sm  font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-200  rounded-none"
          style={{ borderColor: "rgb(209 213 219)",outline: "none" }}
        >
          Cancel
        </button>
        <button
          disabled={isCreateScriptDisabled}
          onClick={() => {
            handleCreateScript();
            setShowScriptContainer(false);
          }}
          className={`h-10 px-4 text-sm  rounded-none font-medium ${
            isCreateScriptDisabled
              ? "text-black bg-gray-300 cursor-not-allowed"
              : "text-white bg-blue-500 hover:bg-blue-600 cursor-pointer"
          }`}
          style={{ 
            border: "none",
            outline: "none"
          }}
        >
          Create
        </button>
      </div>
    </div>
  </div>
  </>
)}
                <div className="p-4">
  {scripts.map((script) => (
    <div
      key={script.id}
      className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer hover:bg-gray-100 p-1"
      onClick={() => handleScriptSelect(script)}
    >
      {/* <span className="text-blue-500"></span> */}
      <span>{script.name}</span>
    </div>
  ))}
</div>
              </div>
            </>
          )}
        </div>

        {/* Left Resize Handle */}
        <div
          className="w-[2px] bg-gray-200 relative"
          onMouseDown={(e) => handleMouseDown(e, true)}
        >
          <div 
            className="absolute -left-2 -right-2 top-0 bottom-0 hover:cursor-ew-resize"
            style={{ cursor: isDragging ? 'ew-resize' : 'ew-resize' }} 
          >
            <div className="w-[1px] h-full mx-auto hover:bg-blue-500" />
          </div>
        </div>
                {/* Middle Panel */}
                <div style={resizableStyles(middleWidth,'middle')} className="flex-1 border-r  flex flex-col relative">
          <div className="border-b">
            <div className="flex items-center justify-between min-h-[30px] px-4">
              <span className="font-bold text-gray-600 text-xs">SCRIPT</span>
              <div className="flex items-center">
                {outputMatch ? (
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-green-500 text-[12px]">SUCCESS</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                    <span className="text-red-500 text-xs">FAILURE</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="p-2 flex flex-1 font-mono text-sm h-full">
  <div className="w-12 text-right pr-4 select-none ">
    {scriptContent.split('\n').map((_, i) => (
      <div key={i} className="text-blue-400 h-6 leading-6">
        {i + 1}
      </div>
    ))}
  </div>
  <textarea
    value={scriptContent}
    onChange={handleScriptContentChange}
    className="flex-1 outline-none resize-none  overflow-auto leading-6 "
    style={{ lineHeight: '1.5rem' }}
  />
</div>
        </div>

        {/* Right Resize Handle */}
        <div
          className="w-[2px] bg-gray-200 relative"
          onMouseDown={(e) => handleMouseDown(e, false)}
        >
          <div 
            className="absolute -left-2 -right-2 top-0 bottom-0 hover:cursor-ew-resize"
            style={{ cursor: isDragging ? 'ew-resize' : 'ew-resize' }} 
          >
            <div className="w-[1px] h-full mx-auto hover:bg-blue-500" />
          </div>
        </div>
                {/* Right Panel */}
                <div style={resizableStyles(rightWidth,'right')} className="flex-shrink-0  flex flex-col h-full relative">
          {/* Actual Output Section */}
          <div className="h-1/2 border-b overflow-hidden">
            <div className="border-b">
              <div className="flex justify-between items-center h-[30px] px-4">
                <span className="font-bold text-gray-600 text-xs">ACTUAL OUTPUT</span>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <FormatDropdown />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 font-mono text-sm">
              <div className="flex">
                {renderLineNumbers(actualLines)}
                <pre 
                  className="text-red-500 text-sm"
                  onChange={handleActualOutputChange}
                >
                  {actualLines.map((line, index) => (
                    <div key={index} className="h-6">{line}</div>
                  ))}
                </pre>
              </div>
            </div>
          </div>
          {/* Expected Output Section */}
          <div className="h-1/2">
            <div className="border-b">
              <div className="flex justify-between items-center h-[30px] px-4">
                <span className="font-bold text-gray-600 text-xs">EXPECTED OUTPUT</span>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <FormatDropdown />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 font-mono text-sm">
              <div className="flex">
                {renderLineNumbers(expectedLines)}
                <textarea
                  value={expectedOutput}
                  onChange={handleExpectedOutputChange}
                  className="flex-1 bg-transparent outline-none resize-none overflow-hidden text-red-500 font-mono text-sm"
                  style={textAreaStyles}
                />
              </div>
            </div>
          </div>
        </div>
        </div>

{/* Bottom Bar */}
<div 
  className="border-t relative flex flex-col"
  style={{
    height: isBottomExpanded ? `${bottomHeight}px` : '32px',
    transition: 'height 0.2s ease-in-out'
  }}
>
  <div className="flex items-center justify-between h-8 bg-white relative">
    <div className="flex space-x-4 pl-2 z-10">
      <button 
        onClick={() => {
          if (!isBottomExpanded || activeTab !== 'log') {
            setIsBottomExpanded(true);
            setActiveTab('log');
          } else {
            setIsBottomExpanded(false);
          }
        }} 
        className={`text-[11px] ${activeTab === 'log' ? 'text-gray-500' : 'text-gray-500'} hover:bg-gray-100 bg-white cursor-pointer flex items-center px-2 py-1 rounded focus:outline-none border-none`}
      >
        <Terminal className="h-3 w-3" />
        <span className='ml-2'>LOG VIEWER</span>
      </button>
      <button 
        onClick={() => {
          if (!isBottomExpanded || activeTab !== 'api') {
            setIsBottomExpanded(true);
            setActiveTab('api');
          } else {
            setIsBottomExpanded(false);
          }
        }} 
        className={`text-[11px] ${activeTab === 'api' ? 'text-gray-500' : 'text-gray-500'} hover:bg-gray-100 bg-white cursor-pointer flex items-center px-2 py-1 rounded focus:outline-none border-none h-6`}
      >
        <Book className="h-3 w-3" />
        <span className='ml-2'>API REFERENCE</span>
      </button>
    </div>
    <span className="text-sm text-gray-300 absolute left-[calc(50%+50px)] flex items-center h-full z-10">
      ©2023 Snaplogic LLC, a Salesforce company
    </span>
    {/* Resize Handle */}
    <div
      className="absolute left-0 right-0 top-0 h-8 cursor-ns-resize"
      onMouseDown={(e) => handleMouseDown(e, false, true)}
    >
      <div className="w-full h-[2px] mx-auto hover:bg-blue-500" />
    </div>
  </div>
          {/* Content */}
          {isBottomExpanded && (
          <div className="flex-1 overflow-auto">
            <div className="h-[calc(100%-2rem)] overflow-auto">
              <div className="flex flex-col justify-center items-center h-full">
                {activeTab === 'log' && (
                  <>
                    <h2 className="text-xl font-bold text-black mb-4">No Logs Available</h2>
                    <p className="text-sm">
                      learn more about the
                      <span className="mx-1 bg-gray-100 px-2 py-1 rounded-none">jsonPath</span>
                      function in the
                      <span className="text-sky-500">  API Reference</span>
                    </p>
                  </>
                )}
               
                {activeTab === 'api' && (
                  <div className="w-full h-full flex">
                    {/* Left Navigation */}
                    <div className="w-64 border-r overflow-y-auto">
                      <nav className="p-4">
                        <ul className="space-y-2">
                          <li className="font-semibold text-sm">Getting Started</li>
                          <li className="text-blue-500 text-sm cursor-pointer pl-4">Understanding Expressions</li>
                          <li className="text-gray-600 text-sm cursor-pointer pl-4">Expression Types</li>
                          <li className="text-gray-600 text-sm cursor-pointer pl-4">Syntax Guide</li>
                          <li className="text-gray-600 text-sm cursor-pointer pl-4">Common Functions</li>
                          <li className="font-semibold text-sm mt-4">Advanced Topics</li>
                          <li className="text-gray-600 text-sm cursor-pointer pl-4">Complex Expressions</li>
                          <li className="text-gray-600 text-sm cursor-pointer pl-4">Best Practices</li>
                          <li className="text-gray-600 text-sm cursor-pointer pl-4">Troubleshooting</li>
                        </ul>
                      </nav>
                    </div>

                    {/* Right Content */}
                    <div className="flex-1 overflow-y-auto">
                      <div className="p-6">
                        <h1 className="text-2xl font-bold mb-6">Understanding Expressions</h1>
                        <div className="space-y-6">
                          <section>
                            <h2 className="text-lg font-semibold mb-3">Overview</h2>
                            <p className="text-gray-700">
                              SnapLogic expressions provide a powerful way to transform and manipulate data within your pipelines.
                            </p>
                          </section>

                          <section>
                            <h2 className="text-lg font-semibold mb-3">Expression Types</h2>
                            <ul className="list-disc pl-6 space-y-2">
                              <li>JSONPath expressions for data navigation</li>
                              <li>Pipeline parameters for configuration</li>
                              <li>JavaScript expressions for complex logic</li>
                              <li>Runtime expressions for dynamic behavior</li>
                            </ul>
                          </section>

                          <section>
                            <h2 className="text-lg font-semibold mb-3">Examples</h2>
                            <div className="bg-gray-50 p-4 rounded-md">
                              <pre className="text-sm font-mono">
                                {`// Data Navigation
                                $.phoneNumbers[0].type

                                // String Operations
                                $uppercase($.firstName)

                                // Array Operations
                                $.items[*].price`}
                              </pre>
                            </div>
                          </section>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <ResizeHandle/>
      </div>
    </div>
  );
};

export default UpdatedCode;













