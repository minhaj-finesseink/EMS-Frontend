import React, { useState } from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = () => {
  const [code, setCode] = useState(`console.log("Hello world!");`);
  const [output, setOutput] = useState("");

  const runCode = () => {
    const logs = [];
    const originalConsoleLog = console.log;

    try {
      // Intercept console.log
      console.log = (...args) => logs.push(args.join(" "));

      const result = eval(code);

      if (result !== undefined) {
        logs.push(String(result));
      }

      setOutput(logs.join("\n"));
    } catch (err) {
      setOutput("❌ " + err.message);
    } finally {
      console.log = originalConsoleLog;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "96%",
        fontFamily: "Inter",
        border: "1.5px solid #545454",
        borderRadius: "8px",
      }}
    >
      {/* Left: Editor */}
      <div
        style={{
          flex: 1,
          borderRight: "2px solid #333",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          backgroundColor: "#222",
          borderRadius: "8px",
          borderBottomRightRadius: 0,
        }}
      >
        <div style={{ borderTopLeftRadius: "8px", overflow: "hidden" }}>
          <Editor
            height="62vh"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value)}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              wordWrap: "on",
            }}
          />
        </div>

        <button
          onClick={runCode}
          style={{
            padding: "10px",
            background: "#222",
            color: "#fff",
            border: "none",
            position: "absolute",
            bottom: "10px",
            width: "100%",
            borderBottomLeftRadius: "8px",
          }}
        >
          ▶ Run Code
        </button>
      </div>

      {/* Right: Output */}
      <div
        style={{
          flex: 1,
          background: "#111",
          color: "#0f0",
          padding: "1rem",
          overflowY: "auto",
          borderTopRightRadius: "8px",
          borderBottomRightRadius: "8px",
        }}
      >
        <h3 style={{ color: "#0ff" }}>Console Output</h3>
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default CodeEditor;
