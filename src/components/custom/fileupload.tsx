import React, { useRef } from "react";

interface FileUploadProps {
  handleFileChange: (file: File | null) => void;
  setProgress: (progress: number) => void;
  progress: number;
  fileName: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ progress, fileName, handleFileChange}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;
    handleFileChange(file);
  };


  return (

    <div style={{
      maxWidth: '400px',
      margin: '20px auto',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    }}>      
      <div style={{ marginBottom: '15px' }}>
        <input 
          accept=".doc,.docx,.xls,.xlsx,.pdf,.jpg,.jpeg,.png"
          type="file" 
          ref={fileInputRef}
          onChange={onFileChange}
          style={{ display: 'none' }}
          id="fileInput"
        />
        <div style={{
          display: 'flex',
          alignItems: 'center'
        }}>
          <label 
            htmlFor="fileInput"
            style={{
              padding: '10px 15px',
              backgroundColor: '#3498db',
              color: 'white',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#2980b9')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#3498db')}
          >
            Examinar
          </label>
          <span style={{
            marginLeft: '10px',
            fontSize: '0.9rem',
            color: '#666',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}>
            {fileName}
          </span>
        </div>
      </div>
      
      <div style={{
        marginBottom: '15px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '5px'
        }}>
          <span>Progress:</span>
          <span>{progress}%</span>
        </div>
        <div style={{
          width: '100%',
          backgroundColor: '#e0e0e0',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '10px',
            backgroundColor: '#4CAF50',
            transition: 'width 0.3s ease-in-out'
          }}></div>
        </div>
      </div>
    </div>
  );
};
export default FileUpload;
