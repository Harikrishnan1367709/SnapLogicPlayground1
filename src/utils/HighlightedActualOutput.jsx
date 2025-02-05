import React from 'react';
import Editor from '@monaco-editor/react';
import PropTypes from 'prop-types';

const HighlightedActualOutput = ({ 
  actualOutput, 
  onActualOutputChange
}) => {
  const handleEditorDidMount = (editor, monaco) => {
    monaco.editor.defineTheme('outputTheme', {
      base: 'vs',
      inherit: false,
      rules: [
        { token: 'error', foreground: 'FF0000' },
        { token: 'string', foreground: '0451A5' },
        { token: 'number', foreground: '098658' },
        { token: 'keyword', foreground: '0000FF' },
        { token: 'delimiter', foreground: '000000' }
      ],
      colors: {
        'editor.foreground': '#000000',
        'editor.background': '#FFFFFF',
        'editor.lineHighlightBackground': '#FFFFFF'
      }
    });

    editor.updateOptions({
      readOnly: true,
      lineNumbers: 'on',
      fontSize: 13,
      fontFamily: 'Manrope, Monaco, Consolas, monospace',
      lineHeight: 24,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      renderLineHighlight: 'none'
    });
  };
  const handleEditorChange = (value) => {
    if (onActualOutputChange) {
      onActualOutputChange(value);
    }
  };


  return (
    <div className="h-full w-full">
    <div className="h-full w-full relative">
      <Editor
        height="100%"
        width="100%"
        defaultLanguage="json"
        value={actualOutput || ''}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme="outputTheme"
        options={{
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
            verticalSliderSize: 8,
            horizontalSliderSize: 8,
            useShadows: false
          },
          automaticLayout: true // Enable automatic resizing
        }}
      />
      </div>
      <style>{`
        .monaco-editor {
          padding-top: 4px;
        }
        .monaco-editor .margin {
          background-color: #FFFFFF !important;
        }
        .monaco-editor .line-numbers {
          color: #237893 !important;
        }
        
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-corner {
          background: transparent;
        }
      `}</style>
    </div>
  );
};

HighlightedActualOutput.propTypes = {
    actualOutput: PropTypes.string,
    onActualOutputChange: PropTypes.func
  
};

HighlightedActualOutput.defaultProps = {
    actualOutput: '',
    onActualOutputChange: () => {}
};

export default HighlightedActualOutput;