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
  let gifs: string[] = []
  const imagePath = "./../../.."

  for (let i = 0; i < 80; i++) {
    if (i < 10) {
      gifs.push(`${imagePath}/gifs/00${i}.gif`)
    } else {
      gifs.push(`${imagePath}/gifs/0${i}.gif`)
    }
  }

  useEffect(() => {
    ws.onmessage = (e: MessageEvent) => {
      if(e.data !== "") {
        setSignal(e.data)
      }
    }
  })

  useEffect(() => {
    if (currentGif < gifs.length - 1) {
      setCurrentGif(currentGif + 1)
    } else {
      setCurrentGif(0)
    }
    document.body.style.backgroundImage = 'url("' + gifs[currentGif] + '")'
  }, [signal])

  const handleClickSignal = (signal: signalType) => {
    setSignal(signal)
  }

  return (
    <div className="App">
      <Header />
      <TreeNity
        width={width}
        height={height}
        rawSignal={signal}
        handleClickSignal={handleClickSignal}/>
      <Footer />
    </div>
  )
}

export default App
