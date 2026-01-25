import React from 'react'
import {BrowserRouter as Router,Route,Routes,Navigate} from 'react-router-dom'
import LoginPage from './pages/Auth/LoginPage.jsx'
import RegisterPage from './pages/Auth/RegisterPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
const App = () => {
 const isAuthenticated = false;
 const loading = false;
    if(loading){
       return (
         <div className="flex justify-center items-center h-screen">
           <p>loading...</p>
         </div>
       );
    }
  return (
    <Router>
      <Routes>
        <Route path='/' 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
        />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage/>} />

        {/* Protected Routes */}
            
        <Route element={<ProtectedRoute />}>
          <Route path='/dashboard' element={<DashboardPage />} />
          <Route path='/documents' element={<DocumentListPage />} />
          <Route path='/documents/:id' element={<DocumentDetailPage />} />
          <Route path='/flashcards' element={<FlashcardListPage />} />
          <Route path='documents/:id/flashcards' element={<FlashcardDetailPage />} />
          <Route path='quizzes/:quizId' element={<QuizTakePage />} />
          <Route path= 'quizzes/:quizId/results' element={<QuizResultPage />} />
          <Route path='/profile' element={<ProfilePage />} />

            
        </Route>
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App

