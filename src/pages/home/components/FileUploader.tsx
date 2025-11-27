import { useState, useRef, useEffect } from "react";

interface FileUploaderProps {
  uploadedFiles: File[];
  onFilesChange: (files: File[]) => void;
}

export default function FileUploader({
  uploadedFiles,
  onFilesChange,
}: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 목록이 비워지면 input도 리셋
  useEffect(() => {
    if (uploadedFiles.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [uploadedFiles.length]);

  // 파일 입력 관련 함수
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    onFilesChange([...uploadedFiles, ...files]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      onFilesChange([...uploadedFiles, ...files]);
      // 같은 파일을 다시 선택해도 onChange가 트리거되도록 input value 리셋
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <>
      {/* Upload Area */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 h-[80vh] flex flex-col">
        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 flex-1 flex flex-col items-center justify-center ${
            isDragOver
              ? "border-primary-500 bg-primary-50"
              : "border-gray-300 hover:border-primary-400 hover:bg-gray-50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="w-16 h-16 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center">
            <i className="ri-upload-cloud-2-line text-3xl text-primary-600"></i>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            계약서를 업로드해볼까요?
          </h3>

          <p className="text-gray-600 mb-6">
            파일을 여기에 끌어다 놓거나 클릭해서 선택해주세요
            <br />
            <span className="text-sm text-gray-500">
              지원 형식: PDF, DOCX · 최대 파일 크기: 10MB
            </span>
          </p>

          <input
            ref={fileInputRef}
            type="file"
            id="file-upload"
            className="hidden"
            multiple
            accept=".pdf,.docx,.doc"
            onChange={handleFileSelect}
          />

          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-folder-open-line mr-2"></i>
            파일 선택
          </label>
        </div>
      </div>
    </>
  );
}
