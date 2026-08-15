import { useEffect, useState } from "react"


function App() {
  const [message, setMessage] = useState<string>("")

  useEffect(() => {
    fetch("/api/hello")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
  }, [])

  return (
    <div className="App">
      <h1>{message}</h1>
    </div>
  )
}

export default App
