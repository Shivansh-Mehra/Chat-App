import { BrowserRouter,Route,Routes } from "react-router-dom"
import Landing from "./Landing"
import Chats from "./Chats"
import Login from "./Login"
import Register from "./Register"
import './App.css'
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />}></Route>
        <Route path="/view" element={<Chats />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
      </Routes>
    </BrowserRouter>
  )
}