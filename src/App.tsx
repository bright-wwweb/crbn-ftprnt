import 'utils/styles/App.css';
import React, { FC, useEffect, useState } from 'react';
import { Header, Footer, TreeNity } from "components/index";

interface IProps {
  width: number
  height: number
  ws: WebSocket
}

const App: FC<IProps> = ({ width, height, ws }) => {
  // const [resp, setResp] = useState<respType>("A")

    useEffect(() => {
        ws.onmessage = (event) => {
            console.log(event.data);
            // TODO: transform into letter here
            // setResp(data)
        }
    }, [])

  return (
    <div className="App">
      <Header />
      <TreeNity width={width} height={height}/>
      <Footer />
    </div>
  )
}

export default App
