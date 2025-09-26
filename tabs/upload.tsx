import React, { useEffect, useRef, useState } from "react";
import actions from "~actions";
import './upload.scss'
import ThemeProvider from "~components/ThemeProvider";

type State = "error" | "warning" | "success"

const UploadPage = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [status, setStatus] = useState<string>("No file chosen.");
  const [state, setState] = useState<State>("warning");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const setStatusMsg = (msg: string, state: State) => {
    setState(state);
    setStatus(msg);
  };

  const handleFile = async (file: File | null) => {
    if (!file) {
      setStatusMsg("No file selected.", "warning");
      return;
    }
    setFileName(file.name || "");

    if (!file.name.toLowerCase().endsWith(".json")) {
      setStatusMsg("Please select a .json file.", "warning");
      return;
    }

    setIsUploading(true);
    setStatusMsg("Reading file...", "warning");

    try {
      actions.backup.upload(
        file,
        (error) => {
          if (error) {
            setStatusMsg(`Upload failed: ${error}`, 'error');
          }
        },
        () => {
          setStatusMsg("Upload successful! Now closing the window!", "success");
          setFileName("");
          setTimeout(() => {
            window.close();
          }, 1500);
        }
      );
      setIsUploading(false);
    } catch (err: any) {
      setStatusMsg("Read error: " + (err?.message || String(err)), "error");
      setIsUploading(false);
    }
  };

  return (
    <ThemeProvider>

      <div className="upload-page">
        <div className="upload-header">
          <div className="upload-header-left">
            <h2 className="upload-title">Upload a local backup</h2>
            <p className="upload-desc">
              Select a <code className="upload-code">.json</code> backup file to import.
            </p>
          </div>

          <div className="upload-header-right">
            <button
              className="button close-button"
              onClick={() => window.close()}
              aria-label="Close upload window"
            >
              Close
            </button>
          </div>
        </div>

        <div className="upload-body">
          <div className="file-controls">
            <button
              className="button choose-button"
              onClick={openFilePicker}
              disabled={isUploading}
            >
              Choose file
            </button>

            <div className="file-name" title={fileName || "No file selected"}>
              {fileName || "No file selected"}
            </div>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept=".json"
            className="file-input"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />

          <div className={`status ${state}`}>{status}</div>

        </div>
      </div>
    </ThemeProvider>
  )
}

export default UploadPage;
