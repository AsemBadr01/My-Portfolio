import { useState } from 'react'
import LoadingScreen from './components/LoadingScreen'
import Experience from './components/Experience'

export default function App() {
  const [live, setLive] = useState(false)
  return live ? <Experience /> : <LoadingScreen onPlay={() => setLive(true)} />
}
