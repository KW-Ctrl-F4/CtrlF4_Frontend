import { useState } from "react";

interface FileUploaderProps {
  uploadedFiles: File[];
  onFilesChange: (files: File[]) => void;
  onStartAnalysis: () => void;
}

export default function FileUploader({
  uploadedFiles,
  onFilesChange,
  onStartAnalysis,
}: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);

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
    }
  };

  const removeFile = (index: number) => {
    onFilesChange(uploadedFiles.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <>
      {/* Upload Area */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
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
            파일을 여기에 끌어다 놓으세요
          </h3>

          <p className="text-gray-600 mb-6">
            또는 컴퓨터에서 파일을 선택하세요. 지원 형식: PDF, DOCX
            <br />
            최대 파일 크기: 10MB
          </p>

          <input
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

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            업로드된 파일 ({uploadedFiles.length})
          </h3>

          <div className="space-y-4">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <i className="ri-file-text-line text-primary-600"></i>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <i className="ri-check-line mr-1"></i>
                  </span>
                  <button
                    onClick={() => removeFile(index)}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                  >
                    <i className="ri-close-line"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={onStartAnalysis}
              className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-upload-line mr-2"></i>
              분석 시작
            </button>
          </div>
        </div>
      )}
    </>
  );
}
