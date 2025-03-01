import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, Search, Copy, CheckCircle, X, ExternalLink, Bookmark, BookmarkCheck, ChevronRight, ArrowLeft, Home } from "lucide-react";
import Editor from "@monaco-editor/react";

export function Documentation({ onBack }) {
  const [activeSection, setActiveSection] = useState('introduction');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedSection, setCopiedSection] = useState(null);
  const [filteredSections, setFilteredSections] = useState([]);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [bookmarkedSections, setBookmarkedSections] = useState(() => {
    const saved = localStorage.getItem('snaplogicBookmarks');
    return saved ? JSON.parse(saved) : [];
  });
  const contentRef = useRef(null);
  const searchInputRef = useRef(null);

  const allSections = [
    { id: 'introduction', title: 'Introduction to SnapLogic', level: 1 },
    { id: 'key-features', title: 'Key Features', level: 2 },
    { id: 'why-playground', title: 'Why Create SnapLogic Playground?', level: 2 },
    { id: 'ui-overview', title: 'User Interface Overview', level: 1 },
    { id: 'core-functionalities', title: 'Core Functionalities', level: 1 },
    { id: 'implemented-functions', title: 'Implemented Functions', level: 1 },
    { id: 'string-operations', title: 'String Operations', level: 2 },
    { id: 'array-operations', title: 'Array Operations', level: 2 },
    { id: 'object-functions', title: 'Object Functions', level: 2 },
    { id: 'math-functions', title: 'Math Functions', level: 2 },
    { id: 'number-functions', title: 'Number Functions', level: 2 },
    { id: 'date-functions', title: 'Date Functions', level: 2 },
    { id: 'json-path', title: 'JSON Path Operations', level: 2 },
    { id: 'match-operator', title: 'Match Operator', level: 2 },
    { id: 'global-operations', title: 'Global Operations', level: 2 },
    { id: 'advanced-features', title: 'Advanced Features', level: 1 },
    { id: 'benefits', title: 'Benefits for Users', level: 1 },
    { id: 'future-enhancements', title: 'Future Enhancements', level: 1 },
    { id: 'conclusion', title: 'Conclusion', level: 1 },
  ];

  useEffect(() => {
    // Initialize filteredSections with all sections
    setFilteredSections(allSections);
  }, []);

  useEffect(() => {
    // Save bookmarks whenever they change
    localStorage.setItem('snaplogicBookmarks', JSON.stringify(bookmarkedSections));
  }, [bookmarkedSections]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSections(allSections);
      setIsSearching(false);
      setSearchResults([]);
    } else {
      const query = searchQuery.toLowerCase();
      
      // First filter the sections based on title
      const titleMatches = allSections.filter(section => 
        section.title.toLowerCase().includes(query)
      );
      
      // For content matches, instead of using getContentForSection directly
      // Which could trigger rendering issues, use a safer approach
      const contentMatches = [];
      allSections.forEach(section => {
        if (!titleMatches.includes(section)) {
          try {
            const sectionId = section.id;
            // Simple check for keywords in section content without rendering
            // This is a simplified version - actual search is done in searchResults
            if (sectionId.includes(query)) {
              contentMatches.push(section);
            }
          } catch (error) {
            console.error("Error searching in section:", section.id, error);
          }
        }
      });
      
      setFilteredSections([...titleMatches, ...contentMatches]);
      setIsSearching(true);
      
      // Create search results with context - only for title matches for now
      // To prevent issues with content rendering
      const results = [];
      titleMatches.forEach(section => {
        results.push({
          section,
          snippet: `<span>Found in title: <mark class="bg-yellow-200 px-0.5 rounded">${section.title}</mark></span>`
        });
      });
      
      setSearchResults(results);
    }
  }, [searchQuery]);

  useEffect(() => {
    // Scroll to top when changing sections
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [activeSection]);

  // Add custom scrollbar styles
  useEffect(() => {
    // Add scrollbar styles to head
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      /* Custom scrollbar for documentation */
      .doc-scrollbar::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      
      .doc-scrollbar::-webkit-scrollbar-track {
        background: #fff;
        border-radius: 4px;
      }
      
      .doc-scrollbar::-webkit-scrollbar-thumb {
        background: #3b82f6; /* Blue scrollbar thumb */
        border-radius: 4px;
        border: 2px solid #fff;
      }
      
      .doc-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #2563eb;
      }
    `;
    document.head.appendChild(styleElement);

    return () => {
      // Clean up on unmount
      document.head.removeChild(styleElement);
    };
  }, []);

  const focusSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const toggleBookmark = (sectionId) => {
    if (bookmarkedSections.includes(sectionId)) {
      setBookmarkedSections(prev => prev.filter(id => id !== sectionId));
    } else {
      setBookmarkedSections(prev => [...prev, sectionId]);
    }
  };

  const handleCopyCode = (sectionId, code) => {
    navigator.clipboard.writeText(code);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const CodeBlock = ({ code, language = 'javascript', sectionId }) => (
    <div className="relative mt-4 mb-6 group">
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 rounded-full bg-white/80 hover:bg-white shadow-sm"
          onClick={() => handleCopyCode(sectionId, code)}
        >
          {copiedSection === sectionId ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4 text-gray-500" />
          )}
        </Button>
      </div>
      <div className="bg-[#1e1e1e] rounded-md overflow-hidden shadow-lg">
        <Editor
          height="150px"
          language={language}
          theme="vs-dark"
          value={code}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 13,
            fontFamily: "'Monaco', 'Menlo', monospace",
            padding: { top: 12, bottom: 12 },
            lineNumbers: 'on',
            scrollbar: {
              vertical: 'visible',
              horizontalScrollbarSize: 8,
              verticalScrollbarSize: 8
            }
          }}
        />
      </div>
    </div>
  );

  const getContentForSection = (sectionId) => {
    switch(sectionId) {
      case 'introduction':
        return (
          <div>
            <p className="mb-4 text-gray-700 leading-relaxed">
              SnapLogic is a modern integration platform as a service (iPaaS) designed to streamline the connection of applications, 
              data, and devices. It offers a low-code, intuitive interface that simplifies automation, integration, and data transformation 
              for businesses.
            </p>
          </div>
        );
      
      case 'key-features':
        return (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-blue-700">Simplified Integration</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Visual drag-and-drop interface for ease of use.</li>
                <li>Pre-built connectors and templates to reduce development time.</li>
              </ul>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-blue-700">Enterprise-Grade Capabilities</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Scalable architecture with real-time data processing.</li>
                <li>Robust security features to protect sensitive information.</li>
              </ul>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-blue-700">Flexibility</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Cloud-native design with hybrid deployment options.</li>
                <li>Support for multiple data formats.</li>
              </ul>
            </div>
          </div>
        );
      
      case 'why-playground':
        return (
          <div>
            <p className="mb-6 text-gray-700 leading-relaxed">
              SnapLogic Playground was developed to provide a safe, interactive environment for users to explore and test SnapLogic's 
              integration capabilities. By simulating real-world integration scenarios, it enables users to:
            </p>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-blue-700">Learn and Experiment</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Understand SnapLogic's functionality through hands-on practice.</li>
                <li>Experiment with JSON payloads, scripts, and transformations without affecting live environments.</li>
              </ul>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-blue-700">Accelerate Development</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Prototype integration solutions quickly and validate their feasibility.</li>
                <li>Test and debug scripts in real-time before deploying to production.</li>
              </ul>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-blue-700">Encourage Collaboration</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Provide a unified platform for teams to share and refine integration workflows.</li>
                <li>Enable consistent best practices through reusable components and templates.</li>
              </ul>
            </div>
            
            <p className="mt-6 text-gray-700 leading-relaxed">
              By offering a dedicated space for exploration and learning, SnapLogic Playground ensures developers and analysts can 
              maximize the platform's potential while minimizing risks.
            </p>
          </div>
        );
      
      case 'ui-overview':
        return (
          <div>
            <p className="mb-6 text-gray-700 leading-relaxed">
              SnapLogic Playground provides an intuitive interface for users to create, test, and validate integration solutions.
            </p>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-700">Components of the Interface:</h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                  <h4 className="font-medium text-blue-700 mb-3">Left Panel: Input Explorer</h4>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>Allows users to define and manage JSON payloads.</li>
                    <li>Enables quick exploration of input data.</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                  <h4 className="font-medium text-blue-700 mb-3">Middle Panel: Script Editor</h4>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>Write and manage scripts with syntax highlighting and line numbering.</li>
                    <li>Offers real-time feedback during script execution.</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                  <h4 className="font-medium text-blue-700 mb-3">Right Panel: Output Viewer</h4>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>Displays actual output, expected output, and success/failure indicators.</li>
                    <li>Supports JSON format for output validation.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'core-functionalities':
        return (
          <div>
            <p className="mb-6 text-gray-700 leading-relaxed">
              SnapLogic Playground offers a range of features that simplify the development and debugging of integration solutions.
            </p>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-blue-700">1. Input Management</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Create and manage multiple JSON payloads for testing.</li>
                <li>Visual input explorer for efficient data exploration.</li>
              </ul>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-blue-700">2. Script Development</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Syntax highlighting and active line indication for clarity.</li>
                <li>Supports JSON path operations like data navigation, array access, and conditional filtering.</li>
              </ul>
              
              <p className="mt-4 mb-2 text-sm italic text-gray-600">Example:</p>
              <p className="mb-2 text-sm text-gray-700">In this example, a simple script accesses the firstName field from the JSON payload.</p>
              
              <CodeBlock 
                code={`// Sample input JSON\n{\n  "person": {\n    "firstName": "John",\n    "lastName": "Smith"\n  }\n}\n\n// Access the firstName field\n$person.firstName`}
                sectionId="core-functionalities-example"
              />
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-blue-700">3. Output Handling</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Real-time preview of actual output vs. expected output.</li>
                <li>Failure and success indicators to quickly identify issues.</li>
              </ul>
            </div>
          </div>
        );
      
      case 'implemented-functions':
        return (
          <div>
            <p className="mb-6 text-gray-700 leading-relaxed">
              SnapLogic supports a comprehensive range of operations for data transformation, organized into the following categories:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {['string-operations', 'array-operations', 'object-functions', 'math-functions', 'number-functions', 'date-functions'].map(functionType => (
                <div 
                  key={functionType} 
                  className="bg-white rounded-lg shadow-md p-5 border border-gray-200 hover:shadow-lg transition-all duration-200 hover:border-blue-300 cursor-pointer"
                  onClick={() => setActiveSection(functionType)}
                >
                  <h3 className="font-semibold text-blue-700 mb-2 flex items-center justify-between">
                    {allSections.find(s => s.id === functionType)?.title}
                    <ChevronRight className="h-4 w-4 text-blue-500" />
                  </h3>
                  <p className="text-sm text-gray-600">
                    Click to explore {functionType.split('-').join(' ')} in detail
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'string-operations':
        return (
          <div>
            <div className="bg-blue-50 rounded-lg p-4 mb-6 border-l-4 border-blue-500">
              <h3 className="text-lg font-semibold mb-3 text-blue-700">Available String Functions</h3>
              <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 text-gray-700 mb-4">
                <li className="flex items-center"><span className="h-2 w-2 bg-blue-500 rounded-full mr-2"></span>camelCase</li>
                <li className="flex items-center"><span className="h-2 w-2 bg-blue-500 rounded-full mr-2"></span>capitalize</li>
                <li className="flex items-center"><span className="h-2 w-2 bg-blue-500 rounded-full mr-2"></span>toLowerCase</li>
                <li className="flex items-center"><span className="h-2 w-2 bg-blue-500 rounded-full mr-2"></span>toUpperCase</li>
                <li className="flex items-center"><span className="h-2 w-2 bg-blue-500 rounded-full mr-2"></span>split</li>
                <li className="flex items-center"><span className="h-2 w-2 bg-blue-500 rounded-full mr-2"></span>replace</li>
                <li className="flex items-center"><span className="h-2 w-2 bg-blue-500 rounded-full mr-2"></span>trim</li>
                <li className="flex items-center"><span className="h-2 w-2 bg-blue-500 rounded-full mr-2"></span>charAt</li>
                <li className="flex items-center"><span className="h-2 w-2 bg-blue-500 rounded-full mr-2"></span>contains</li>
              </ul>
            </div>
            
            <CodeBlock 
              code={`// Examples of string operations\n$text.toUpperCase()\n$text.toLowerCase()\n$text.length()\n$text.trim()\n$kebab.camelCase()\n$mixed.kebabCase()\n$snakeCase.camelCase()\n$text.upperFirst()\n$text.lowerFirst()\n$text.charAt(0)\n$text.charCodeAt(0)\n$email.contains("@")\n$email.endsWith(".com")`}
              sectionId="string-operations-example"
            />
          </div>
        );
      
      // ... keep existing code
      
      default:
        return <p className="text-gray-700">No content available for this section.</p>;
    }
  };

  // Mobile menu toggle
  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        focusSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle search input changes safely
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  return (
    <div className="flex h-full bg-gradient-to-br from-gray-50 to-blue-50/30 relative">
      {/* Mobile menu button - only visible on small screens */}
      <button
        className="fixed top-20 left-4 z-50 md:hidden bg-white p-2 rounded-full shadow-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
        onClick={toggleMobileSidebar}
      >
        {showMobileSidebar ? (
          <X className="h-5 w-5 text-blue-600" />
        ) : (
          <ChevronRight className="h-5 w-5 text-blue-600" />
        )}
      </button>

      {/* Sidebar - enhanced with better styling */}
      <div className={`w-72 bg-[#1a1a1a] overflow-y-auto flex flex-col h-full transition-all duration-300 ease-in-out shadow-lg rounded-r-xl doc-scrollbar
        ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static fixed left-0 top-0 bottom-0 z-40`}
      >
        <div className="sticky top-0 z-10 bg-[#232323] border-b border-gray-700 p-4">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="default" 
              size="sm" 
              className="flex items-center justify-center px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 border-none transition-colors duration-200 shadow-md w-full font-medium"
              onClick={onBack}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Playground
            </Button>
          </div>
          
          <div className="relative mt-4 group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search documentation..."
              className="w-full bg-[#333333] rounded-lg border border-gray-700 py-2 pl-10 pr-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm group-focus-within:shadow-md"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setIsSearching(true)}
            />
            {searchQuery && (
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-300"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {searchQuery && (
            <div className="text-xs text-gray-400 mt-2 flex justify-between items-center">
              <span>{filteredSections.length} result{filteredSections.length !== 1 ? 's' : ''}</span>
              <button 
                className="text-blue-400 hover:text-blue-300 text-xs"
                onClick={() => setSearchQuery('')}
              >
                Clear
              </button>
            </div>
          )}
        </div>
        
        <div className="flex-1 p-4">
          {bookmarkedSections.length > 0 && !isSearching && (
            <div className="mb-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-2 px-2">BOOKMARKS</h3>
              {bookmarkedSections.map((id) => {
                const section = allSections.find(s => s.id === id);
                if (!section) return null;
                
                return (
                  <button
                    key={`bookmark-${id}`}
                    className={`w-full text-left px-3 py-2 rounded-lg mb-1 text-sm flex items-center justify-between ${
                      activeSection === id 
                        ? 'bg-[#1e3a8a] text-white font-medium shadow-sm border border-blue-500' 
                        : 'text-white hover:bg-[#2d2d2d]'
                    }`}
                    onClick={() => setActiveSection(id)}
                  >
                    <span className="truncate">{section.title}</span>
                    <BookmarkCheck className={`h-4 w-4 text-white flex-shrink-0`} />
                  </button>
                );
              })}
              <div className="border-t border-gray-700 my-3"></div>
            </div>
          )}
          
          {isSearching && searchResults.length > 0 && (
            <div className="mb-5 mt-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-2 px-2">Search Results</h3>
              <div className="space-y-3">
                {searchResults.map((result, index) => (
                  <div key={`result-${index}`} className="bg-[#252525] rounded-lg shadow-sm border border-gray-700 overflow-hidden">
                    <button
                      className={`w-full text-left p-3 ${
                        activeSection === result.section.id 
                          ? 'bg-[#1e3a8a] border-l-4 border-blue-500 text-white' 
                          : 'hover:bg-[#2d2d2d] text-white'
                      }`}
                      onClick={() => {
                        setActiveSection(result.section.id);
                        setIsSearching(false);
                      }}
                    >
                      <h4 className={`font-medium text-white mb-1`}>{result.section.title}</h4>
                      <p 
                        className={`text-xs text-gray-300 line-clamp-2`}
                        dangerouslySetInnerHTML={{ __html: result.snippet }}
                      ></p>
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="w-full mt-4 text-center text-sm text-blue-400 hover:text-blue-300 py-2"
                onClick={() => setIsSearching(false)}
              >
                Show all sections
              </button>
            </div>
          )}
          
          {(!isSearching || (isSearching && searchResults.length === 0 && searchQuery === '')) && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-2 px-2">CONTENT</h3>
              {filteredSections.length === 0 && searchQuery !== '' ? (
                <div className="text-center py-8">
                  <div className="text-gray-500 mb-2">
                    <Search className="h-8 w-8 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">No results found</h3>
                  <p className="text-gray-400">Try searching with different keywords</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredSections.map((section) => (
                    <button
                      key={section.id}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-150 flex items-center justify-between group ${
                        activeSection === section.id 
                          ? 'bg-[#1e3a8a] text-white font-medium shadow-sm border border-blue-500' 
                          : 'text-white hover:bg-[#2d2d2d]'
                      } ${section.level === 1 ? 'font-medium' : 'pl-6 text-sm'}`}
                      onClick={() => setActiveSection(section.id)}
                    >
                      <span className={`truncate ${section.level === 1 ? '' : 'opacity-90'}`}>{section.title}</span>
                      
                      <button 
                        className={`opacity-0 group-hover:opacity-100 hover:text-blue-400 transition-opacity duration-200 ${
                          bookmarkedSections.includes(section.id) ? 'text-white' : 'text-gray-400'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(section.id);
                        }}
                      >
                        {bookmarkedSections.includes(section.id) ? (
                          <BookmarkCheck className="h-3.5 w-3.5" />
                        ) : (
                          <Bookmark className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-700 bg-[#232323]">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">
              SnapLogic Playground Docs v1.0
            </p>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-7 w-7 rounded-full hover:bg-gray-700 text-white"
                onClick={() => setActiveSection('introduction')}
                title="Home"
              >
                <Home className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-7 w-7 rounded-full hover:bg-gray-700 text-white"
                onClick={focusSearch}
                title="Search (Ctrl+K)"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content - with improved styling */}
      <div className="flex-1 overflow-y-auto bg-white doc-scrollbar" ref={contentRef}>
        <div className="max-w-4xl mx-auto px-6 py-8 bg-white shadow-sm rounded-lg m-4 min-h-[calc(100%-2rem)]">
          <div className="mb-8 flex justify-between items-start">
            <div>
              <div className="flex items-center mb-2">
                {bookmarkedSections.includes(activeSection) ? (
                  <BookmarkCheck 
                    className="h-5 w-5 text-blue-500 mr-2 cursor-pointer" 
                    onClick={() => toggleBookmark(activeSection)}
                  />
                ) : (
                  <Bookmark 
                    className="h-5 w-5 text-gray-400 mr-2 cursor-pointer hover:text-blue-500 transition-colors duration-200" 
                    onClick={() => toggleBookmark(activeSection)}
                  />
                )}
                <h1 className="text-3xl font-bold text-gray-900">
                  {allSections.find(s => s.id === activeSection)?.title || 'Documentation'}
                </h1>
              </div>
              <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              className="md:hidden bg-white text-blue-600 border-blue-200 shadow-sm hover:bg-blue-50 hover:border-blue-300"
              onClick={toggleMobileSidebar}
            >
              Contents
            </Button>
          </div>
          
          <div className="prose prose-blue max-w-none">
            {getContentForSection(activeSection)}
          </div>
          
          <div className="mt-12 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <button 
                className={`flex items-center px-3 py-2 text-blue-600 hover:text-blue-800 transition-colors rounded-lg hover:bg-blue-50 ${
                  allSections.findIndex(s => s.id === activeSection) === 0 ? 'invisible' : ''
                }`}
                onClick={() => {
                  const currentIndex = allSections.findIndex(s => s.id === activeSection);
                  if (currentIndex > 0) {
                    setActiveSection(allSections[currentIndex - 1].id);
                  }
                }}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </button>
              
              <button 
                className={`flex items-center px-3 py-2 text-blue-600 hover:text-blue-800 transition-colors rounded-lg hover:bg-blue-50 ${
                  allSections.findIndex(s => s.id === activeSection) === allSections.length - 1 ? 'invisible' : ''
                }`}
                onClick={() => {
                  const currentIndex = allSections.findIndex(s => s.id === activeSection);
                  if (currentIndex < allSections.length - 1) {
                    setActiveSection(allSections[currentIndex + 1].id);
                  }
                }}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}