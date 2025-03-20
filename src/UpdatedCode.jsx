import React, { useEffect, useMemo, useRef, useState } from 'react';
import { JSONPath } from 'jsonpath-plus';
import { ChevronDown, Upload, Download, Terminal, Book, ChevronLeft } from "lucide-react";
import { v4 as uuidv4 } from "uuid"
import { Link } from 'react-router-dom';
import JSZip from 'jszip';



// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Editor from '@monaco-editor/react';


import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./components/ui/tooltip"
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
import { handleJSON } from './utils/jsonHandler';
import _ from 'lodash';
import moment from 'moment';
import * as R from 'ramda';

import HighLightedJSON from './utils/HighLightedJson';
import HighlightedScript from './utils/HighlightedScript';
import HighlightedActualOutput from './utils/HighlightedActualOutput';
import HighlightedExpectedOutput from './utils/HighlightedExpectedOutput';
import SnapLogicFunctionsHandler from './utils/SnaplogicFunctionsHandler';
import { Documentation } from './components/ui/Documentation';
import SupportButton from './components/ui/supportButton';
import SnapLogicTutorial from './components/ui/snaplogicTutorial';
import { createClient } from "@supabase/supabase-js";
import Joyride, { STATUS } from 'react-joyride';
import Cookies from 'js-cookie';
import { tutorialData } from './components/ui/tutorialData';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);















const UpdatedCode = () => {

  const [showRefreshDialog, setShowRefreshDialog] = useState(false);
  const [tutorialScriptContent, setTutorialScriptContent] = useState("");
const [tutorialOutput, setTutorialOutput] = useState("");
const [tutorialExerciseSuccess, setTutorialExerciseSuccess] = useState(false);
const [isGuideActive, setIsGuideActive] = useState(() => {
  // Check if the user has completed the tour before
  const hasCompletedTour = Cookies.get('hasCompletedTour');
  return hasCompletedTour !== 'true';
});
const RefreshWarningDialog = ({ isOpen, onCancel, onReload }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-none shadow-lg max-w-md">
        <h2 className="text-xl font-semibold mb-2 font-['Manrope']">Reload site?</h2>
        <p className="text-gray-600 mb-6 font-['Manrope']">Changes you made may not be saved.</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-none font-['Manrope']"
          >
            Cancel
          </button>
          <button
            onClick={onReload}
            className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-none font-['Manrope']"
          >
            Reload
          </button>
        </div>
      </div>
    </div>
  );
};

// Add these effects after your other useEffect hooks
useEffect(() => {
  const handleBeforeUnload = (e) => {
    e.preventDefault();
    e.returnValue = '';
    return 'Changes you made may not be saved.';
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, []);

useEffect(() => {
  const handleRefreshClick = (e) => {
    if (e.target.matches('[aria-label="Refresh"]') || e.target.closest('[aria-label="Refresh"]')) {
      e.preventDefault();
      setShowRefreshDialog(true);
    }
  };

  document.addEventListener('click', handleRefreshClick, true);
  return () => document.removeEventListener('click', handleRefreshClick, true);
}, []);

  const steps = [
    {
      target: '.input-explorer-section',
      content: 'Place to see,add and edit your input payload',
      placement: 'left',
      disableBeacon: true
    },
    {
      target: '.script-explorer-section',
      content: 'Place to see and add the script files',
      placement: 'left',
      disableBeacon: true
    },
    {
      target: '.script-section',
      content: 'Write your transformation script here',
      placement: 'bottom'
    },
    {
      target: '.actual-output-section',
      content: 'See your transformed output here',
      placement: 'right'
    },
    {
      target: '.expected-output-section',
      content: 'write your expected output here',
      placement: 'right'
    }
  ];

  const joyrideStyles = {
    options: {
      arrowColor: '#fff',
      backgroundColor: '#fff',
      overlayColor: 'rgba(0, 0, 0, 0.5)',
      primaryColor: '#007bff',
      textColor: '#333',
      width: 300,
      zIndex: 10000,
    },
    tooltip: {
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
    },
    buttonNext: {
      backgroundColor:'rgb(27, 78, 141)',
      color: '#fff',
      padding: '8px 16px',
      borderRadius: '4px'
    },
    buttonBack: {
      marginRight: '10px',
      color: '#666'
    },
    buttonSkip: {
      color: '#666'
    }
  };

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Set cookie to expire in 3 minutes
      const threeMinutesFromNow = new Date(new Date().getTime() + 3 * 60 * 1000);
      Cookies.set('hasCompletedTour', 'true', { 
        expires: threeMinutesFromNow,
        sameSite: 'strict'
      });
      setIsGuideActive(false);
    }
  };
  const resetTutorial = () => {
    Cookies.remove('hasCompletedTour');
    setIsGuideActive(true);
  };



 

  const [showSolution, setShowSolution] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [currentSubTopicIndex, setCurrentSubTopicIndex] = useState(0);
  const [openSections, setOpenSections] = useState(['introduction']); 
 
  const [selectedSubTopic, setSelectedSubTopic] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);

  // const [showDocumentation, setShowDocumentation] = useState(false);
  const [format, setFormat] = useState('json');
 
  const canvasRef = useRef(null);
  const [activeLineIndex, setActiveLineIndex] = useState(null);




  const [activeInput, setActiveInput] = useState('Payload');


  const [cursorPosition, setCursorPosition] = useState(0);
  const [focusedLine, setFocusedLine] = useState(null);
  const [wasChecked, setWasChecked] = useState(() =>
    localStorage.getItem('wasChecked') === 'true'
);




  const [selectedFile, setSelectedFile] = useState(null);








    const [hoveredLine, setHoveredLine] = useState(null);
const [highlightedLine, setHighlightedLine] = useState(null);




    const [showInputContainer, setShowInputContainer] = useState(false);
    const [showScriptContainer, setShowScriptContainer] = useState(false);
   
const [inputs, setInputs] = useState(['Payload']);




const [inputContents, setInputContents] = useState({
  [inputs[0]]: JSON.stringify({
    Message: "Hello World!"
  }, null, 2)
});




  const [isPayloadView, setIsPayloadView] = useState(false);
  const [selectedInputIndex, setSelectedInputIndex] = useState(null);
  const [payloadContent, setPayloadContent] = useState('{\n\n}');
  const [outputMatch, setOutputMatch] = useState(true);
  const [activeNavItem, setActiveNavItem] = useState('Mapper');
  const [currentView, setCurrentView] = useState('Mapper');
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  // const [activeInput, setActiveInput] = useState('Payload');
 
  const [leftWidth, setLeftWidth] = useState(() =>
    parseInt(localStorage.getItem('leftWidth')) || 288
  );
  const [middleWidth, setMiddleWidth] = useState(() =>
    parseInt(localStorage.getItem('middleWidth')) || 500
  );
  const [rightWidth, setRightWidth] = useState(() =>
    parseInt(localStorage.getItem('rightWidth')) || 384
  );
  const data = {
    "myarray": [3, 6, 8, 2, 9, 4],
    "head": [1, 2],
    "middle": [3, 4],
    "tail": [5, 6],
    "names": ["Fred", "Wilma", "Fred", "Betty", "Fred", "Barney"],
    "Array": [0, 2, 4, 6, 8]
  };
 
  useEffect(() => {
    localStorage.setItem('leftWidth', leftWidth);
    localStorage.setItem('middleWidth', middleWidth);
    localStorage.setItem('rightWidth', rightWidth);
  }, [leftWidth, middleWidth, rightWidth]);
 
  const [bottomHeight, setBottomHeight] = useState(32);
  const [isBottomExpanded, setIsBottomExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [showToast, setShowToast] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isInputDialogOpen, setIsInputDialogOpen] = useState(false);
  const [isScriptDialogOpen, setIsScriptDialogOpen] = useState(false);
 
  const [newInput, setNewInput] = useState("");
 
  const [expectedOutput, setExpectedOutput] = useState('{}');
  const [actualOutput, setActualOutput] = useState('[\n  "Phone"\n]');
  const [scripts, setScripts] = useState([
    {
      id: 1,
      name: 'main.slexpr',
      content: '$',
      lastModified: new Date()
    }
  ]);
 




  // const [activeScript, setActiveScript] = useState(scripts[0]);
  const [activeScript, setActiveScript] = useState(null);
