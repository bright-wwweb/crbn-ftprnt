import 'utils/styles/App.css';
import React, { FC, useEffect, useState } from 'react';
import { Header, Footer, TreeNity } from "components/index";

interface IProps {
  width: number
  height: number
  ws: WebSocket
}

const App: FC<IProps> = ({ width, height, ws }) => {
  const [resp, setResp] = useState<respType>("")
  useEffect(() => {
    ws.onmessage = (e) => {
      if(e.data !== "") {
        setResp(e.data)
      }
    }
  }, [])

  return (
    <div className="App">
      <Header />
      <TreeNity width={width} height={height} resp={resp}/>
      <Footer />
    </div>
  )
}

export default App
