import React from "react";
import { FaFileCsv } from "react-icons/fa";
function UploadCSV() {
  return (
    <div className="csv-body flex flex-col gap-8">
      <div className="w-full min-h-60  border-2 border-dashed flex flex-col justify-center items-center gap-2 text-gray-500">
        <FaFileCsv className="text-[60px] text-gray-500"/> Drag & Drop, or <div className="text-[#0060ef] font-medium hover:underline hover:cursor-pointer">Browse </div>
      </div>

      <button className="border border-1 text-md p-2 rounded-md bg-[#0060ef] text-white font-medium">
        Import
      </button>
    </div>
  );
}

export default UploadCSV;
