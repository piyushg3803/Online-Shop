import { Outlet } from "react-router-dom"
import Footer from "./components/Footer"
import Navbar from "./components/Navbar"
import ContextProvider from "./Context/ContextProvider"

function App() {

  return (
    <>
      <ContextProvider>
        <Navbar />
        <Outlet />
        <Footer />
      </ContextProvider>
    </>
  )
}

export default App
