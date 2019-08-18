import 'utils/styles/App.css';
import React, { FC, useEffect, useState } from 'react';
import { Header, Footer, TreeNity } from "components/index";

interface IProps {
  width: number
  height: number
  ws: WebSocket
}

const App: FC<IProps> = ({ width, height, ws }) => {
  const [signal, setSignal] = useState<signalType>(null)
  const [signalCount, setSignalCount] = useState<number>(0)
  useEffect(() => {
    ws.onmessage = (e) => {
      if(e.data !== "") {
        setSignal(e.data)
        setSignalCount(signalCount+1)
      }
    }
  }, [])

  const handleClickSignal = (signal: signalType) => {
    setSignal(signal)
    setSignalCount(signalCount+1)
  }

  return (
    <div className="App">
      <Header />
      <TreeNity 
        width={width} 
        height={height} 
        signal={signal} 
        signalCount={signalCount}
        handleClickSignal={handleClickSignal}/>
      <Footer />
    </div>
  )
}

export default App
