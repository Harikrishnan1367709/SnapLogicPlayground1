import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';

const HighlightedScript = ({ content, onChange, activeLineIndex, payload }) => {
  const editorRef = useRef(null);
  const completionProviderRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && completionProviderRef.current) {
      // Update completion provider when payload changes
      updateCompletionProvider(payload);
    }
  }, [payload]);

  const debugKeys = (obj) => {
    const keys = Object.keys(obj);
    console.log('Current payload keys:', keys);
    return keys;
  };

  const validatePayload = (rawPayload) => {
    try {
      return typeof rawPayload === 'string' ? JSON.parse(rawPayload) : rawPayload;
    } catch (error) {
      console.error('Error parsing payload:', error);
      return {};
    }
  };

  const createSuggestions = (jsonData, position, wordUntilPosition, monaco) => {
    const keys = debugKeys(jsonData);
    
    return keys.map(key => ({
      label: key,
      kind: monaco.languages.CompletionItemKind.Field,
      insertText: key,
      detail: `${key}: ${JSON.stringify(jsonData[key])}`,
      documentation: {
        value: `Type: ${typeof jsonData[key]}\nValue: ${JSON.stringify(jsonData[key], null, 2)}`
      },
      range: {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: wordUntilPosition.startColumn,
        endColumn: wordUntilPosition.endColumn
      }
    }));
  };

  const updateCompletionProvider = (currentPayload) => {
    const editor = editorRef.current;
    const monaco = window.monaco;

    if (!editor || !monaco) return;

    // Dispose of previous completion provider if it exists
    if (completionProviderRef.current) {
      completionProviderRef.current.dispose();
    }

    completionProviderRef.current = monaco.languages.registerCompletionItemProvider('javascript', {
      provideCompletionItems: (model, position) => {
        const wordUntilPosition = model.getWordUntilPosition(position);
        const lineContent = model.getLineContent(position.lineNumber);
        const lastChar = lineContent.charAt(wordUntilPosition.startColumn - 2);

        try {
          const jsonData = validatePayload(currentPayload);

          // Trigger for $ character
          if (lastChar === '$' || lineContent.trim() === '$') {
            const suggestions = createSuggestions(jsonData, position, wordUntilPosition, monaco);
            return { suggestions };
          }

          // Trigger for dot after a path
          if (lineContent.includes('$') && lastChar === '.') {
            const pathUntilDot = lineContent
              .substring(lineContent.indexOf('$') + 1, lineContent.length - 1)
              .trim();

            let currentObj = jsonData;
            if (pathUntilDot) {
              const parts = pathUntilDot.split('.');
              for (const part of parts) {
                currentObj = currentObj?.[part];
              }
            }

            if (currentObj && typeof currentObj === 'object') {
              const suggestions = createSuggestions(currentObj, position, wordUntilPosition, monaco);
              return { suggestions };
            }
          }
        } catch (error) {
          console.error('Error in suggestion provider:', error);
        }

        return { suggestions: [] };
      },
      triggerCharacters: ['$', '.']
    });
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    window.monaco = monaco;

    // Initial setup of completion provider
    updateCompletionProvider(payload);

    // Theme definition
    monaco.editor.defineTheme('scriptTheme', {
      base: 'vs',
      inherit: false,
      rules: [
        { token: 'jsonpath', foreground: '800000', fontStyle: 'bold' },
        { token: 'delimiter', foreground: '000000' },
        { token: 'property', foreground: '001080' },
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
      suggestOnTriggerCharacters: true,
      quickSuggestions: {
        other: true,
        strings: true,
        comments: true
      },
      acceptSuggestionOnCommitCharacter: true,
      suggestSelection: 'first',
      suggest: {
        showIcons: true,
        showStatusBar: true,
        preview: true,
        previewMode: 'prefix',
        filterGraceful: true,
        snippets: 'inline'
      }
    });

    editor.onDidChangeModelContent(() => {
      const newValue = editor.getValue();
      onChange(newValue);
    });

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
      <style dangerouslySetInnerHTML={{
        __html: `
          .currentLineDecoration {
            background-color: #F7F7F7;
          }
          .monaco-editor .margin {
            background-color: #FFFFFF !important;
          }
          .monaco-editor {
            padding-top: 4px;
          }
        `
      }} />
    </div>
  );
};

export default HighlightedScript;