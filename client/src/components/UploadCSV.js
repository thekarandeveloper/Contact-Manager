import axios from "axios";
import React, { useState } from "react";
import { FaFileCsv } from "react-icons/fa";

function UploadCSV({fetchChanges, toggleModal}) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      setUploading(true);

      try {
        const response = await axios.post('/api/contacts/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentCompleted);
          },
        });

        console.log("Upload Successfully", response.data);
        fetchChanges()
      } catch (error) {
        console.error("Error Uploading File", error.response ? error.response.data : error.message);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="csv-body flex flex-col gap-8">
      <div className="w-full min-h-60 border-2 border-dashed flex flex-col justify-center items-center gap-2 text-gray-500">
        <FaFileCsv className="text-[60px] text-gray-500" /> Drag & Drop, or
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="text-[#0060ef] font-medium hover:underline hover:cursor-pointer bg-white"
        />
      </div>

      <button
        className="border border-1 text-md p-2 rounded-md bg-[#0060ef] text-white font-medium"
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading ? `Uploading ${progress}%` : 'Import'}
      </button>
    </div>
  );
}

export default UploadCSV;
