import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';

const HighlightedScript = ({ content, onChange, activeLineIndex }) => {
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Define custom theme for script syntax highlighting
    monaco.editor.defineTheme('scriptTheme', {
      base: 'vs',
      inherit: false,
      rules: [
        // JSONPath specific rules
        { token: 'jsonpath', foreground: '0000FF', fontStyle: 'bold' },  // $ expressions
        { token: 'delimiter', foreground: '000000' },                    // dots and brackets
        { token: 'property', foreground: '001080' },                     // property names
        
        
        // General syntax rules
        { token: 'string', foreground: '0451A5' },
        { token: 'number', foreground: '098658' },
        { token: 'operator', foreground: '000000' },
        { token: 'function', foreground: '795E26' },
        { token: 'variable', foreground: '001080' }
      ],
      colors: {
        'editor.foreground': '#000000',
        'editor.background': '#FFFFFF',
        'editor.lineHighlightBackground': '#F7F7F7',
        'editorCursor.foreground': '#000000',
        'editor.selectionBackground': '#ADD6FF',
        'editorLineNumber.foreground': '#237893',
        'editorLineNumber.activeForeground': '#0B216F'
      }
    });

    // Configure editor to look like a textarea
    editor.updateOptions({
      lineNumbers: 'on',
      fontSize: 13,
      fontFamily: 'Manrope, Monaco, Consolas, monospace',
      lineHeight: 24,
      padding: { top: 8, bottom: 8 },
      scrollBeyondLastLine: false,
      minimap: { enabled: false },
      overviewRulerLanes: 0,
      hideCursorInOverviewRuler: true,
      overviewRulerBorder: false,
      renderLineHighlight: 'all',
      roundedSelection: false,
      wordWrap: 'on',
      autoIndent: 'keep',
      formatOnPaste: false,
      formatOnType: false,
      autoClosingBrackets: 'never',
      autoClosingQuotes: 'never',
      suggestOnTriggerCharacters: false,
      quickSuggestions: false
    });

    // Handle content changes
    editor.onDidChangeModelContent(() => {
      const newValue = editor.getValue();
      onChange(newValue);
    });

    // Handle cursor position for line highlighting
    editor.onDidChangeCursorPosition((e) => {
      const lineNumber = e.position.lineNumber - 1;
      if (typeof activeLineIndex === 'number') {
        editor.deltaDecorations([], [
          {
            range: new monaco.Range(lineNumber + 1, 1, lineNumber + 1, 1),
            options: {
              isWholeLine: true,
              className: 'currentLineDecoration'
            }
          }
        ]);
      }
    });
  };

  return (
    <div className="flex-1 relative font-['Manrope']" style={{ overflow: 'hidden' }}>
      <Editor
        height="100%"
        defaultLanguage="javascript"
        value={content}
        onMount={handleEditorDidMount}
        theme="scriptTheme"
        options={{
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
            verticalSliderSize: 10,
            horizontalSliderSize: 10,
            useShadows: false
          }
        }}
      />
      <style jsx global>{`
        .currentLineDecoration {
          background-color: #F7F7F7;
        }
        .monaco-editor .margin {
          background-color: #FFFFFF !important;
        }
        .monaco-editor {
          padding-top: 4px;
        }
      `}</style>
    </div>
  );
};

export default HighlightedScript;