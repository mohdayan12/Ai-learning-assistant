import React,{useState,useEffect} from 'react'
import {Plus,Upload,FileText,Trash2,X} from 'lucide-react'
import Spinner from '../../components/common/Spinner';
import documentService from '../../services/documentService.js';
import toast from 'react-hot-toast';

const DocumentListPage = () => {
 const [documents,setDocuments]=useState([]);
 const [loading,setLoading]=useState(true);

 const [isUploadModelOpen,setIsUploadModelOpen]=useState(false);
 const [uploadFile,setUploadFile]=useState(null);
 const [uploadTitle,setUploadTitle]=useState('');
 const [uploading,setUploading]=useState(false);

 const [isDeleteModelOpen,setIsDeleteModelOpen]=useState(false);
 const [deleting,setDeleting]=useState(false);
 const [selectedDoc,setSelectedDoc]=useState(null);

 const fetchDocuments=async()=>{
   try {
      const data=await documentService.getDocuments();
      setDocuments(data);

    
   } catch (error) {
     toast.error('Failed to fetch documents');
     console.error(error);
   } finally{
       setLoading(false);
   }
 }

 useEffect(()=>{
   fetchDocuments();
 },[])

 const handleFileChange=(e)=>{
   const file=e.target.files[0];
   if(file){
     setUploadFile(file);
     setUploadTitle(file.name.replace(/\.[^/.]+$/, ""));
   }
   };

   const handleUpload=async(e)=>{
      e.preventDefault();
      if(!uploadFile || !uploadTitle){
       toast.error('Please provide the title and select a file');
       return;
      }
      setUploading(true);
      const formData=new FormData();
      formData.append('file',uploadFile);
      formData.append('title',uploadTitle);
      try {
         await documentService.uploadDocument(formData);
         toast.success('Document uploaded successfully');
         setIsUploadModelOpen(false);
         setUploadFile(null);
         setUploadTitle('');
         fetchDocuments();
      } catch (error) {
          toast.error(error.message || 'Upload failed');
       
      }finally{
          setUploading(false);
      }
   }

   const handleDeleteRequest=(doc)=>{
      setSelectedDoc(doc);
      setIsDeleteModelOpen(true);
   }

   const handleDelete=async()=>{
      if(!selectedDoc) return ;
      setDeleting(true);
      try {
         await documentService.deleteDocument(selectedDoc._id);
         toast.success(`${selectedDoc.title} deleted successfully`);
         setIsDeleteModelOpen(false);
          setSelectedDoc(null);
          setDocuments(documents.filter((doc)=>doc._id !== selectedDoc._id));
      } catch (error) {
        toast.error(error.message || 'Delete failed');
      }finally{
       setDeleting(false);
      }
   }

   const renderContent=()=>{
     return <div>renderContent</div>
   }

  return (
    <div>
      
    </div>
  )
}

export default DocumentListPage
