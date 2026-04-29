"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
}

export function FileUpload({ onFileUpload, isLoading }: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileUpload(acceptedFiles[0]);
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-12 border-2 border-dashed rounded-xl cursor-pointer transition-colors
      ${isDragActive ? "border-primary bg-primary/10" : "border-gray-300 hover:border-primary/50"}`}
    >
      <input {...getInputProps()} />
      <UploadCloud className="w-12 h-12 text-gray-400 mb-4" />
      {isLoading ? (
        <>
          <p className="text-lg font-semibold">Processing Big Data Pipeline...</p>
          <p className="text-sm text-gray-500">Please wait while we analyze the dataset.</p>
        </>
      ) : isDragActive ? (
        <p className="text-lg font-semibold">Drop the file here ...</p>
      ) : (
        <>
          <p className="text-lg font-semibold">Drag & drop your dataset here, or click to select</p>
          <p className="text-sm text-gray-500">Supports .csv, .xls, .xlsx</p>
        </>
      )}
    </div>
  );
}
