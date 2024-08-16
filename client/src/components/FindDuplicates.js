import React, {useEffect, useState} from "react";
import axios from "axios";
import CircleProgressbar from "./CircleProgressbar";
function FindDuplicates({contacts, fetchChanges, toggleModal}) {
 const [stausLine, setStatusLines] = useState("Total duplicates ")
  const [progress, setProgress] = useState(10);
  const [totalDuplicate, setTotalDuplicate] = useState(0)
const API_URL = 'https://contact-manager-backend-chi.vercel.app'
  async function fetchDuplicates(){
    
    // for (let i = 0; i <= 30; i++) {
    //   setProgress((prev) => (prev + 1) % 100);
    //   await new Promise((resolve) => setTimeout(resolve, 500)); // Add delay to simulate processing time
    // }
    try{
      const response = await axios.get(`${API_URL}/contacts/handle-duplicates`);
      setProgress(100)
      

      
      setTotalDuplicate(response.data.totalDuplicates)
      
      console.log("Duplicates", response.data.totalDuplicates);
    }
    catch(error){
      console.error('Error Fetching Duplicates', error);
    }
  }

  async function deleteDuplicates(){
    setProgress(10)
    setStatusLines("Deleting Duplicates...")
    document.getElementById("delete-button").style.opacity = 0.5
    document.getElementById("delete-button").disabled = true
    try{
      const response = await axios.get(`${API_URL}/contacts/handle-duplicates?delete=true`);
      console.log("Duplicate Deleted", response.data.totalDeleted);
      document.getElementById("statusLine").innerHTML = "Deleting..."
      setProgress(80)
      toggleModal()
    } catch (error){
      console.error('Error Deleting Duplicates', error)
    }
  }
  useEffect(() => {fetchDuplicates()})
  return (
    <section className="m-0 ">

    <div className="w-full h-full border-[0.5px] py-8 border-[#cacaca] flex justify-center items-center rounded-md flex-col">
    <CircleProgressbar progress={progress} size={120} strokeWidth={12} />
    <p className="mt-8" id="statusLine">{stausLine} {totalDuplicate}</p>
    </div>
    
    
    
    <button  id="delete-button" className="border border-1 text-md p-2 w-full mt-8 rounded-md bg-[#0060ef] text-white font-medium" type="submit" onClick={deleteDuplicates}>Delete Duplicates</button>
  </section>
  );
}


export default FindDuplicates;
