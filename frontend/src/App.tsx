import {BrowserRouter, Routes, Route} from 'react-router'
import SignInPage from './pages/SignInPage'
import SignOutPage from './pages/SignOutPage'
import ChatAppPage from './pages/ChatAppPage'
import {Toaster} from 'sonner'
function App() {
  return( 
    <>
      <Toaster richColors />
     <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signout" element={<SignOutPage />} />
        <Route path="/" element={<ChatAppPage />} />
      </Routes>
      </BrowserRouter>
      
    </>)

}

export default App
