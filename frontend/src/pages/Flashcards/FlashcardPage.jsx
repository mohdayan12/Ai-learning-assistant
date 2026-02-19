import React,{useState,useEffect} from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft,Plus,ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import flashcardService from '../../services/flashcardService.js'
import aiService from '../../services/aiService.js'
import PageHeader from '../../components/common/PageHeader.jsx'
import Spinner from '../../components/common/Spinner.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import Button from '../../components/common/Button.jsx'
import Model from '../../components/common/Model.jsx'
import Flashcard from '../../components/flashcards/Flashcard.jsx'

const FlashcardPage = () => {
 const {id:documentId}=useParams()
 const [flashcardSets,setFlashcardSets]=useState([])
 const [flashcards,setFlashcards]=useState([])
 const [loading,setLoading]=useState(true)
 const [generating,setGenerating]=useState(false)
 const [currentCardIndex,setCurrentCardIndex]=useState(0)
 const [isDeleteModelOpen,setIsDeleteModelOpen]=useState(false);
 const [deleting,setDeleting]=useState(false);


const fetchFlashcards=async()=>{
  setLoading(true)
  try {
    const response=await flashcardService.getFlashcardsForDocument(documentId)
    setFlashcardSets(response.data[0])
    setFlashcards(response.data[0]?.cards || [])
  } catch (error) {
    toast.error('Failed to fetch flashcards')
    console.error(error)
  }finally{
   setLoading(false)
  }
}

useEffect(()=>{
 fetchFlashcards()
},[documentId])

const handleGenerateFlashcards=async()=>{
  setGenerating(true)
  try {
    await aiService.generateFlashcards(documentId)
    toast.success('Flashcard generate successfully')
    fetchFlashcards();
  } catch (error) {
    toast.error(error.message || "Failed to generate Flashcards.")

  } finally{
   setGenerating(false)
  }
}

const handleNextCard=()=>{
 handleReview(currentCardIndex)
 setCurrentCardIndex((prevIndex)=>(prevIndex+1)%flashcards.length)
}

const handlePrevCard=()=>{
 handleReview(currentCardIndex)
 setCurrentCardIndex((prevIndex)=>(prevIndex-1+flashcards.length)%flashcards.length)
}

const handleReview=async(index)=>{
   const currentCard=flashcards[currentCardIndex]
   if(!currentCard) return ;
   try {
     await flashcardService.reviewFlashcard(currentCard._id,index);
     toast.success('Flashcard reviewed.')

   } catch (error) {
    toast.error("Failed to review flashcard.")
   }
}

const handleToggleStar=async(cardId)=>{
   try {
    await flashcardService.toggleStar(cardId)
    setFlashcards((prevFlashcards)=>prevFlashcards.map((card)=>card._id===cardId ?{...card, isStarred:!card.isStarred}:card))
    toast.success('Flashcard starred status updated!')
   } catch (error) {
    toast.error("Failed to update star status.")
   }
}

const handleDeleteFlashcardSet=async()=>{
 setDeleting(true)
 try {
  await flashcardService.deleteFlashcardSet(flashcardSets._id)
  toast.success("FlashcardSet deleted successfully")
  setIsDeleteModelOpen(false)
  fetchFlashcards();
 } catch (error) {
  toast.error(error.message|| "Failed to delete flashcard set.")
 }finally{
  setDeleting(false)
 }
}

const renderFlashcardContent=()=>{
  if(loading){
   return <Spinner />
  }

  if(flashcards.length===0){
    return (
    <EmptyState
     title='No Flashcard Yet.'
     description='Generate flashcards from your document to start learning.'
     />
    )
  }

  const currentCard=flashcards[currentCardIndex]

  return (
   <div className='flex flex-col items-center space-y-6'>
     <div className='w-full max-w-md'>
       <Flashcard flashcard={currentCard} onToggleStar={handleToggleStar} />
     </div>
     <div className='flex items-center gap-4'>
      <Button
      onClick={handlePrevCard}
      varient='secondary'
      disabled={flashcards.length<=1}
      >
      <ChevronLeft size={16} />
      Previous
      </Button>
      <span className='text-sm text-neutral-600'>
      {currentCardIndex + 1} /{flashcards.length}
      </span>
      <Button
      onClick={handleNextCard}
      varient='secondary'
      disabled={flashcards.length<=1}
      >
       Next<ChevronRight size={16} />
      
      </Button>
     </div>
   </div>
  )
}
  return (
    <div>
      <div className='mb-4'>
       <Link
       to={`/documents/${documentId}`}
       className='inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors'
       >
       <ArrowLeft size={16} />
       Back to Document 
       </Link>
      </div>
      <PageHeader title='Flashcards'>
      <div className='flex gap-2'>
       {!loading && (
       flashcards.length >0 ?(
        <>
         <Button
         onClick={()=>setIsDeleteModelOpen(true)}
         disabled={deleting}
         >
         <Trash2 size={16} /> Delete Set
         </Button>
        </>
       ):(
        <Button
        onClick={handleGenerateFlashcards}
        disabled={deleting}
        >
        {generating ?(
         <Spinner />
        ):(
         <>
         <Plus size={16} /> Generate Flashcards
         </>
        )}
        </Button>
       )
       )}
      </div>
      </PageHeader>
      {renderFlashcardContent()}

      <Model
       isOpen={isDeleteModelOpen}
       onClose={()=>setIsDeleteModelOpen(false)}
       title='Confirm Delete Flashcard Set.' 
      >
      <div className='space-y-4'>
       <p className='text-sm text-neutral-600'> 
        Are you sure you want to delete all the flashcards for this document? This action can not be undone.
       </p>
       <div className='flex justify-end gap-2 pt-2'>
        <Button
         type='button'
         varient='secondary'
         onClick={()=>setIsDeleteModelOpen(false)}
         disabled={deleting}
        >
        Cancel
        </Button>
        <Button
        onClick={handleDeleteFlashcardSet}
        disabled={deleting}
        className='bg-red-500 hover:bg-red-600 active:bg-red-700 focus:ring-red-500  '
        >
        {deleting ? "Deleting...":'Delete'}
        </Button>
       </div>
      </div>
      </Model>
    </div>
  )
}

export default FlashcardPage