const [scriptContent, setScriptContent] = useState('');
  const [newScript, setNewScript] = useState("");
  // const [scriptContent, setScriptContent] = useState(scripts[0].content);

  useEffect(() => {
    if (scripts.length > 0 && !activeScript) {
      const mainScript = scripts.find(s => s.name === 'main.slexpr') || scripts[0];
      setActiveScript(mainScript);
      setScriptContent(mainScript.content);
    }
  }, []);
  const ExplanationPanel = ({ content }) => {
    // Function to preserve formatting
    const formatContent = (text) => {
      return text.split('\n').map((line, index) => (
        <React.Fragment key={index}>
          {line}
          <br />
        </React.Fragment>
      ));
    };
  
    return (
      <div className="p-6 overflow-auto">
        <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
          {content}
        </pre>
      </div>
    );
  };
  

  

  // const [initialPayloadSet, setInitialPayloadSet] = useState(false);

  // // Add this useEffect for initial payload setup
  // useEffect(() => {
  //   if (!initialPayloadSet && inputs.length > 0) {
  //     // Set initial active input
  //     const firstInput = inputs[0];
  //     setActiveInput(firstInput);
      
  //     // Set initial payload content
  //     if (inputContents[firstInput]) {
  //       setPayloadContent(inputContents[firstInput]);
  //     } else {
  //       // Set default payload if none exists
  //       const defaultPayload = '{\n  \n}';
  //       setInputContents(prev => ({
  //         ...prev,
  //         [firstInput]: defaultPayload
  //       }));
  //       setPayloadContent(defaultPayload);
  //     }
  //     setInitialPayloadSet(true);
  //   }
  // }, [inputs, inputContents, initialPayloadSet]);
  



  const [selectedTopic, setSelectedTopic] = useState(tutorialData[0]);
  
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
  const [editorLines, setEditorLines] = useState(['']);
 
  // Convert these direct declarations to useMemo to prevent unnecessary recalculations
  const scriptLines = useMemo(() =>
    scriptContent?.split('\n') || [''],
    [scriptContent]
  );


  const expectedLines = useMemo(() =>
    expectedOutput?.split('\n') || [''],
    [expectedOutput]
  );


  const actualLines = useMemo(() =>
    actualOutput?.split('\n') || [''],
    [actualOutput]
  );


  // Button disable conditions
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
    setPayloadContent(e.target.value);
  };




  const handleInputClick = (input, index) => {
    setIsPayloadView(true);
    setSelectedInputIndex(index);
    setActiveInput(input);
    setPayloadContent(inputContents[input] || '{\n  \n}');
  };




  const handleBackClick = () => {
    if (selectedInputIndex !== null) {
      const currentInput = inputs[selectedInputIndex];
      // Save content only for the current input
      setInputContents(prev => ({
        ...prev,
        [currentInput]: payloadContent
      }));
    }
    setIsPayloadView(false);
  };
 
  const handleCreateInput = () => {
    if (newInput.trim() !== "") {
      const newInputName = newInput;
      setInputs(prev => [...prev, newInputName]);
      setInputContents(prev => ({
        ...prev,
        [newInputName]: '{\n  \n}'  // Initialize with empty object
      }));
      setNewInput("");
      setIsInputDialogOpen(false);
    }
  };




  const handleScriptChange = (e) => {
    setNewScript(e.target.value);
  };




  const handleCreateScript = () => {
    if (newScript.trim() !== "") {
      // Save current script content before creating new one
      if (activeScript) {
        setScripts(prevScripts =>
          prevScripts.map(s =>
            s.id === activeScript.id
              ? { ...s, content: scriptContent, lastModified: new Date() }
              : s
          )
        );
      }
  
      const scriptName = newScript.endsWith('.dwl') ? newScript : `${newScript}.dwl`;
      const newScriptObj = {
        id: Date.now(),
        name: scriptName,
        content: '',  // Initialize with empty content
        lastModified: new Date()
      };
      
      setScripts(prev => [...prev, newScriptObj]);
      setActiveScript(newScriptObj);
      setScriptContent('');  // Clear content for new script
      setNewScript("");
      setIsScriptDialogOpen(false);
    }
  };




  const handleScriptSelect = (script) => {
    // Save current script content before switching
    if (activeScript) {
      setScripts(prevScripts =>
        prevScripts.map(s =>
          s.id === activeScript.id
            ? { ...s, content: scriptContent, lastModified: new Date() }
            : s
        )
      );
    }
    
    // Switch to selected script
    setActiveScript(script);
    setScriptContent(script.content);
  };




  const handleActualOutputChange = (newValue) => {
    if(!showTutorial){
    setActualOutput(newValue);
  }
  else{
    setTutorialOutput(newValue)
  }
  };

  const handleTutorialActualOutputChange = (newValue) => {
    setTutorialOutput(newValue);
    
    // Check if the new output matches expected output
    try {
      const expectedOutput = selectedSubTopic?.exercise?.expectedOutput || selectedTopic?.exercise?.expectedOutput;
      if (expectedOutput) {
        const normalizedActual = JSON.stringify(JSON.parse(newValue));
        const normalizedExpected = JSON.stringify(JSON.parse(expectedOutput));
        setTutorialExerciseSuccess(normalizedActual === normalizedExpected);
      }
    } catch (error) {
      setTutorialExerciseSuccess(false);
    }
  };

  const scrollbarStyle = {
    WebkitScrollbar: {
      width: '8px',
      height: '8px'
    },
    WebkitScrollbarTrack: {
      background: 'transparent'
    },
    WebkitScrollbarThumb: {
      background: '#888',
      borderRadius: '4px'
    },
    WebkitScrollbarCorner: {
      background: 'transparent'
    },
    msOverflowStyle: '-ms-autohiding-scrollbar'
  };
  const scrollbarStyle1 = {
    WebkitScrollbar: {
      width: '8px',
      height: '8px'
    },
    WebkitScrollbarTrack: {
      background: 'transparent'
    },
    WebkitScrollbarThumb: {
      background: '#888',
      borderRadius: '4px'
    },
    WebkitScrollbarCorner: {
      background: 'transparent'
    },
    msOverflowStyle: '-ms-autohiding-scrollbar'
  };
 
  const handleExpectedOutputChange = (newValue) => {
    setExpectedOutput(newValue);
  };
  const detectFunctionType = (script) => {
    if (script.startsWith('$')) return 'jsonPath';
    if (script.includes('match')) return 'match';
    return 'general';
  };




  useEffect(() => {
    if (activeScript && payloadContent) {
      try {
        const handler = new SnapLogicFunctionsHandler();
        const inputData = JSON.parse(payloadContent);
        const result = handler.executeScript(scriptContent, inputData);
        setActualOutput(JSON.stringify(result, null, 2));
      } catch (error) {
        setActualOutput(JSON.stringify({
          error: "Transformation Error",
          message: error.message,
          hint: "Check input format and script syntax"
        }, null, 2));
      }
    }
  }, [payloadContent, scriptContent]);




 
  const handleScriptContentChange = (e) => {
    if (!e?.target) {
      setActualOutput(JSON.stringify({ error: "Invalid event" }, null, 2));
      return;
    }
  
  
  
  
    const newContent = e.target.value || '';
    setScriptContent(newContent);
    
    // Update script content in scripts array immediately
    setScripts(prevScripts =>
      prevScripts.map(script =>
        script.id === activeScript?.id
          ? { ...script, content: newContent, lastModified: new Date() }
          : script
      )
    );
  
  
  
  
    try {
      const handler = new SnapLogicFunctionsHandler();
     
      // Handle multiple inputs case
      if (inputs.length > 1 && newScript.trim() === '$') {
        setActualOutput("Not valid, access with the help of input name");
        return;
      }
  
  
  
  
      // Handle single input case
      if (inputs.length === 1 && newScript.trim() === '$') {
        setActualOutput(inputContents[inputs[0]]);
        return;
      }
  
  
  
  
      // For multiple inputs case
      const inputMatch = newScript.match(/^\$(\w+)/);
      if (inputMatch) {
        const requestedInput = inputMatch[1];
        if (inputContents[requestedInput]) {
          // Just show input content for $inputName
          if (newScript === `$${requestedInput}`) {
            setActualOutput(inputContents[requestedInput]);
            return;
          }
  
  
  
  
          // Execute script with specific input
          const path = newScript.replace(`$${requestedInput}`, '$');
          const inputData = JSON.parse(inputContents[requestedInput]);
          const result = handler.executeScript(path, inputData);
          setActualOutput(JSON.stringify(result, null, 2));
          return;
        }
      }
  
  
  
  
      // Default to active input
      const activeInput = inputs[selectedInputIndex] || inputs[0];
      let inputData;
     
      try {
        inputData = JSON.parse(inputContents[activeInput]);
      } catch (error) {
        setActualOutput(JSON.stringify({
          error: "Invalid Input",
          message: "Input data must be valid JSON",
          input: inputContents[activeInput]
        }, null, 2));
        return;
      }
  
  
  
  
      // Execute script with handler
      const result = handler.executeScript(newScript, inputData);
      setActualOutput(JSON.stringify(result, null, 2));
  
  
  
  
    } catch (error) {
      // console.error("Transformation Error:", error);
      setActualOutput(JSON.stringify({
        error: "Transformation Error",
        message: error.message || "Unknown error occurred",
        input: newScript,
        hint: "Check syntax and ensure all referenced paths exist"
      }, null, 2));
    }
  };
  
  const handleTutorialScriptContentChange = (e) => {
    if (!e?.target) {
      setTutorialOutput(JSON.stringify({ error: "Invalid event" }, null, 2));
      return;
    }
  
    const newContent = e.target.value || '';
    setTutorialScriptContent(newContent);
  
    try {
      const handler = new SnapLogicFunctionsHandler();
  
      // Get the exercise input
      const exerciseInput = selectedSubTopic?.exercise?.input || selectedTopic?.exercise?.input;
      console.log('Raw exercise input:', exerciseInput); // Debug log
  
      let inputData;
      try {
        // Ensure input is properly formatted as JSON
        const cleanedInput = exerciseInput
          ?.trim()
          ?.replace(/,\s*}/g, "}")  // Remove trailing commas in objects
          ?.replace(/,\s*\]/g, "]")  // Remove trailing commas in arrays
          ?.replace(/([{,])\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":') // Ensure keys are quoted
          ?.replace(/:\s*([^"{\[\d].*?)\s*([,}])/g, ':"$1"$2') // Ensure string values are quoted
          ?.replace(/\s+/g, ' ') || '{}';
  
        console.log('Cleaned input:', cleanedInput); // Debug log
  
        // Validate JSON before parsing
        if (!cleanedInput.startsWith('{') || !cleanedInput.endsWith('}')) {
          throw new Error('Invalid JSON format: Must be a valid object');
        }
  
        inputData = JSON.parse(cleanedInput);
        console.log('Parsed input data:', inputData); // Debug log
      } catch (err) {
        console.error('Input parsing error:', err);
        setTutorialOutput(JSON.stringify({
          error: "Invalid exercise input format",
          rawInput: exerciseInput,
          message: err.message
        }, null, 2));
        return;
      }
  
      // Execute script
      const result = handler.executeScript(newContent, inputData);
      console.log('Execution result:', result); // Debug log
  
      // Format and set output
      const resultStr = JSON.stringify(result, null, 2);
      setTutorialOutput(resultStr);
  
      // Check against expected output
      const expectedOutput = selectedSubTopic?.exercise?.expectedOutput || selectedTopic?.exercise?.expectedOutput;
      const normalizedResult = resultStr.trim();
      const normalizedExpected = expectedOutput.trim();
      setTutorialExerciseSuccess(normalizedResult === normalizedExpected);
  
    } catch (error) {
      console.error('Script execution error:', error);
      setTutorialOutput(JSON.stringify({
        error: "Script execution failed",
        message: error.message
      }, null, 2));
      setTutorialExerciseSuccess(false);
    }
  };


  useEffect(() => {
    if (showTutorial) {
        try {
            // Ensure expected output is retrieved correctly
            const expectedOutput = (selectedSubTopic?.exercise?.expectedOutput || selectedTopic?.exercise?.expectedOutput || "").trim();
            const actualOutput1 = (tutorialOutput || "").trim();

            // Debugging: Log before comparison
            console.log("🛠 Expected Output (Raw):", expectedOutput);
            console.log("🛠 Actual Output (Raw):", actualOutput1);

            if (!expectedOutput || !actualOutput1) {
                console.warn("⚠️ Skipping comparison: expectedOutput or tutorialOutput is empty.");
                return;
            }

            // Normalize outputs (remove extra quotes, trim spaces)
            const normalizeOutput = (output) => {
                try {
                    const parsed = JSON.parse(output);
                    return typeof parsed === 'string' 
                        ? parsed.normalize("NFC").trim()  // Normalize Unicode & trim spaces
                        : JSON.stringify(parsed).normalize("NFC").trim();
                } catch {
                    return output.toString().normalize("NFC").trim();
                }
            };

            const cleanExpected = normalizeOutput(expectedOutput).replace(/['"]/g, '');
            const cleanActual = normalizeOutput(actualOutput1).replace(/['"]/g, '');

            console.log("✅ Expected Output (Cleaned):", cleanExpected);
            console.log("✅ Actual Output (Cleaned):", cleanActual);
            console.log("✅ Is Match:", cleanExpected === cleanActual);

            // Force re-render by setting state in a timeout (ensures UI updates correctly)
            setTimeout(() => {
              const isMatch = cleanExpected === cleanActual;
              setTutorialExerciseSuccess(isMatch);
              
              // Show success toast if exercise is completed successfully
              if (isMatch) {
                setShowSuccessToast(true);
                // Hide toast after 5 seconds
                setTimeout(() => {
                  setShowSuccessToast(false);
                }, 5000);
              }
            }, 0);

        } catch (error) {
            console.error("❌ Error comparing outputs:", error);
            setTutorialExerciseSuccess(false);
        }
    }
}, [showTutorial, tutorialOutput, selectedSubTopic, selectedTopic,scriptContent]);

// components/ui/CopyButton.jsx
const CopyButton = ({ content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const content1=content.trim();
      await navigator.clipboard.writeText(content1);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="
        absolute 
        top-2 
        right-3 
        bg-white-800 
        hover:bg-white-800
        focus:border-none
        focus:outline-none
        hover:border-none
        hover:outline-none
        px-2.5 
        py-1 
        duration-200
        z-10
      "
    >
      <img
        src={copied ? "/famicons--copy.svg" : "/tabler--copy.svg"} // Change icon when copied
        alt={copied ? "copied" : "copy"}
        className={`object-contain transition-all duration-200 ${
          copied ? 'scale-110' : ''
        }`}
        style={{
          width: isTablet ? '5px' : '13px',
          height: isTablet ? '5px' : '13px'
        }}
      />
    </button>
  );
};





  
  
  const parseExerciseInput = (inputString) => {
    try {
      // Clean the input string
      const cleanInput = inputString
        .trim()
        .replace(/^\n+|\n+$/g, ''); // Remove leading/trailing newlines
      return JSON.parse(cleanInput);
    } catch (error) {
      console.error('Failed to parse exercise input:', error);
      return null;
    }
  };
  







  // useEffect(() => {
  //   console.log("Actual output updated:", actualOutput) // Debugging log
  // }, [actualOutput])
 
  const textAreaStyles = {
    minHeight: '100px',
    lineHeight: '1.5rem',
    padding: '0',
    border: 'none'
  };
  const normalizeJSON = (input) => {
    try {
      if (!input) return '';
     
      // If input is already an object/array, stringify it
      if (typeof input === 'object') {
        return JSON.stringify(input);
      }
 
      // If input is a string, try to parse and re-stringify to normalize
      if (typeof input === 'string') {
        const parsed = JSON.parse(input.trim());
        return JSON.stringify(parsed);
      }
 
      return String(input);
    } catch (error) {
      console.error('JSON normalization error:', error);
      return String(input);
    }
  };
 

  const storeMatchingData = async () => {
    try {
        const dataToInsert = [{
            script_content: scriptContent || '',
            actual_output: actualOutput || '',
            active_payload: JSON.stringify(inputContents[activeInput] || '{}'),
            topic_id: selectedSubTopic?.id || selectedTopic?.id || 'default',
        }];

        // console.log('Attempting to insert:', dataToInsert);

        const { data, error } = await supabase
            .from('snap_output_matched_data')  // Updated table name
            .insert(dataToInsert)
            .select('*');

        if (error) {
            console.error('Supabase error details:', JSON.stringify(error, null, 2));
            // alert(`Insert Error: ${error.message}`);
            return;
        }

        // console.log('Successfully inserted data:', data);

    } catch (error) {
        // console.error('Error in storeMatchingData:', error.message);
    }
};




  useEffect(() => {
    const compareOutputs = () => {
      try {
        if (!actualOutput || !expectedOutput) {
          setOutputMatch(false);
          return;
        }
 
        const normalizeJSON = (input) => {
          try {
            return JSON.stringify(JSON.parse(input));
          } catch {
            return input;
          }
        };
 
        const normalizedActual = normalizeJSON(actualOutput);
        const normalizedExpected = normalizeJSON(expectedOutput);
 
        setOutputMatch(normalizedActual === normalizedExpected);
      } catch (error) {
        console.error('Comparison error:', error);
        setOutputMatch(false);
      }
    };
 
    compareOutputs();
  }, [actualOutput, expectedOutput]);
  
  useEffect(() => {
    const testInsert = async () => {
      if (outputMatch) {
        // console.log('Testing insert...');
        await storeMatchingData();
      }
    };
    testInsert();
  }, [outputMatch]);
 




 
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.zip')) {
      setSelectedFile(file);
      setShowImportDialog(false);
    }
  };
 
  const handleFileDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.name.endsWith('.zip')) {
      setSelectedFile(file);
      setShowImportDialog(false);
    }
  };
 
  const [shouldShowExportDialog, setShouldShowExportDialog] = useState(() =>
    localStorage.getItem('showExportDialog') !== 'false'
  );




  const handleExport = async () => {
    try {
      // Create a new JSZip instance
      const zip = new JSZip();
  
      // Add files to the zip
      // Add scripts
      const scriptsFolder = zip.folder("scripts");
      scripts.forEach(script => {
        scriptsFolder.file(script.name, script.content);
      });
  
      // Add inputs
      const inputsFolder = zip.folder("inputs");
      Object.entries(inputContents).forEach(([name, content]) => {
        inputsFolder.file(`${name}.json`, content);
      });
  
      // Add metadata
      const metadata = {
        version: "1.0",
        exportDate: new Date().toISOString(),
        scripts: scripts.map(s => ({
          name: s.name,
          lastModified: s.lastModified
        })),
        inputs: inputs,
        expectedOutput: expectedOutput
      };
      zip.file("metadata.json", JSON.stringify(metadata, null, 2));
  
      // Generate the zip file
      const content = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {
          level: 9
        }
      });
  
      // Create download link and trigger download
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `snaplogic-playground-export-${moment().format('YYYY-MM-DD-HH-mm')}.zip`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
      // Optionally show error to user
      alert('Export failed. Please try again.');
    }
  };
  
 
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    setWasChecked(true);
    localStorage.setItem('wasChecked', 'true');
    setShowExportDialog(false);
};


