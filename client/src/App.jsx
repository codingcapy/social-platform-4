
import { Router } from "./router"
import { RouterProvider } from "react-router-dom"



function App() {

  const router = Router()

  return (
    <div >
      <RouterProvider router={router} />
    </ div>
  )
}

export default App
