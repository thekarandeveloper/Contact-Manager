import axios from "axios";
import React, { useState } from "react";
import { FaFileCsv } from "react-icons/fa";

const API_BASE_URL = "https://cm-backend-service-8dc88f99d89b.herokuapp.com/api/contacts";

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

  const handleTemplateDownload = async (count) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/template-json`, {
        params: { count },
        responseType: "blob",
      });

      const blobUrl = window.URL.createObjectURL(new Blob([response.data], { type: "application/json" }));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = count === 0 ? "contacts-empty-template.json" : `contacts-template-${count}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading template", error.response ? error.response.data : error.message);
    }
  };

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      setUploading(true);

      try {
        const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
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
      <div className="flex flex-col gap-3">
        <p className="text-left text-sm text-gray-600">
          Download a JSON template, fill it with contacts using <code>name</code>, <code>email</code>, and <code>phone</code>, then import the file here.
        </p>
        <div className="flex flex-col md:flex-row gap-3">
          <button
            type="button"
            className="border border-[#0060ef] text-[#0060ef] text-sm p-2 rounded-md font-medium hover:bg-[#0060ef] hover:text-white transition-colors"
            onClick={() => handleTemplateDownload(0)}
          >
            Download Empty Template
          </button>
          <button
            type="button"
            className="border border-[#0d1e38] text-[#0d1e38] text-sm p-2 rounded-md font-medium hover:bg-[#0d1e38] hover:text-white transition-colors"
            onClick={() => handleTemplateDownload(100)}
          >
            Download Template With 100 Records
          </button>
        </div>
      </div>

      <div className="w-full min-h-60 border-2 border-dashed flex flex-col justify-center items-center gap-2 text-gray-500" onDragLeave={handleFileChange}>
        <FaFileCsv className="text-[60px] text-gray-500" />

        <label className="text-[#0060ef] font-medium hover:underline hover:cursor-pointer bg-white mt-4 p-2 border rounded-md">
        {fileName}
        <input
          type="file"
          accept=".csv,.json"
          onChange={handleFileChange}
          className="hidden" // Hide the default file input
        />
      </label>
        <p className="text-sm text-gray-500">Accepted formats: CSV and JSON</p>
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
