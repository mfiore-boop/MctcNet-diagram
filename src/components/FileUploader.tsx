import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface FileUploaderProps {
  onFileUpload: (files: File[]) => void;
  isLoading?: boolean;
  className?: string;
}

export function FileUploader({ onFileUpload, isLoading, className }: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt', '.rev', '.sav', '.ini', '.cfg'],
      'application/octet-stream': ['.rev', '.sav'],
      'application/json': ['.json'],
    },
    multiple: false,
  } as any);

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border border-dashed p-12 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center gap-6",
        isDragActive ? "border-carbon-blue-60 bg-carbon-gray-10" : "border-carbon-gray-20 bg-carbon-gray-10 hover:bg-carbon-gray-20",
        isDragReject && "border-red-500 bg-red-50",
        className
      )}
    >
      <input {...getInputProps()} />
      <div className={cn(
        "w-12 h-12 flex items-center justify-center",
        isDragActive ? "text-carbon-blue-60" : "text-carbon-gray-80"
      )}>
        {isDragReject ? <AlertCircle className="w-8 h-8 text-red-500" /> : <Upload className="w-8 h-8" />}
      </div>
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-carbon-gray-100">
          {isDragActive ? "Rilascia il file qui" : "Carica file configurazione"}
        </h3>
        <p className="text-xs text-carbon-gray-80 mt-2 max-w-xs mx-auto font-light">
          Trascina qui il file .rev, .sav o .json, oppure clicca per selezionarlo dal computer.
        </p>
      </div>
      <div className="flex gap-2 mt-2">
        <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold bg-white text-carbon-gray-100 border border-carbon-gray-20">
          .REV
        </span>
        <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold bg-white text-carbon-gray-100 border border-carbon-gray-20">
          .SAV
        </span>
        <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold bg-white text-carbon-gray-100 border border-carbon-gray-20">
          .JSON
        </span>
      </div>
    </div>
  );
}
