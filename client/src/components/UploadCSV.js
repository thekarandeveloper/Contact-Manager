import axios from "axios";
import React, { useState } from "react";
import { FaFileCsv } from "react-icons/fa";

function UploadCSV({fetchChanges, toggleModal}) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("Choose File");
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file){
      setFile(e.target.files[0]);
      setFileName(file.name)
    } else{
      setFileName("Choose File")
    }
  };

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      setUploading(true);

      try {
        const response = await axios.post('https://cm-backend-service-8dc88f99d89b.herokuapp.com/api/contacts/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 80) / progressEvent.total);
            const button = document.getElementById('cta-button');
            button.style.opacity = 0.5;
            setProgress(percentCompleted);
          },
        });

        console.log("Upload Successfully", response.data);
        
        fetchChanges()
        toggleModal()
      } catch (error) {
        console.error("Error Uploading File", error.response ? error.response.data : error.message);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="csv-body flex flex-col gap-8">
      <div className="w-full min-h-60 border-2 border-dashed flex flex-col justify-center items-center gap-2 text-gray-500" onDragLeave={handleFileChange}>
        <FaFileCsv className="text-[60px] text-gray-500" />

        <label className="text-[#0060ef] font-medium hover:underline hover:cursor-pointer bg-white mt-4 p-2 border rounded-md">
        {fileName}
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden" // Hide the default file input
        />
      </label>
        
      </div>

      <button
        id="cta-button"
        className=" border border-1 text-md p-2 rounded-md bg-[#0060ef] text-white font-medium"
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading ? `Uploading ${progress}%` : 'Import'}
      </button>
    </div>
  );
}

export default UploadCSV;
