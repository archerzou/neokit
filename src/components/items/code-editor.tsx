"use client";

import { useRef, useState } from "react";
import Editor, { OnMount, loader, Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useClipboard } from "@/hooks/use-clipboard";
import EditorHeader from "./editor-header";
import { useEditorPreferences } from "@/components/settings/editor-preferences-provider";
import type { EditorTheme } from "@/lib/constants/editor";
import { explainCode } from "@/actions/ai";
import { toast } from "sonner";
import ProAiButton from "@/components/shared/pro-ai-button";

// Configure Monaco to load from CDN
loader.config({
  paths: {
    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs",
  },
});

// Define custom themes
function defineCustomThemes(monaco: Monaco) {
  // GitHub Light theme
  monaco.editor.defineTheme("github-light", {
    base: "vs",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6a737d" },
      { token: "keyword", foreground: "d73a49" },
      { token: "string", foreground: "032f62" },
      { token: "number", foreground: "005cc5" },
      { token: "type", foreground: "e36209" },
      { token: "function", foreground: "6f42c1" },
      { token: "variable", foreground: "24292e" },
    ],
    colors: {
      "editor.background": "#ffffff",
      "editor.foreground": "#24292e",
      "editor.lineHighlightBackground": "#f6f8fa",
      "editorCursor.foreground": "#24292e",
      "editor.selectionBackground": "#0366d625",
    },
  });

  // Solarized Light theme
  monaco.editor.defineTheme("solarized-light", {
    base: "vs",
    inherit: true,
    rules: [
      { token: "comment", foreground: "93a1a1" },
      { token: "keyword", foreground: "859900" },
      { token: "string", foreground: "2aa198" },
      { token: "number", foreground: "d33682" },
      { token: "type", foreground: "b58900" },
      { token: "function", foreground: "268bd2" },
      { token: "variable", foreground: "657b83" },
    ],
    colors: {
      "editor.background": "#fdf6e3",
      "editor.foreground": "#657b83",
      "editor.lineHighlightBackground": "#eee8d5",
      "editorCursor.foreground": "#657b83",
      "editor.selectionBackground": "#eee8d5",
    },
  });
}

// Map theme names to Monaco theme names
function getMonacoTheme(theme: EditorTheme): string {
  const themeMap: Record<EditorTheme, string> = {
    "vs": "vs",
    "github-light": "github-light",
    "solarized-light": "solarized-light",
  };
  return themeMap[theme];
}

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  // AI Explain props (only for drawer read mode)
  showExplain?: boolean;
  isPro?: boolean;
  title?: string;
  typeName?: string;
}

export default function CodeEditor({
  value,
  onChange,
  language = "plaintext",
  readOnly = false,
  showExplain = false,
  isPro = false,
  title = "",
  typeName = "snippet",
}: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const { copied, copy } = useClipboard();
  const { preferences } = useEditorPreferences();

  // Explain state
  const [activeView, setActiveView] = useState<"code" | "explain">("code");
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    // Define custom themes when Monaco mounts
    defineCustomThemes(monaco);
    // Apply the selected theme
    monaco.editor.setTheme(getMonacoTheme(preferences.theme));
  };

  const handleCopy = () => copy(value);

  const handleExplain = async () => {
    if (!isPro) return;
    if (isExplaining) return;

    setIsExplaining(true);
    try {
      const result = await explainCode({
        title,
        content: value,
        language: language || null,
        typeName: typeName as "snippet" | "command",
      });

      if (result.success && result.data) {
        setExplanation(result.data);
        setActiveView("explain");
      } else {
        toast.error(result.error || "Failed to explain code");
      }
    } catch {
      toast.error("Failed to explain code. Please try again.");
    } finally {
      setIsExplaining(false);
    }
  };

  // Map common language aliases to Monaco language IDs
  const getMonacoLanguage = (lang: string): string => {
    const languageMap: Record<string, string> = {
      js: "javascript",
      ts: "typescript",
      py: "python",
      rb: "ruby",
      sh: "shell",
      bash: "shell",
      zsh: "shell",
      yml: "yaml",
      md: "markdown",
      jsx: "javascript",
      tsx: "typescript",
    };
    return languageMap[lang.toLowerCase()] || lang.toLowerCase();
  };

  const monacoLanguage = getMonacoLanguage(language);
  const displayLanguage = language || "plaintext";

  // Calculate height based on content lines (fluid height with max)
  const lineCount = value.split("\n").length;
  // Calculate line height based on font size (roughly 1.5x the font size)
  const lineHeight = Math.round(preferences.fontSize * 1.5);
  const padding = 16; // Top and bottom padding
  const minHeight = 100;
  const maxHeight = 400;
  const calculatedHeight = Math.min(
    Math.max(lineCount * lineHeight + padding, minHeight),
    maxHeight
  );

  // Show tabs when explanation has been generated
  const showTabs = showExplain && explanation !== null;
  const tabs = showTabs
    ? [
        { id: "code", label: "Code" },
        { id: "explain", label: "Explain" },
      ]
    : undefined;

  // Build extra buttons for the header
  const extraButtons = showExplain ? (
    <ProAiButton
      isPro={isPro}
      label="Explain"
      loadingLabel="Explaining..."
      isLoading={isExplaining}
      onClick={handleExplain}
    />
  ) : null;

  return (
    <div className="rounded-lg border border-border overflow-hidden bg-white">
      <EditorHeader
        label={displayLanguage}
        copied={copied}
        onCopy={handleCopy}
        copyTitle="Copy code"
        tabs={tabs}
        activeTab={activeView}
        onTabChange={(id) => setActiveView(id as "code" | "explain")}
        showDots={!showTabs}
        extraButtons={extraButtons}
      />

      {/* Code View */}
      {activeView === "code" && (
        <Editor
          height={calculatedHeight}
          language={monacoLanguage}
          value={value}
          onChange={(val) => onChange?.(val ?? "")}
          onMount={handleEditorMount}
          theme={getMonacoTheme(preferences.theme)}
          options={{
            readOnly,
            minimap: { enabled: preferences.minimap },
            scrollBeyondLastLine: false,
            fontSize: preferences.fontSize,
            tabSize: preferences.tabSize,
            lineHeight: lineHeight,
            padding: { top: 8, bottom: 8 },
            lineNumbers: "on",
            lineNumbersMinChars: 3,
            renderLineHighlight: readOnly ? "none" : "line",
            cursorStyle: readOnly ? "underline" : "line",
            scrollbar: {
              vertical: "auto",
              horizontal: "auto",
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
              useShadows: false,
            },
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            overviewRulerBorder: false,
            wordWrap: preferences.wordWrap ? "on" : "off",
            folding: false,
            contextmenu: !readOnly,
            domReadOnly: readOnly,
          }}
        />
      )}

      {/* Explain View */}
      {activeView === "explain" && explanation && (
        <div
          className="prose prose-sm max-w-none p-4 overflow-y-auto editor-scrollbar"
          style={{ minHeight: `${minHeight}px`, maxHeight: `${maxHeight}px` }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {explanation}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}
