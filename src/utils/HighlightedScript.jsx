import React, { useRef, useEffect } from 'react';
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
        { token: 'keyword', foreground: '800000' },
        { token: 'string', foreground: '0451A5' },
        { token: 'number', foreground: '098658' },
        { token: 'operator', foreground: '000000' },
        { token: 'function', foreground: '795E26' },
        { token: 'variable', foreground: '001080' },
        { token: 'jsonpath', foreground: '0000FF' },
        { token: 'delimiter', foreground: '000000' }
      ],
      colors: {
        'editor.foreground': '#000000',
        'editor.background': '#FFFFFF',
        'editor.lineHighlightBackground': '#F0F0F0',
        'editorCursor.foreground': '#000000',
        'editor.selectionBackground': '#ADD6FF'
      }
    });

    editor.updateOptions({
      renderLineHighlight: 'all',
      lineNumbers: 'on',
      fontSize: 13,
      fontFamily: 'Monaco, Consolas, "Courier New", monospace',
      lineHeight: 20,
      padding: { top: 4, bottom: 4 },
      scrollBeyondLastLine: false,
      minimap: { enabled: false },
      overviewRulerLanes: 0
    });

    // Handle content changes
    editor.onDidChangeModelContent(() => {
      onChange(editor.getValue());
    });
  };

  return (
    <div className="flex-1 relative">
      <Editor
        height="100%"
        defaultLanguage="javascript"
        value={content}
        onMount={handleEditorDidMount}
        theme="scriptTheme"
        options={{
          readOnly: false,
          automaticLayout: true,
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10
          }
        }}
      />
      {activeLineIndex !== null && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: activeLineIndex * 20,
            height: '20px',
            backgroundColor: '#F0F0F0',
            pointerEvents: 'none'
          }}
        />
      )}
    </div>
  );
};

export default HighlightedScript;
