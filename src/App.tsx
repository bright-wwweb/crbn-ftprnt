import 'utils/styles/App.css';
import React, { FC, useEffect, useState } from 'react';
import { Header, Footer, TreeNity } from "components/index";

interface IProps {
  width: number
  height: number
  ws: WebSocket
}

const App: FC<IProps> = ({ width, height, ws }) => {
  const [currentGif, setCurrentGif] = useState<number>(0)
  const [signal, setSignal] = useState<signalType>(null)
  const [signalCount, setSignalCount] = useState<number>(0)
  let gifs: string[] = []

  for (let i = 0; i < 80; i++) {
    if (i < 10) {
      gifs.push("../../../../gifs/00" + i + ".gif")
    } else {
      gifs.push("../../../../gifs/0" + i + ".gif")
    }
  }

  useEffect(() => {
    ws.onmessage = (e) => {
      if(e.data !== "") {
        setSignal(e.data)
        setSignalCount(signalCount+1)
      }
    }
  }, [])

  // 3, 5, 25, 33, 38, 40, 46, 60, 62
  useEffect(() => {
    // if (signalCount % 10 === 0) {
      if (currentGif < gifs.length - 1) {
        setCurrentGif(currentGif + 1)
      } else {
        setCurrentGif(0)
      }
      document.body.style.backgroundImage = 'url("' + gifs[currentGif] + '")'
    // }
  }, [signalCount])

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
