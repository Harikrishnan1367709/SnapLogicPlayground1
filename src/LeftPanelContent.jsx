import React, { useState } from 'react'
import { ChevronDown, ChevronLeft } from 'lucide-react';
import FormatDropdown from './FormatDropdown';


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

const LeftPanelContent = () => {
    const [scripts, setScripts] = useState([]); // State to store created scripts
    const [newScript, setNewScript] = useState(""); // State to store current script

    const [isPayloadView, setIsPayloadView] = useState(false);
const [payloadContent, setPayloadContent] = useState('{\n\n}');
const [lineNumbers, setLineNumbers] = useState([1]);

 const [isInputDialogOpen, setIsInputDialogOpen] = useState(false);
const [isScriptDialogOpen, setIsScriptDialogOpen] = useState(false);

  const [inputs, setInputs] = useState([]); // State to store created inputs
  const [newInput, setNewInput] = useState(""); // State to store current input
  // const [scriptContent, setScriptContent] = useState('$.phoneNumbers[:1].type');
  const [scriptContent, setScriptContent] = useState('$.phoneNumbers[:1].type');

  const isCreateInputDisabled = newInput.trim() === ""; // Disable create button if input is empty
  const isCreateScriptDisabled = newScript.trim() === ""; // Disable create button if script is empty

  
  
    // Convert content to array of lines
    const scriptLines = scriptContent.split('\n');
    
  

// Add function to handle line numbers
const updateLineNumbers = (content) => {
    const lines = content.split('\n').length;
    setLineNumbers(Array.from({ length: lines }, (_, i) => i + 1));
  };
  
  // Add function to handle payload content changes
  const handlePayloadChange = (e) => {
    const content = e.target.value;
    setPayloadContent(content);
    updateLineNumbers(content);
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

  return (
    <div className="flex-shrink-0 border-r flex flex-col relative h-full">
    {isPayloadView ? (
      <div className="h-full">
        <div className="border-b">
          <div className="flex justify-between items-center min-h-[30px] px-4">
            <div className="flex items-center">
              <button 
                onClick={() => setIsPayloadView(false)}
                className="mr-3 text-gray-600 hover:text-gray-800"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="font-bold text-gray-600 text-xs">PAYLOAD</span>
            </div>
            <FormatDropdown />
          </div>
        </div>
        <div className="flex h-[calc(100%-30px)]">
          <div className="p-2 text-right bg-gray-50 text-gray-400 select-none">
            {lineNumbers.map(num => (
              <div key={num} className="leading-6">{num}</div>
            ))}
          </div>
          <textarea
            value={payloadContent}
            onChange={handlePayloadChange}
            className="flex-1 p-2 font-mono text-sm resize-none outline-none"
            spellCheck="false"
          />
        </div>
      </div>
    ) : (
      <>
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
      </>
    )}
  </div>
  )
}

export default LeftPanelContent





     <div style={resizableStyles(leftWidth,'left')} className="flex-shrink-0 border-r flex flex-col relative">
  <div className="border-b">
    <div className="flex justify-between items-center min-h-[30px] px-4">
      {isPayloadView ? (
        <>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleBackClick}
              className="text-gray-600 hover:text-gray-800"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-bold text-gray-600 text-xs">PAYLOAD</span>
          </div>
          <FormatDropdown />
        </>
      ) : (
        <>
          <span className="font-bold text-gray-600 text-xs">INPUT EXPLORER</span>
          <Dialog open={isInputDialogOpen} onOpenChange={setIsInputDialogOpen}>
            <DialogTrigger asChild>
              <button className="text-xl bg-white border-none focus:outline-none flex items-center justify-center h-6 w-6">
                +
              </button>
            </DialogTrigger>
            {/* Existing Dialog Content */}
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
        </>
      )}
    </div>
  </div>

  {isPayloadView ? (
    <div className="flex flex-1">
      <div className="w-12 bg-gray-50 text-right pr-2 py-2 text-gray-400 select-none">
        {Array.from({ length: payloadContent.split('\n').length }, (_, i) => (
          <div key={i} className="h-6">{i + 1}</div>
        ))}
      </div>
      <textarea
        value={payloadContent}
        onChange={(e) => setPayloadContent(e.target.value)}
        className="flex-1 p-2 font-mono text-sm resize-none outline-none"
        spellCheck="false"
      />
    </div>
  ) : (
    <>
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
      {!isPayloadView && (
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
      )}
    </>
  )}
</div>




