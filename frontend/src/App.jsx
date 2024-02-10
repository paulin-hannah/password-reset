import { lazy, Suspense } from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Navbars from './components/Narbar'
import Spinner from './components/Spinner'
import NotFound from './components/NotFound'

const Register = lazy(() => import('./pages/Register'))
const Login = lazy(() => import('./pages/Login'))
const Private = lazy(() => import('./pages/Private'))
const Forgot = lazy(() => import('./pages/Forgot'))

function App() {
  return (
    <>
      <Suspense fallback={<Spinner />}>
        <BrowserRouter>
          <Navbars />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/private" element={<Private />} />
            <Route path="/forgot" element={<Forgot />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </Suspense>
    </>
  )
  
}

export default App
