import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';

const HighLightedJSON = ({ content, onChange, style, format = 'json' }) => {
  const editorRef = useRef(null);
  const initialSetupDone = useRef(false);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // JSON theme with syntax highlighting
    monaco.editor.defineTheme('dataweaveTheme', {
      base: 'vs',
      inherit: false,
      rules: [
        { token: 'string.key.json', foreground: '800000' },
        { token: 'string.value.json', foreground: '0000FF' },
        { token: 'number.json', foreground: '098658' },
        { token: 'punctuation.bracket.json', foreground: '000000' },
        { token: 'punctuation.array.json', foreground: '000000' },
        { token: 'punctuation.comma.json', foreground: '000000' },
        { token: 'punctuation.colon.json', foreground: '000000' },
        { token: 'punctuation.definition.block.json', foreground: '000000' },
        { token: 'punctuation.curlybrace.open', foreground: '000000' },
        { token: 'punctuation.curlybrace.close', foreground: '000000' },
        { token: 'delimiter.curly', foreground: '000000' },
        { token: 'delimiter.bracket', foreground: '000000' },
        { token: 'delimiter.square', foreground: '000000' },
        { token: 'punctuation', foreground: '000000' },
        { token: '', foreground: '000000' }  // Default color for all other tokens including brackets
      ],
      colors: {
        'editor.foreground': '#000000',
        'editor.background': '#FFFFFF',
        'editor.lineHighlightBackground': '#F0F0F0',
        'editorCursor.foreground': '#000000',
        'editor.selectionBackground': '#ADD6FF',
        'editor.inactiveSelectionBackground': '#E5EBF1'
      }
    });

    // Plain black theme for XML and CSV
    monaco.editor.defineTheme('plainTheme', {
      base: 'vs',
      inherit: false,
      rules: [
        { token: '', foreground: '000000' }
      ],
      colors: {
        'editor.foreground': '#000000',
        'editor.background': '#FFFFFF',
        'editor.lineHighlightBackground': '#F0F0F0',
        'editorCursor.foreground': '#000000',
        'editor.selectionBackground': '#ADD6FF',
        'editor.inactiveSelectionBackground': '#E5EBF1'
      }
    });

    // Set initial theme
    monaco.editor.setTheme(format === 'json' ? 'dataweaveTheme' : 'plainTheme');

    editor.updateOptions({
      renderLineHighlight: 'all',
      highlightActiveIndentGuide: true,
      fontSize: 13,
      fontFamily: 'Monaco, Consolas, "Courier New", monospace',
      lineHeight: 20,
      padding: { top: 4, bottom: 4 },
      lineNumbers: 'on',
      roundedSelection: false,
      scrollBeyondLastLine: false,
      readOnly: false,
      cursorStyle: 'line',
      automaticLayout: true,
      wordWrap: 'on',
      autoIndent: 'full',
      formatOnPaste: true,
      formatOnType: false,
      suggestOnTriggerCharacters: false,
      quickSuggestions: false,
      autoClosingBrackets: 'never',
      autoClosingQuotes: 'never',
      autoSurround: 'never',
      renderWhitespace: 'none',
      occurrencesHighlight: false,
      links: false,
      contextmenu: false
    });

    // Handle content changes
    editor.onDidChangeModelContent((event) => {
      const newContent = editor.getValue();
      const currentPosition = editor.getPosition();
      
      if (newContent !== content) {
        onChange(newContent);
        localStorage.setItem('payloadContent', newContent);
        
        if (currentPosition) {
          setTimeout(() => {
            editor.setPosition(currentPosition);
            editor.focus();
          }, 0);
        }
      }
    });

    // Initial setup
    if (!initialSetupDone.current) {
      const savedContent = localStorage.getItem('payloadContent');
      if (savedContent && savedContent !== content) {
        editor.setValue(savedContent);
        onChange(savedContent);
      }

      setTimeout(() => {
        const model = editor.getModel();
        if (model) {
          const lineCount = model.getLineCount();
          const lastLineLength = model.getLineLength(lineCount);
          editor.setPosition({
            lineNumber: lineCount,
            column: lastLineLength + 1
          });
          editor.focus();
          initialSetupDone.current = true;
        }
      }, 100);
    }
  };

  // Update theme when format changes
  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current;
      // Use monaco instance to set theme
      const monaco = window.monaco;
      if (monaco) {
        monaco.editor.setTheme(format === 'json' ? 'dataweaveTheme' : 'plainTheme');
      }
    }
  }, [format]);

  return (
    <div className="flex-1 border rounded-sm" style={{ ...style, overflow: 'hidden' }}>
      <Editor
        height="100%"
        defaultLanguage={format.toLowerCase()}
        value={content}
        onMount={handleEditorDidMount}
        theme={format === 'json' ? 'dataweaveTheme' : 'plainTheme'}
        options={{
          minimap: { enabled: false },
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          overviewRulerBorder: false,
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
    </div>
  );
};

export default HighLightedJSON;