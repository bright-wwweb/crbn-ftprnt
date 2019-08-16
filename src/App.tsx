import './utils/styles/App.css';
import React, { FC } from 'react';
import { Header, Footer, TreeNity } from "components/index";

interface IProps {
  width: number
  height: number
  resp: respType
}

type respType =
| "A"
| "B"
| "C"

const App: FC<IProps> = ({ width, height, resp }) => {
  return (
    <div className="App">
      <Header />
      <TreeNity width={width} height={height} resp={resp}/>
      <Footer />
    </div>
  )
}

export default App