const handleNavigation = (page, e) => {
  if (e) {
    e.preventDefault();
  }
  
  if (page === 'docs') {
    setShowDocumentation(true);
    setActiveNavItem('docs');
  } else {
    setActiveNavItem(page);
    setShowDocumentation(false);
  }
};


const getNavLink = (item) => ({
  blogs: 'https://blogs.mulecraft.in/',
  docs: 'https://docs-snaplogic.atlassian.net/wiki/spaces/SD/overview',  // <-- Internal Route
  tutorial: '#',
  Mapper: '/'
})[item];



// const handleNavClick = (item, e) => {
//   if (e) {
//     e.preventDefault();
//   }
  
//   const link = getNavLink(item);
//   if (link.startsWith('http')) {
//     window.open(link, '_blank');
//   } else if (item === 'docs') {
//     setShowDocumentation(true);
//     setActiveNavItem('docs');
//   } else {
//     setActiveNavItem(item);
//     setShowDocumentation(false);
//   }
// };
const handleNavClick = (item) => {
  if (item === 'tutorial') {
    setShowTutorial(true);
    setSelectedTopic(tutorialData[0]);
    setSelectedSubTopic(null);
    setActiveNavItem('tutorial');
  } else if (item === 'Mapper') {
    setShowTutorial(false);
    setActiveNavItem('Mapper');
  } else if (getNavLink(item).startsWith('http')) {
    window.open(getNavLink(item), '_blank');
    setActiveNavItem(item);
  }
};

