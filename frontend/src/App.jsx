import { BrowserRouter,Route,Routes } from "react-router-dom"
import Landing from "./Landing"
import Chats from "./Chats"
import './App.css'
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />}></Route>
        <Route path="/view" element={<Chats />}></Route>
      </Routes>
    </BrowserRouter>
  )
}