const TopicItem = ({ 
  topic, 
  selectedTopic, 
  selectedSubTopic, 
  openSections, 
  setSelectedTopic, 
  setSelectedSubTopic, 
  setOpenSections,
  depth,
  tutorialExerciseSuccess // Add this prop
}) => {
  const hasSubTopics = topic.subTopics && topic.subTopics.length > 0;
  const isSelected = selectedSubTopic?.id === topic.id || 
                    (!selectedSubTopic && selectedTopic.id === topic.id);
  const marginLeft = `${depth * 1.75}rem`;

  return (
    <div className="mb-3">
      <div 
        className={`flex items-center justify-between cursor-pointer group px-2 hover:bg-[#e5e7eb] rounded-r-full mr-2 py-1.5
          ${isSelected ? 
            'bg-[#1B4E8D] text-white before:content-[""] before:absolute before:left-0 before:w-[2px] before:bg-[#0ea5e9]' : 
            'text-[#5C5C5C]'
          }`}
        style={{ marginLeft: depth > 0 ? marginLeft : '0' }}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedTopic(topic);
          setSelectedSubTopic(null);
          if (hasSubTopics) {
            setOpenSections(prev => 
              prev.includes(topic.id) 
                ? prev.filter(id => id !== topic.id)
                : [...prev, topic.id]
            );
          }
        }}
      >
        <div className="flex items-center">
          {hasSubTopics && (
            <img
            src="/chevron_down_small.svg"
            alt="SnapLogic Logo"
            className={`h-3.5 w-3.5 mr-1 transform transition-transform duration-200 ${
              openSections.includes(topic.id) ? '' : '-rotate-90'
            }`}
            color={isSelected ? "#ffffff" : "#5C5C5C"}
          />
            // <ChevronDown 
            //   className={`h-3.5 w-3.5 mr-1 transform transition-transform duration-200 ${
            //     openSections.includes(topic.id) ? '' : '-rotate-90'
            //   }`}
            //   color={isSelected ? "#ffffff" : "#5C5C5C"}
            // />
          )}
          <span className={`text-[13px] font-['system-ui']`}>
            {topic.title}
          </span>
        </div>

        {/* Add tick icon */}
        {tutorialExerciseSuccess && isSelected && (
          <svg 
            className={`w-3.5 h-3.5 ml-2 ${isSelected ? 'text-white' : 'text-white-500'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
      
      {openSections.includes(topic.id) && hasSubTopics && (
        <div className="mt-2 space-y-2">
          {topic.subTopics.map(subTopic => (
            <TopicItem
              key={subTopic.id}
              topic={subTopic}
              selectedTopic={selectedTopic}
              selectedSubTopic={selectedSubTopic}
              openSections={openSections}
              setSelectedTopic={setSelectedTopic}
              setSelectedSubTopic={setSelectedSubTopic}
              setOpenSections={setOpenSections}
              depth={depth + 1}
              tutorialExerciseSuccess={tutorialExerciseSuccess} // Pass the prop
            />
          ))}
        </div>
      )}
    </div>
  );
};


const handlePrevNavigation = () => {
  try {
    if (!hasPrev || !selectedTopic) return;

    // Helper function to get the last subtopic of a topic
    const getLastSubtopic = (topic) => {
      return topic.subTopics && topic.subTopics.length > 0 
        ? topic.subTopics[topic.subTopics.length - 1] 
        : null;
    };

    // Find current indices
    const currentTopicIdx = tutorialData.findIndex(t => t.id === selectedTopic.id);
    const currentTopic = tutorialData[currentTopicIdx];

    if (selectedSubTopic) {
      // Currently in a subtopic
      const currentSubTopicIdx = currentTopic.subTopics?.findIndex(st => st.id === selectedSubTopic.id) ?? -1;

      if (currentSubTopicIdx > 0) {
        // Move to previous subtopic in current topic
        setSelectedSubTopic(currentTopic.subTopics[currentSubTopicIdx - 1]);
      } else if (currentTopicIdx > 0) {
        // Move to previous topic
        const prevTopic = tutorialData[currentTopicIdx - 1];
        setSelectedTopic(prevTopic);
        const lastSubtopic = getLastSubtopic(prevTopic);
        if (lastSubtopic) {
          setSelectedSubTopic(lastSubtopic);
          setOpenSections(prev => Array.from(new Set([...prev, prevTopic.id])));
        } else {
          setSelectedSubTopic(null);
        }
      }
    } else {
      // Currently in a main topic
      if (currentTopicIdx > 0) {
        const prevTopic = tutorialData[currentTopicIdx - 1];
        setSelectedTopic(prevTopic);
        const lastSubtopic = getLastSubtopic(prevTopic);
        if (lastSubtopic) {
          setSelectedSubTopic(lastSubtopic);
          setOpenSections(prev => Array.from(new Set([...prev, prevTopic.id])));
        } else {
          setSelectedSubTopic(null);
        }
      }
    }
  } catch (error) {
    console.error('Navigation error:', error);
  }
};

const handleNextNavigation = () => {
  try {
    if (!hasNext || !selectedTopic) return;

    // Helper function to get the first subtopic of a topic
    const getFirstSubtopic = (topic) => {
      return topic.subTopics && topic.subTopics.length > 0 
        ? topic.subTopics[0] 
        : null;
    };

    // Find current indices
    const currentTopicIdx = tutorialData.findIndex(t => t.id === selectedTopic.id);
    const currentTopic = tutorialData[currentTopicIdx];

    if (selectedSubTopic) {
      // Currently in a subtopic
      const currentSubTopicIdx = currentTopic.subTopics?.findIndex(st => st.id === selectedSubTopic.id) ?? -1;

      if (currentSubTopicIdx < (currentTopic.subTopics?.length ?? 0) - 1) {
        // Move to next subtopic in current topic
        setSelectedSubTopic(currentTopic.subTopics[currentSubTopicIdx + 1]);
      } else if (currentTopicIdx < tutorialData.length - 1) {
        // Move to next topic
        const nextTopic = tutorialData[currentTopicIdx + 1];
        setSelectedTopic(nextTopic);
        const firstSubtopic = getFirstSubtopic(nextTopic);
        if (firstSubtopic) {
          setSelectedSubTopic(firstSubtopic);
          setOpenSections(prev => Array.from(new Set([...prev, nextTopic.id])));
        } else {
          setSelectedSubTopic(null);
        }
      }
    } else {
      // Currently in a main topic
      const firstSubtopic = getFirstSubtopic(currentTopic);
      if (firstSubtopic) {
        // Move to first subtopic of current topic
        setSelectedSubTopic(firstSubtopic);
        setOpenSections(prev => Array.from(new Set([...prev, currentTopic.id])));
      } else if (currentTopicIdx < tutorialData.length - 1) {
        // Move to next topic
        const nextTopic = tutorialData[currentTopicIdx + 1];
        setSelectedTopic(nextTopic);
        const nextFirstSubtopic = getFirstSubtopic(nextTopic);
        if (nextFirstSubtopic) {
          setSelectedSubTopic(nextFirstSubtopic);
          setOpenSections(prev => Array.from(new Set([...prev, nextTopic.id])));
        } else {
          setSelectedSubTopic(null);
        }
      }
    }
  } catch (error) {
    console.error('Navigation error:', error);
  }
};

const hasPrev = useMemo(() => {
  try {
    if (!selectedTopic) return false;
    const currentTopicIdx = tutorialData.findIndex(t => t.id === selectedTopic.id);
    
    if (selectedSubTopic) {
      const currentTopic = tutorialData[currentTopicIdx];
      const currentSubTopicIdx = currentTopic.subTopics?.findIndex(st => st.id === selectedSubTopic.id) ?? -1;
      return currentSubTopicIdx > 0 || currentTopicIdx > 0;
    }
    
    return currentTopicIdx > 0;
  } catch (error) {
    console.error('hasPrev calculation error:', error);
    return false;
  }
}, [selectedTopic, selectedSubTopic, tutorialData]);

const hasNext = useMemo(() => {
  try {
    if (!selectedTopic) return false;
    const currentTopicIdx = tutorialData.findIndex(t => t.id === selectedTopic.id);
    const currentTopic = tutorialData[currentTopicIdx];
    
    if (selectedSubTopic) {
      const currentSubTopicIdx = currentTopic.subTopics?.findIndex(st => st.id === selectedSubTopic.id) ?? -1;
      return currentSubTopicIdx < (currentTopic.subTopics?.length ?? 0) - 1 || 
             currentTopicIdx < tutorialData.length - 1;
    }
    
    return Boolean(currentTopic.subTopics?.length) || 
           currentTopicIdx < tutorialData.length - 1;
  } catch (error) {
    console.error('hasNext calculation error:', error);
    return false;
  }
}, [selectedTopic, selectedSubTopic, tutorialData]);  




const styles = {
  tableOfContents: {
    borderRight: '1px solid #e5e7eb',
    width: '300px',
  },
  explanation: {
    flex: 1,
    borderLeft: '1px solid #e5e7eb',
  },
  header: {
    height: '48px',
    borderBottom: '1px solid #e5e7eb',
    padding: '0 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
  },
  headerText: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#4a5568',
  },
  topic: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  activeSection: {
    backgroundColor: '#0ea5e9',
    color: 'white',
  },
  subTopic: {
    padding: '8px 32px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#4a5568',
  },
  content: {
    padding: '24px 32px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  tutorialNav: {
    backgroundColor: '#f8f9fa',
    '& .section-item': {
      transition: 'background-color 0.2s',
      '&:hover': {
        backgroundColor: '#e5e7eb'
      }
    }
  },
  activeSubTopic: {
    backgroundColor: '#0ea5e9',
    color: 'white',
    borderTopRightRadius: '9999px',
    borderBottomRightRadius: '9999px',
    marginRight: '8px',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: '2px',
      backgroundColor: '#0ea5e9'
    }
  },
  pre: `
  white-space: pre-wrap;
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.6;
  padding: 1rem;
`,
bullet: `
  margin-left: 1rem;
  position: relative;
`,
bulletPoint: `
  position: absolute;
  left: -1rem;
  content: "•";
`


};


  useEffect(() => {
    setIsBottomExpanded(false);
    setBottomHeight(32);
    setActiveTab(null);
  }, []);








  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, canvas.height);
      ctx.strokeStyle = '#e5e7eb';
      ctx.stroke();
    }
  }, [scriptContent]);




  // Create active line border element
  const ActiveLineBorder = () => {
    const top = 8 + (activeLineIndex * 24); // 24px is line height
    return (
      <div
        style={{
          position: 'absolute',
          top: `${top}px`,
          left: '48px', // Adjust based on line numbers width
          right: '0', // Extend all the way to the right
          height: '24px', // Line height
          border: '1px solid #e5e7eb',
          pointerEvents: 'none',
          zIndex: 5
        }}
      />
    );
  };




 












const getLineCount = (content) => {
  if (!content) return 1;
  return content.split('\n').length;
};




// Add these responsive width calculations
const getResponsiveWidths = () => {
  const screenWidth = window.innerWidth;
 
  if (screenWidth >= 1024) { // Laptop
    return {
      leftWidth: Math.floor(screenWidth * 0.25),
      middleWidth: Math.floor(screenWidth * 0.45),
      rightWidth: Math.floor(screenWidth * 0.30)
    };
  } else if (screenWidth >= 768) { // Tablet
    return {
      leftWidth: Math.floor(screenWidth * 0.30),
      middleWidth: Math.floor(screenWidth * 0.40),
      rightWidth: Math.floor(screenWidth * 0.30)
    };
  }
  return { leftWidth, middleWidth, rightWidth }; // Default widths
};




// Add resize listener
useEffect(() => {
  const handleResize = () => {
    const { leftWidth: newLeft, middleWidth: newMiddle, rightWidth: newRight } = getResponsiveWidths();
    setLeftWidth(newLeft);
    setMiddleWidth(newMiddle);
    setRightWidth(newRight);
  };




  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);




// Add responsive styles
const responsiveStyles = {
  mainContainer: {
    minWidth: '768px',
    maxWidth: '100vw',
    overflow: 'auto'
  },
  panels: {
    minWidth: '250px'
  }
 
};
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);




  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);




  return matches;
};




// In your component
const isTablet = useMediaQuery('(max-width: 1024px)');


const monacoStyles = `
  .monaco-editor {
    padding-top: 8px;
  }
 
  .monaco-editor .margin {
    background-color: #f8f9fa;
  }
 
  .monaco-editor .line-numbers {
    color: #3498db !important;
    font-size: 12px;
  }
 
  .monaco-editor .current-line {
    border: none !important;
  }


  /* Disable editor widgets that might interfere with typing */
  .monaco-editor .suggest-widget,
  .monaco-editor .parameter-hints-widget,
  .monaco-editor .monaco-hover {
    display: none !important;
  }
`;


  const handlePayloadChange = (newContent) => {
    setPayloadContent(newContent);
    // Update the content for the current active input only
    setInputContents(prev => ({
      ...prev,
      [activeInput]: newContent
    }));
  };
  const handleFormatChange = (newFormat) => {
    setFormat(newFormat);
  };
 
  
 
  
  return (
    <>
    <RefreshWarningDialog
        isOpen={showRefreshDialog}
        onCancel={() => setShowRefreshDialog(false)}
        onReload={() => window.location.reload()}
      />
  <Joyride
   steps={steps}
   run={isGuideActive}
   continuous={true}
   showSkipButton={true}
   showProgress={true}
  styles={{
    options: {
      arrowColor: '#1B4E8D', // Updated to match modern primary color
      backgroundColor: '#ffffff',
      overlayColor: 'rgba(0, 0, 0, 0.6)', // Slightly darker for better contrast
      primaryColor: '#1B4E8D', // Stronger blue for UI consistency
      textColor: '#222', // Darker text for readability
      width: 320, // Slightly wider for better readability
      zIndex: 11000,
    },
    tooltip: {
      padding: '20px',
      borderRadius: '12px', // Rounded edges for modern look
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)', // Softer, deeper shadow
      border: '1px solid #ddd', // Subtle border for structure
      transition: 'all 0.3s ease-in-out', // Smooth fade-in effect
    },
    buttonNext: {
      backgroundColor: '#1B4E8D',
      color: '#fff',
      padding: '10px 18px', // Larger button for a more premium feel
      borderRadius: '6px',
      fontWeight: 'bold',
      boxShadow: '0 2px 5px rgba(27, 78, 141, 0.3)', // Light shadow for depth
      transition: 'background-color 0.2s ease-in-out',
      cursor: 'pointer',
      border: 'none',
    },
    buttonBack: {
      marginRight: '10px',
      color: '#555',
      fontSize: '14px',
      transition: 'color 0.2s ease-in-out',
      cursor: 'pointer',
      border: 'none',
      backgroundColor: 'transparent'
    },
    buttonSkip: {
      color: '#555',
      fontSize: '14px',
      transition: 'color 0.2s ease-in-out',
      cursor: 'pointer',
      border: 'none',
      backgroundColor: 'transparent',
      textDecoration: 'underline'
    }
  }}
  callback={handleJoyrideCallback}
/>
{showSuccessToast && (
      <div className="fixed top-4 right-4 bg-[#00B300] text-white px-1 py-0 rounded-md shadow-md z-50 flex items-center gap-1 animate-fade-in text-sm">
      {/* <div className="bg-white rounded-full p-0.5">
        <svg 
          className="w-3 h-3 text-[#00B300]" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path 
            fillRule="evenodd" 
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
            clipRule="evenodd" 
          />
        </svg>
      </div> */}
      <span className="font-medium">Right on! ✓</span>
      <button 
        onClick={() => setShowSuccessToast(false)} 
        className="text-black-400 text-xs bg-[#00B300] hover:bg-[#00B300] focus:outline-none"
      >
        ✕
      </button>
    </div>
    
    
    )}

    <div className="flex flex-col h-screen w-screen bg-white overflow-hidden">
      {/* {showToast && (
        <div className="bg-[#E9EEF4] text-[#00044C] py-2 text-[12px] relative">
          <div className="text-center px-12 font-bold font-system-default text-[12px] text-[#00044C] tracking-[0.09em] uppercase">
          🚀 Power Up Your SnapLogic Experience with SnapMapper!
</div>
<div className="text-center px-12 font-bold font-system-default text-[12px] text-[#00044C] tracking-[0.09em] uppercase">
  <a 
    href="https://discord.gg/cCGgeJVk" 
    target="_blank" 
    rel="noopener noreferrer"
    className="hover:text-blue-500 transition-colors duration-200 text-center px-12 font-bold font-system-default text-[12px] text-[#1B4E8D] tracking-[0.09em] uppercase"
  >
    Snap, Build, Deploy! | Join Our Developer Community on Discord! 🚀 
  </a>
</div>

<a
href="https://www.mulecraft.in/" 
target="_blank" 
rel="noopener noreferrer">
<img
  src="/logos--whatsapp-icon.svg"
  alt="whatsapp Logo"
  className=" object-contain"
  style={{
    width: isTablet ? '22px' : '32px',
    height: isTablet ? '22px' : '32px'
  }}
/>
</a>

<a
href="https://discord.gg/cCGgeJVk" 
target="_blank" 
rel="noopener noreferrer"
>
<img
  src="/skill-icons--discord.svg"
  alt="discord Logo"
  className=" object-contain"
  style={{
    width: isTablet ? '22px' : '32px',
    height: isTablet ? '22px' : '32px'
  }}
/>
</a>
          <button
            onClick={() => setShowToast(false)}
            className="absolute right-4 top-0 h-full bg-[#E9EEF4] text-[#00044C] border-none outline-none focus:outline-none font-bold text-[18px] flex items-center justify-center font-bold"
          >
            ×
          </button>
          
        </div>
      )} */}
{showToast && (
  <div className="bg-[#E9EEF4] text-[#00044C] py-1 text-[12px] relative flex items-center justify-between h-8">
    {/* Main content */}
    <div className="flex-grow text-center">
      <div className="font-bold font-system-default text-[12px] text-[#00044C] tracking-[0.09em] uppercase">
        🚀 Power Up Your SnapLogic Experience with SnapMapper!
      </div>
    </div>

    {/* Right side icons and close button */}
    <div className="flex items-center gap-2 mr-3">
      {/* WhatsApp Icon */}
      <a
        href="https://chat.whatsapp.com/CODwlK6RgfwBcNY02BR4yi" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center"
      >
        <img
          src="logos--whatsapp-icon.svg"
          alt="whatsapp Logo"
          className="object-contain"
          style={{
            width: '18px',
            height: '18px'
          }}
        />
      </a>

      {/* Discord Icon */}
      <a
        href="https://discord.gg/5QHZNSeF" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center"
      >
        <img
          src="/skill-icons--discord.svg"
          alt="discord Logo"
          className="object-contain"
          style={{
            width: '18px',
            height: '18px'
          }}
        />
      </a>

      {/* Close button */}
      <button
        onClick={() => setShowToast(false)}
        className="bg-[#E9EEF4] text-[#00044C] border-none outline-none focus:outline-none font-bold text-[16px] flex items-center justify-center h-8 px-1"
      >
        ×
      </button>
    </div>
  </div>
)}



      <div className="flex items-center justify-between px-6 py-2 border-b">
        <div className="flex items-center space-x-3">
          
           <img
  src="/sl-logo.svg"
  alt="SnapLogic Logo"
  className=" object-contain"
  style={{
    width: isTablet ? '22px' : '32px',
    height: isTablet ? '22px' : '32px'
  }}
/>
{/* <img
  src="/LogoN.svg"
  alt="SnapLogic"
  className=" object-contain"
  style={{
    height: isTablet ? '20px' : '32px'
  }}
/> */}
<span className='text-[#444444] text-[20px] font-bold font-[OpenSans,sans-serif]'>
  SnapMapper
</span>
        </div>
        <div className="flex items-center">
        {!showTutorial && (
  <>
        <button
  onClick={() => {
    handleExport();
    // Show dialog if not checked in current session
    if (!wasChecked) {
      setShowExportDialog(true);
    }
  }}

  className="flex items-center px-4 py-1.5 bg-white rounded border-none focus:outline-none group hover:text-blue-500 -ml-3">
  
<img
  src="/oui--export.svg"
  alt="SnapLogic Logo"
 className="mr-2 text-gray-200 group-hover:text-blue-500  h-4 w-4"
/>
  {/* <Upload className="mr-2 group-hover:text-blue-500 text-gray-500 h-3 w-3" /> */}
  <span className="
  text-[14px] 
  font-['system-ui,_-apple-system,_Segoe_UI,_Roboto,_Ubuntu,_Cantarell,_Noto_Sans,_sans-serif'] 
  font-normal 
  text-[rgb(92, 92, 92)] 
  leading-[21px] 
  tracking-[0.04em] 
  group-hover:text-blue-500
  style-normal
">
  Export
</span>
</button>
















          {showExportDialog && (
            <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
              <div className="bg-white h-[19rem] w-205" style={{ borderRadius: 0 }}>
                <div className="p-6 font-['Manrope']">
                  <h2 className="text-[1.9rem] font-bold mt-[1rem] mb-[2rem] text-gray-700">Open in Visual Studio Code</h2>
                  <div className="h-[1px] bg-gray-200 w-[calc(100%+48px)] -mx-6 mt-4 mb-[1.8rem]"></div>
                  <p className="text-sm mb-3">
                    For the best DataWeave development experience unzip and open the project on <span className="text-blue-500">VSCode</span>
                  </p>
                  <p className="text-sm mb-[3rem]">
                    Don't forget to install the <span className="text-blue-500">DataWeave Playground</span> extension
                  </p>
                  <div className="flex justify-between items-center">
                  <label
  className="flex items-center text-sm cursor-pointer select-none"
  onClick={() => {
    setIsChecked(!isChecked);
    setWasChecked(true);
    // setShowExportDialog(false);
  }}
>
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
                      className="px-3 py-2.5 text-sm bg-white border border-gray-400 hover:border-gray-400 hover:bg-gray-200 focus:border-none focus:outline-none"
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
            onClick={() => {setShowImportDialog(true);
              setSelectedFile(null);
                } }
            className="flex items-center px-4 py-1.5 bg-white rounded border-none focus:outline-none group hover:text-blue-500 -ml-4"
          >
            <img
  src="/oui--import.svg"
  alt="SnapLogic Logo"
 className="mr-2 group-hover:text-blue-500 text-gray-500 h-4 w-4"
/>
            {/* <Download className="mr-2 group-hover:text-blue-500 text-gray-500 h-3 w-3" /> */}
            <span className="
  text-[14px] 
  font-['system-ui,_-apple-system,_Segoe_UI,_Roboto,_Ubuntu,_Cantarell,_Noto_Sans,_sans-serif'] 
  font-normal 
  text-[rgb(92, 92, 92)] 
  leading-[21px] 
  tracking-[0.04em] 
  group-hover:text-blue-500
  style-normal
">
  Import
</span>
          </button>




          {showImportDialog && (
  <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
    <div className="bg-white h-[28.5rem] w-[31rem]" style={{ borderRadius: 0 }}>
      <div className="p-8 pt-10 flex flex-col h-full">
        <h2 className="text-[1.9rem] font-bold text-gray-700">Import project</h2>
        <div className="h-[1px] bg-gray-200 w-[calc(100%+48px)] -mx-6 mt-4 mb-[0.4rem]"></div>
        <div className="mt-6 flex-1 font-['Manrope']">
          <div
            className="border-2 border-dashed border-gray-600 h-[11rem] w-[27.2rem] mx-auto flex flex-col items-center justify-center cursor-pointer hover:border-gray-400"
            onClick={() => document.getElementById('fileInput').click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
          >
            <input
              id="fileInput"
              type="file"
              accept=".zip"
              onChange={handleFileSelect}
              className="hidden"
            />
            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm text-center mt-2 text-gray-500">
              {selectedFile ? selectedFile.name : "Drop project zip here or click to upload"}
            </p>
          </div>
          <div className="mt-4 w-[28rem] mx-auto mb-[2.2rem]">
            <p className="text-[#FF0000] text-[0.8rem] ml-3">Upload functionality is only intended for playground exported projects</p>
            <p className="text-[#FF0000] text-[0.7rem] mt-1 ml-[3.9rem]">Importing modified files may yield an invalid project.</p>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => setShowImportDialog(false)}
            className="px-3 py-2.5 text-sm bg-white border border-gray-400 hover:border-gray-400 hover:bg-gray-200 focus:border-none focus:outline-none"
            style={{ borderRadius: 0 }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)}








          <div className="h-7 w-[0.5px] bg-gray-500 mx-4"></div>
</>
)}


          {/* <div className="space-x-8 text-[12px] font-bold text-[#444444] relative font-['system-ui'] flex items-center">
          {['blogs', 'docs', 'tutorial', 'playground'].map(item => (
              <Link
              key={item}
              to={getNavLink(item)}
              className={`text-black hover:text-blue-500 px-2 py-2 relative ${
                  activeNavItem === item
                    ? 'after:content-[""] after:absolute after:left-0 after:right-0 after:h-0.5 after:bg-[#1B4E8D] after:-bottom-[0.5rem] z-10'
                    : ''
                }`}
              target={"_blank"} 
              rel={getNavLink(item).startsWith('http') ? 'noopener noreferrer' : undefined}
              onClick={(e) => {
                if (getNavLink(item).startsWith('http')) {
                  e.preventDefault();  // Prevent React Router navigation for external links
                  window.open(getNavLink(item), '_blank');
                }
              }}
            >
              {item.toUpperCase()}
            </Link>
            
            
            ))}
          </div> */}
<div className="
  space-x-8 
  flex 
  items-center 
  relative
  text-[12px]
  font-['system-ui,_-apple-system,_Segoe_UI,_Roboto,_Ubuntu,_Cantarell,_Noto_Sans,_sans-serif,_BlinkMacSystemFont,_Helvetica_Neue,_Arial,_Liberation_Sans,_Apple_Color_Emoji,_Segoe_UI_Emoji,_Segoe_UI_Symbol,_Noto_Color_Emoji']
  font-extrabold
  text-[#444444]
  leading-[18px]
">
  {['blogs', 'docs', 'tutorial', 'Mapper'].map(item => (
    <a
      key={item}
      href="#"
      className={`
        text-[#444444] 
        hover:text-blue-500 
        px-2 
        py-2 
        relative 
        font-extrabold
        ${
          activeNavItem === item 
            ? 'after:content-[""] after:absolute after:left-0 after:right-0 after:h-0.5 after:bg-[#1B4E8D] after:-bottom-[0.5rem] z-10' 
            : ''
        }
      `}
      onClick={(e) => handleNavClick(item, e)}
    >
      {item.toUpperCase()}
    </a>
  ))}
</div>

        </div>
      </div>
{/* main content */}




      <div className="flex flex-1 overflow-hidden h-[calc(100vh-100px)]" style={responsiveStyles.mainContainer}>
        <div style={{...resizableStyles(leftWidth,'left'),...responsiveStyles.panels}} className="flex-shrink-0 border-r flex flex-col relative h-full overflow-hidden ">
          
        {showTutorial ? (
  <div className="flex flex-col h-full">
    <div className="border-b">
      <div className="flex justify-between items-center h-[30px] px-4">
      <span className="
  text-[12px]
  font-system-default
  font-bold
  text-[rgb(107,108,109)]
  leading-[18px]
">
  TABLE OF CONTENTS
</span>
      </div>
    </div>
    <div 
  className="h-full overflow-y-auto bg-[#f8f9fa] mt-4"
  style={{
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, BlinkMacSystemFont, "Helvetica Neue", Arial, "Liberation Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    fontSize: '13px',
    fontWeight: 400,
    fontStyle: 'normal',
    lineHeight: '20px',
    color: 'rgb(92, 92, 92)'
  }}
>
  {tutorialData.map((topic) => (
    <TopicItem 
      key={topic.id}
      topic={topic}
      selectedTopic={selectedTopic}
      selectedSubTopic={selectedSubTopic}
      openSections={openSections}
      setSelectedTopic={setSelectedTopic}
      setSelectedSubTopic={setSelectedSubTopic}
      setOpenSections={setOpenSections}
      depth={0}
      tutorialExerciseSuccess={tutorialExerciseSuccess}
    />
  ))}
</div>
  </div>
) : isPayloadView ? (
            <div className="flex flex-col h-full overflow-auto"
            style={{...scrollbarStyle}}>
              <div className="border-b">
              <div className="flex justify-between items-center h-[30px] px-2 min-w-[200px]">
  {/* Left section with arrow and PAYLOAD text */}
  <div className="flex items-center">
    <button 
      onClick={handleBackClick} 
      className="text-gray-600 bg-white border-none outline-none h-[30px] flex items-center focus:outline-none focus:border-none mr-0"
    >
      <img
        src="/toolbarExpand-Active.svg"
        alt="SnapLogic Logo"
        className="w-3 h-3"
      />
    </button>
    <span className="
  text-[12px]
  font-system-default
  font-bold
  text-[rgb(107,108,109)]
  leading-[18px]
">
  PAYLOAD
</span>
  </div>

  {/* Right section with JSON dropdown */}
  <div className="ml-8">
    <FormatDropdown onFormatChange={handleFormatChange} />
  </div>
</div>
</div>

          <HighLightedJSON
      content={payloadContent}
      onChange={handlePayloadChange}
      format={format}
      style={{
        lineHeight: '1.5rem',
        ...scrollbarStyle,
        height: '100%',
        backgroundColor: 'white'
      }}
    />






            </div>
          ) :(
            <>
            <div className="h-1/2 border-b overflow-auto" style={responsiveStyles.panels}>
            <div className="input-explorer-section">

            <div className="border-b">
  <div className="flex justify-between items-center h-[30px]  px-4">
    {/* <span className="font-bold text-gray-600  font-['Manrope'] text-xs">INPUT EXPLORER</span> */}
    <span className="
  text-[12px]
  font-system-default
  font-bold
  text-[rgb(107,108,109)]
  leading-[18px]
">
  INPUT EXPLORER
</span>
    <button
      onClick={() => setShowInputContainer(true)}
      className="text-l bg-white  text-[rgb(107,108,109)] border-none focus:outline-none h-[30px] flex items-center border-r-2"
      style={{ borderRight: "0px" }}
    >
      {/* + */}
      <img
  src="/add-Hover.svg"
  alt="SnapLogic Logo"
 className="text-gray-500 h-3 w-3"
/>




    </button>
  </div>
</div>
</div>
















{showInputContainer && (
    <>
   <div className="fixed inset-0 bg-black/75 z-40" />
   <div className="fixed inset-0 z-50 flex items-center justify-center">
   <div className="w-[31.5rem] h-[19rem] bg-gray-100 p-6 shadow-md">
      <div className="mb-3 font-['Manrope']">
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
  className="w-full text-[15px] ml-1 h-11 px-3  outline-none bg-gray-200 border-t-0 border-b-0 border-l-gray-300 border-l-[3px] mt-1 border-r-gray-300 border-r-[3px] hover:bg-gray-100 hover:border-t-0 hover:border-b-0 hover:border-l-gray-400 hover:border-r-gray-400 focus:bg-gray-100 focus:border-t-0 focus:border-b-0 focus:border-l-gray-600 focus:border-r-gray-600"
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
              <div className="w-full mt-2  pt-2">
  {inputs.map((input, index) => (
    <div
      key={index}
      className={`flex items-center text-sm text-gray-600 p-1.5 cursor-pointer w-full group
        ${activeInput === input
          ? 'bg-gray-100 relative before:absolute before:top-0 before:bottom-0 before:left-0 before:w-[2px] before:bg-blue-500 after:absolute after:top-0 after:bottom-0 after:right-0 after:w-[2px] after:bg-blue-500 after:rounded-r-full group-hover:rounded-r-full after:group-hover:rounded-r-full hover:bg-gray-200'
          : 'hover:bg-gray-200 hover:rounded-r-full'}`}
      onClick={() => handleInputClick(input, index)}
    >
      <span className="text-blue-500 px-4">json</span>
      <span>{input}</span>
    </div>
  ))}
</div>
              </div>
             
              <div className="h-1/2 overflow-auto" style={responsiveStyles.panels}>
              <div className="script-explorer-section">
              <div className="border-b">
  <div className="flex justify-between items-center h-[30px] px-4">
    {/* <span className="font-bold text-gray-600 font-['Manrope'] text-xs">SCRIPT EXPLORER</span>
     */}
     <span className="
  text-[12px]
  font-system-default
  font-bold
  text-[rgb(107,108,109)]
  leading-[18px]
">
  SCRIPT EXPLORER
</span>
    <button
      onClick={() => setShowScriptContainer(true)}
      className="text-l text-gray-500 bg-white text-[rgb(107,108,109)] border-none focus:outline-none h-[30px] flex items-center border-r-2"
      style={{ borderRight: "0px" }}
    >
      {/* + */}
      <img
  src="/add-Hover.svg"
  alt="SnapLogic Logo"
 className="text-gray-500 h-3 w-3"
/>
    </button>
  </div>
</div>
</div>
{showScriptContainer && (
    <>
   <div className="fixed inset-0 bg-black/75 z-40" />
   <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="w-[31.5rem] h-[19rem] bg-gray-100 p-6 shadow-md ">
      <div className="mb-3 font-['Manrope']">
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
  className="w-full ml-1 h-11 text-[14px] px-3 text-lg outline-none bg-gray-200 border-t-0 border-b-0 border-l-gray-300 border-l-[3px] mt-1 border-r-gray-300 border-r-[3px] hover:bg-gray-100 hover:border-t-0 hover:border-b-0 hover:border-l-gray-400 hover:border-r-gray-400 focus:bg-gray-100 focus:border-t-0 focus:border-b-0 focus:border-l-gray-600 focus:border-r-gray-600"
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
                <div className="w-full  pt-2 ">
                {scripts.map((script) => (
  <div
  key={script.id}
  className={`flex items-center text-sm text-gray-600 p-1.5 cursor-pointer w-full group ${
    activeScript?.id === script.id
      ? 'bg-gray-100 relative before:absolute before:top-0 before:bottom-0 before:left-0 before:w-[2px] before:bg-blue-500 after:absolute after:top-0 after:bottom-0 after:right-0 after:w-[2px] after:bg-blue-500 after:rounded-r-full group-hover:rounded-r-full after:group-hover:rounded-r-full hover:bg-gray-200'
      : 'hover:bg-gray-200 hover:rounded-r-full'
  }`}
  onClick={() => handleScriptSelect(script)}
>
  <span className="px-4">{script.name}</span>
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
                <div style={{...resizableStyles(middleWidth,'middle'), ...responsiveStyles.panels}} className="flex-1 border-r  flex flex-col relative">
                {showTutorial ? (
  <>
    <div className="border-b">
      <div className="flex justify-between items-center h-[30px] px-4">
        {/* <span className="font-bold text-gray-600 font-['Manrope'] text-xs">EXPLANATION</span>
         */}
         <span className="
  text-[12px]
  font-system-default
  font-bold
  text-[rgb(107,108,109)]
  leading-[18px]
">
  EXPLANATION
</span>
      </div>
    </div>
    
    <div className="h-full overflow-auto p-6">
      <div className="max-w-4xl mx-auto">
        {/* Title Section */}
        <h1 className="text-[29px] font-system-default text-[#444444] mb-4">
          {(selectedSubTopic || selectedTopic).title}
        </h1>
        
        {/* Blue Separator Line */}
        <div className="h-[0.5px] bg-[#1B4E8D] w-full mb-6"></div>

        {/* Content Section */}
        <div className="prose max-w-none mb-4 bg-white">
  <pre className="
    font-system-default
    text-[14px]
    font-normal
    leading-[22px]
    text-[rgb(92,92,92)]
    whitespace-pre-wrap
  ">
    {(selectedSubTopic || selectedTopic).content}
  </pre>
</div>

        {/* Code Example Section */}
        {(selectedSubTopic || selectedTopic).codeExample && (
  <div className="flex flex-col space-y-6 mb-8 bg-white">
    {/* Input Section */}
    <div>
      <h3 className="text-[18px] font-system-default mb-2 text-[#1B4E8D]">Input:</h3>
      <div className="rounded-lg overflow-hidden bg-white border shadow-sm">
        
      <div className="relative bg-gray-100">
  <pre className="
    font-system-default
      text-[14px]
      font-normal
      leading-[20px]
      text-[rgb(92,92,92)]
      bg-[#F8F9FA]
      rounded
      p-4
      overflow-auto
      min-h-[50px]  /* Add minimum height if needed */
  ">
    <CopyButton 
      content={(selectedSubTopic || selectedTopic).codeExample.input} 
    />
    <code className="block pt-2">
      {(selectedSubTopic || selectedTopic).codeExample.input?.split('\n').map((line, i) => (
        <div key={i} className="whitespace-pre flex">
          {line}
        </div>
      ))}
    </code>
  </pre>
</div>
      </div>
    </div>

    <div className="h-[0.5px] bg-[#1B4E8D] w-full mb-6"></div>

    {/* Script Section */}
    <div>
      <h3 className="text-[18px] font-system-default mb-2 text-[#1B4E8D]">Script:</h3>
      <div className="rounded-lg overflow-hidden bg-white border shadow-sm">
        
        <div className="relative bg-gray-100">
          <pre className="font-system-default
    font-system-default
      text-[14px]
      font-normal
      leading-[20px]
      text-[rgb(92,92,92)]
      bg-[#F8F9FA]
      rounded
      p-4
      overflow-auto
      min-h-[50px]  /* Add minimum height if needed */">
        <CopyButton 
      content={(selectedSubTopic || selectedTopic).codeExample.script} 
    />
            <code className="block pt-2" >
              {(selectedSubTopic || selectedTopic).codeExample.script?.split('\n').map((line, i) => (
                <div key={i} className="whitespace-pre flex">
                  {/* <span className="select-none text-gray-400 mr-4 inline-block w-8 text-right">{i + 1}</span> */}
                  {line}
                </div>
              ))}
            </code>
          </pre>
        </div>
      </div>
    </div>

    <div className="h-[0.5px] bg-[#1B4E8D] w-full mb-6"></div>

    {/* Output Section */}
    <div>
      <h3 className="text-[18px] font-system-default mb-2 text-[#1B4E8D]">Output:</h3>
      <div className="rounded-lg overflow-hidden bg-white border shadow-sm">
        
        <div className="relative bg-gray-100">
          <pre className="font-system-default
    font-system-default
      text-[14px]
      font-normal
      leading-[20px]
      text-[rgb(92,92,92)]
      bg-[#F8F9FA]
      rounded
      p-4
      overflow-auto
      min-h-[50px]  /* Add minimum height if needed */">
        <CopyButton 
      content={(selectedSubTopic || selectedTopic).codeExample.output} 
    />
            <code className="block pt-2">
              {(selectedSubTopic || selectedTopic).codeExample.output?.split('\n').map((line, i) => (
                <div key={i} className="whitespace-pre flex">
                  {/* <span className="select-none text-gray-400 mr-4 inline-block w-8 text-right">{i + 1}</span> */}
                  {line}
                </div>
              ))}
            </code>
          </pre>
        </div>
      </div>
    </div>
    <div className="h-[0.5px] bg-[#1B4E8D] w-full mb-6"></div>

     {/* Exercise Section */}
     {(selectedSubTopic || selectedTopic).exercise && (
      <div className="mb-8">
        <h2 className="text-[24px] font-system-default text-[#444444] mb-4">Exercise</h2>
        
        {/* Exercise Description */}
        <div className="mb-6">
          <pre className="font-system-default
    text-[14px]
    font-normal
    leading-[22px]
    text-[rgb(92,92,92)]
    whitespace-pre-wrap">
            {(selectedSubTopic || selectedTopic).exercise.description}
          </pre>
        </div>

        {/* Exercise Expected Output */}
        <div className="mb-6">
          <h3 className="text-[18px] font-system-default mb-2 text-[#1B4E8D]">Expected Output:</h3>
          <div className="rounded-lg overflow-hidden bg-white border shadow-sm">
            <div className="relative bg-gray-100">
              <pre className="font-system-default
    font-system-default
      text-[14px]
      font-normal
      leading-[20px]
      text-[rgb(92,92,92)]
      bg-[#F8F9FA]
      rounded
      p-4
      overflow-auto
      min-h-[50px]  /* Add minimum height if needed */">
        <CopyButton 
      content={(selectedSubTopic || selectedTopic).exercise.expectedOutput} 
    />
                <code className="block pt-2">
                  {(selectedSubTopic || selectedTopic).exercise.expectedOutput?.split('\n').map((line, i) => (
                    <div key={i} className="whitespace-pre flex">
                      {line}
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>
        </div>

        <div className="h-[0.5px] bg-[#1B4E8D] w-full mb-6"></div>

        {/* Exercise Input */}
        <div className="mb-6">
  <h3 className="text-[18px] font-system-default mb-2 text-[#1B4E8D]">Input:</h3>
  <div className="rounded-lg overflow-hidden bg-white border shadow-sm">
    <div className="relative bg-gray-100">
      <pre className="font-system-default
    font-system-default
      text-[14px]
      font-normal
      leading-[20px]
      text-[rgb(92,92,92)]
      bg-[#F8F9FA]
      rounded
      p-4
      overflow-auto
      min-h-[50px]  /* Add minimum height if needed */">
        <CopyButton 
      content={(selectedSubTopic || selectedTopic).exercise.input} 
    />
        <code className="block pt-2">
          {(() => {
            const inputStr = (selectedSubTopic || selectedTopic).exercise.input;
            try {
              // Parse and re-stringify to ensure proper JSON formatting
              const parsedInput = parseExerciseInput(inputStr);
              return JSON.stringify(parsedInput, null, 2)
                .split('\n')
                .map((line, i) => (
                  <div key={i} className="whitespace-pre flex">
                    {line}
                  </div>
                ));
            } catch (error) {
              console.error('Error formatting input:', error);
              return inputStr.split('\n').map((line, i) => (
                <div key={i} className="whitespace-pre flex">
                  {line}
                </div>
              ));
            }
          })()}
        </code>
      </pre>
    </div>
  </div>
</div>



        
      </div>
    )}

    

  </div>
)}



        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-auto pt-4">
       {/* Prev Button */}
  <button
    onClick={() => handlePrevNavigation()}
    className={`
      min-w-[36px] h-[42px] px-6
      rounded-[22px] outline-none 
      cursor-pointer font-normal text-base
      border-2 border-transparent mt-2.5 mb-2.5
      flex items-center justify-center
      transition-all duration-200
      font-system-default
      focus:outline-none focus:border-transparent
      ${hasPrev 
        ? 'text-[#1B4E8D] hover:border-[#1B4E8D] hover:bg-white-500' 
        : 'text-[#1B4E8D] hover:border-[#1B4E8D] hover:bg-white-500 cursor-not-allowed'
      }
    `}
  >
    Prev
  </button>

  {/* Next Button */}
  <button
    onClick={() => handleNextNavigation()}
    className={`
      min-w-[36px] h-[42px] px-6
      rounded-[22px] outline-none
      cursor-pointer font-normal text-base
      border-2 border-transparent mt-2.5 mb-2.5
      flex items-center justify-center
      transition-all duration-200
      font-system-default
      focus:outline-none focus:border-transparent
      ${hasNext 
        ? 'bg-[#1B4E8D] text-white hover:bg-white hover:text-[#1B4E8D] hover:border-[#1B4E8D]' 
        : 'bg-[#1B4E8D] text-white opacity-50  hover:text-[#1B4E8D] hover:border-[#1B4E8D] cursor-not-allowed'
      }
    `}
  >
    Next
  </button>



        </div>
      </div>
    </div>
  </>
) :
          (
            <>
            <div className="script-section">
            <div className="border-b">
            <div className="flex items-center justify-between min-h-[30px] px-4">
              {/* <span className="font-bold text-gray-600 font-['Manrope'] text-xs">SCRIPT</span> */}
              <span className="
  text-[12px]
  font-system-default
  font-bold
  text-[rgb(107,108,109)]
  leading-[18px]
">
  SCRIPT
</span>
              <div className="flex items-center">
                {outputMatch ? (
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    {/* <span className="text-gray-500  font-['Manrope'] text-[12px]">SUCCESS</span> */}
                    <span className="
  text-[12px]
  font-system-default
  font-bold
  text-[rgb(107,108,109)]
  leading-[18px]
">
  SUCCESS
</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                    {/* <span className="text-gray-500 font-['Manrope'] text-xs">FAILURE</span> */}
                    <span className="
  text-[12px]
  font-system-default
  font-bold
  text-[rgb(107,108,109)]
  leading-[18px]
">
  FAILURE
</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          </div>

          <div className="p-2 pl-2 pr-0 flex flex-1 font-mono text-sm h-full font-['Manrope'] relative "
          style={{ overflow: 'hidden' }}>
            <div className="flex flex-1 " style={scrollbarStyle}>
 
            <HighlightedScript
  
  content={scriptContent}
  onChange={(newContent) => {
    handleScriptContentChange({ target: { value: newContent } });
    const lines = newContent.split('\n');
    setActiveLineIndex(lines.length - 1);
  }}
  activeLineIndex={activeLineIndex}
  payload={inputContents[activeInput] || '{}'}
/>
  </div>
 <canvas
          ref={canvasRef}
          className="decorationsOverviewRuler"
          aria-hidden="true"
          width="14"
          height={scriptContent.split('\n').length * 24}
          style={{
            position: 'absolute',
            willChange: 'transform',
            top: '8px',
            right: 0,
            width: '14px',
            height: 'calc(100% - 8px)',
            zIndex: 10
          }}
        />




        {/* Active Line Indicator */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: `${8 + (activeLineIndex * 24)}px`,
            width: '14px',
            height: '2px',
            backgroundColor: '#1e1e1e',
            zIndex: 11
          }}
        />




</div>

</>

)}






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
                <div style={{...resizableStyles(rightWidth,'right'), ...responsiveStyles.panels}} className="flex-shrink-0  flex flex-col h-full relative overflow-hidden">
                  {showTutorial?(
                    <>
                     <div className="h-1/2 border-b overflow-hidden">
      <div className="border-b">
        <div className="flex items-center justify-between min-h-[30px] px-4">
          {/* <span className="font-bold text-gray-600 font-['Manrope'] text-xs">SCRIPT</span> */}
          <span className="
  text-[12px]
  font-system-default
  font-bold
  text-[rgb(107,108,109)]
  leading-[18px]
">
SCRIPT
</span>
          <div className="flex items-center">
          {tutorialExerciseSuccess ? (
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-[12px] font-system-default font-bold text-[rgb(107,108,109)] leading-[18px]">
                    SUCCESS
                  </span>
                </div>
              ) : (
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-[12px] font-system-default font-bold text-[rgb(107,108,109)] leading-[18px]">
                    FAILURE
                  </span>
                </div>
              )}
          </div>
        </div>
      </div>

      <div className="p-2 pl-2 pr-0 flex flex-1 font-mono text-sm h-[calc(100%-30px)] font-['Manrope'] relative"
        style={{ overflow: 'hidden' }}>
        <div className="flex flex-1" style={scrollbarStyle}>
  {/* console.log("Passing payload to HighlightedScript:", getPayloadData()); */}

  <HighlightedScript
  
      content={scriptContent}
      onChange={(newContent) => {
        handleScriptContentChange({ target: { value: newContent } });
        const lines = newContent.split('\n');
        setActiveLineIndex(lines.length - 1);
      }}
      activeLineIndex={activeLineIndex}
      payload={inputContents[activeInput] || '{}'}
      showTutorial={showTutorial}
    />
        </div>

        <canvas
          ref={canvasRef}
          className="decorationsOverviewRuler"
          aria-hidden="true"
          width="14"
          height={scriptContent.split('\n').length * 24}
          style={{
            position: 'absolute',
            willChange: 'transform',
            top: '8px',
            right: 0,
            width: '14px',
            height: 'calc(100% - 8px)',
            zIndex: 10
          }}
        />

        {/* Active Line Indicator */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: `${8 + (activeLineIndex * 24)}px`,
            width: '14px',
            height: '2px',
            backgroundColor: '#1e1e1e',
            zIndex: 11
          }}
        />
      </div>
    </div>

          <div className="h-1/2 ">
            <div className="border-b">
              <div className="flex justify-between items-center h-[30px] px-4">
                {/* <span className="font-bold text-gray-600 font-['Manrope'] text-xs">OUTPUT</span> */}
                <span className="
  text-[12px]
  font-system-default
  font-bold
  text-[rgb(107,108,109)]
  leading-[18px]
">
  OUTPUT
</span>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 font-['Manrope']">
                    <FormatDropdown />
                   
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 font-mono text-sm font-['Manrope'] h-[calc(100%-30px)]  "
            >
             
             <HighlightedActualOutput
  actualOutput={actualOutput}
  onActualOutputChange={handleActualOutputChange}
/>
    
</div>




          </div>
                    </>
                  ):(<>
                  
          {/* Actual Output Section */}
          <div className="h-1/2 border-b overflow-hidden">
          <div className="actual-output-section">
            <div className="border-b">
              <div className="flex justify-between items-center h-[30px] px-4">
                {/* <span className="font-bold text-gray-600 font-['Manrope'] text-xs">ACTUAL OUTPUT</span> */}
                <span className="
  text-[12px]
  font-system-default
  font-bold
  text-[rgb(107,108,109)]
  leading-[18px]
">
  ACTUAL OUTPUT
</span>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 font-['Manrope']">
                    <FormatDropdown />
                   
                  </div>
                </div>
              </div>
            </div>
            </div>
            <div className="p-4 font-mono text-sm font-['Manrope'] h-[calc(100%-30px)]  "
            >
               <HighlightedActualOutput
  actualOutput={actualOutput}
  onActualOutputChange={handleActualOutputChange}
/>
    
</div>




          </div>
          {/* Expected Output Section */}
          <div className="h-1/2">
          <div className="expected-output-section">
            <div className="border-b">
              <div className="flex justify-between items-center h-[30px] px-4">
                {/* <span className="font-bold text-gray-600 font-['Manrope'] text-xs">EXPECTED OUTPUT</span> */}
                <span className="
  text-[12px]
  font-system-default
  font-bold
  text-[rgb(107,108,109)]
  leading-[18px]
">
EXPECTED OUTPUT
</span>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 font-['Manrope']">
                    <FormatDropdown />
                  </div>
                </div>
              </div>
            </div>
            </div>
            <div className="p-4 font-mono text-sm font-['Manrope'] h-[calc(100%-30px)] overflow-auto "
            style={scrollbarStyle}>
              <HighlightedExpectedOutput
  expectedOutput={expectedOutput}
  onExpectedOutputChange={handleExpectedOutputChange}
/>
              
            </div>
          </div>
          </>
                  )}
        </div>
     
        </div>




{/* Bottom Bar */}
<div
  className="border-t flex flex-col"
  style={{
    height: `${bottomHeight}px`,
    minHeight: '32px',
    maxHeight: '250px',
    transition: isDragging ? 'none' : 'height 0.2s ease-in-out',
    ...(showTutorial ? {
      position: 'sticky',
      bottom: 0,
      backgroundColor: 'white',
      zIndex: 50,
      width: '100%'
    } : {
      position: 'relative' // Default positioning when tutorial is off
    })
  }}
>




<div
  className="absolute left-0 right-0 top-0 h-2 cursor-ns-resize z-20 group"
  onMouseDown={(e) => {
    e.preventDefault();
    setIsDragging(true);
    const startY = e.clientY;
    const startHeight = bottomHeight;




    const handleMouseMove = (e) => {
      const deltaY = startY - e.clientY;
      const newHeight = startHeight + deltaY;
      // Set maximum height to 250px to prevent collision with input explorer
      setBottomHeight(Math.max(32, Math.min(250, newHeight)));
    };




    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };




    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }}
>
  <div className="w-full h-[1.5px] bg-gray-200 group-hover:bg-blue-500 transition-colors" />
</div>








  <div className="flex items-center justify-between h-8 bg-[#E6EEF4] font-['Manrope'] bg-white relative">
  <div className="flex space-x-4 pl-2 pr-8 z-10">
  {/* <TooltipProvider delayDuration={50}>
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={() => {
            if (!isBottomExpanded || activeTab !== 'log') {
              setIsBottomExpanded(true);
              setActiveTab('log');
              setBottomHeight(300);
            } else {
              setIsBottomExpanded(false);
              setBottomHeight(32);
            }
          }}
          className="text-[11px] h-7 px-2 bg-white flex items-center hover:bg-gray-100 cursor-pointer outline-none focus:outline-none focus:ring-0 rounded-none border-none"
        >
          <Terminal className="h-3 w-3" />
          <span className='ml-2 text-gray-600 tracking-[0.03em]'>LOG VIEWER</span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={15} className="h-2 w-5 rounded-full bg-gray-800 p-0 border-0" />
    </Tooltip>




    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={() => {
            if (!isBottomExpanded || activeTab !== 'api') {
              setIsBottomExpanded(true);
              setActiveTab('api');
              setBottomHeight(300);
            } else {
              setIsBottomExpanded(false);
              setBottomHeight(32);
            }
          }}
          className="text-[11px] h-7 px-2 bg-white flex items-center hover:bg-gray-100 cursor-pointer outline-none focus:outline-none focus:ring-0 rounded-none border-none"
        >
          <Book className="h-3 w-3" />
          <span className="ml-2 font-['Manrope'] text-gray-600 tracking-[0.03em]">API REFERENCE</span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={15} className="h-2 w-5 rounded-full bg-gray-800 p-0 border-0" />
    </Tooltip>
  </TooltipProvider> */}
</div>

    {/* <span className=" font-['Manrope'] text-sm text-gray-400 absolute left-[calc(45%+0px)] tracking-[0.03em] flex items-center h-full z-10"> */}
      {/* ©2023 Snaplogic LLC, a Salesforce company */}
      {/* SnapLogic Playground – Redefining Integration.
    </span> */}
   <div className="relative w-full h-full flex items-center justify-center px-4">
  {/* Left side - Made in India and Powered by */}
  <div className="font-system-default text-[0.69rem] flex items-center absolute">
    <div className="flex items-center">
      <span className="text-gray-500">Made</span>
      <span className="text-gray-500 mx-1">in</span>
      <span className="text-gray-500 font-semibold hover:text-blue-800 cursor-pointer transition-colors">
        Tamil Nadu, India
      </span>
      
      {/* Indian Flag */}
      <div className="ml-1 w-4 h-3 flex-shrink-0">
        <svg 
          viewBox="0 0 6 4" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <rect width="6" height="1.33333" fill="#FF9933"/>
          <rect y="1.33333" width="6" height="1.33333" fill="#FFFFFF"/>
          <rect y="2.66667" width="6" height="1.33333" fill="#138808"/>
          <circle cx="3" cy="2" r="0.4" fill="#000080"/>
          <path d="M3 1.7L3.2 2.3L2.8 2.3L3 1.7Z" fill="#000080"/>
        </svg>
      </div>

      {/* Separator */}
      <span className="text-gray-400 mx-3">|</span>

      {/* Powered by Section */}
      <span className="text-gray-500">Powered by</span>
      <a 
        href="https://www.mulecraft.in/" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-blue-500 font-semibold hover:text-blue-800 transition-colors ml-1"
      >
        MuleCraft
      </a>
    </div>
  </div>

  {/* Right side - Support Button */}
  <div className="flex items-center">
    <SupportButton />
  </div>

  <style jsx>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
    
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    .animate-bounce {
      animation: bounce 1s infinite;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-25%); }
    }
  `}</style>
</div>
    {/* Resize Handle */}
   
  </div>
          {/* Content */}
          {isBottomExpanded && (
          <div className="flex-1 overflow-auto">
            <div className="h-[calc(100%-2rem)] overflow-auto">
              <div className="flex flex-col justify-center items-center h-full">
                {activeTab === 'log' && (
                  <>
                    <h2 className="text-xl font-bold text-black mb-4 font-['Manrope'] ">No Logs Available</h2>
                    <p className="text-sm font-['Manrope'] tracking-[0.04em]">
                      Learn more about the
                      <span className="mx-1 bg-gray-100 px-2 py-1 rounded-none font-['Manrope'] tracking-[0.04em]">jsonPath</span>
                      function in the
                      <span className="text-sky-500 font-['Manrope'] tracking-[0.04em]">  API Reference</span>
                    </p>
                  </>
                )}
               
                {activeTab === 'api' && (
                  <div className="w-full h-full flex">
                    {/* Left Navigation */}
                    <div className="w-64 border-r overflow-y-auto"
                    style={{...scrollbarStyle, ...responsiveStyles.panels}}>
                      <nav className="p-4">
                        <ul className="space-y-2 font-['Manrope']">
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
                    <div className="flex-1 overflow-y-auto"
                    style={scrollbarStyle}>
                      <div className="p-6 font-['Manrope']">
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
    </>
  );
};




export default UpdatedCode;



































































