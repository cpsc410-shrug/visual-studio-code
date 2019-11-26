import React, { useState, useEffect } from "react"
import ReactDOM from "react-dom"
import styled, { createGlobalStyle } from "styled-components"

import Canvas from "./components/visualizer/canvas"
import ThreeJSCanvas from "./components/threejs-visualizer/threejs-canvas"
import { SidePanel } from "./components/visualizer/sidePanel"
import {
  readrepo,
  readPackageJson,
  readYarnLock,
  getUpgradeInfo
} from "./utils/get-data"
import { dependency, devDependency } from "./utils/format-results"

const GlobalStyle = createGlobalStyle`
    html, body, #content {
        height: 100%;
        margin: 0;
    }
`
const StyledContent = styled.div`
  align-items: center;
  display: grid;
  grid-template-columns: 30% 1fr 1fr;
  grid-template-rows: 35% 1fr 1fr;
  grid-template-areas:
    "upper vis vis"
    "lower vis vis"
    "lower vis vis";
  height: 100%;
  text-align: center;
`

const IndexPage = () => {
<<<<<<< HEAD
    const [url, setUrl] = useState(null);
    const [visualizer3D, setVisualizer3D] = useState(false);

    return <StyledContent>
        <GlobalStyle />
        <SidePanel setUrl={setUrl} setVisualizer3D={setVisualizer3D} />
        {visualizer3D ? 
            <ThreeJSCanvas/> :
            <Canvas id="dependencyVisualizer" url={url} />}
    </StyledContent>;
};

let contentDiv = document.getElementById('content');
ReactDOM.render(<IndexPage />, contentDiv);
=======
  const [url, setUrl] = useState(null)
  const [show3D, setShow3D] = useState(true)

  let repoInfo
  let packageInfo
  let yarnlockInfo
  let upgradeInfo

  const getData = async url => {
    repoInfo = await readrepo(url)

    if (repoInfo) {
      packageInfo = await readPackageJson(url)
      yarnlockInfo = await readYarnLock(url)
      upgradeInfo = await getUpgradeInfo(url)
    }
    console.log(dependency, devDependency)
  }
  useEffect(() => {
    async function getDataAsync() {
      await getData(url)
    }
    if (url) getDataAsync()
  }, [url])

  console.log(url)

  return (
    <StyledContent>
      <GlobalStyle />
      <SidePanel setUrl={setUrl} />
      {show3D ? (
        <ThreeJSCanvas
          dependencies={dependency}
          devDependencies={devDependency}
          url={url}
        />
      ) : (
        <Canvas id='dependencyVisualizer' url={url} />
      )}
    </StyledContent>
  )
}

let contentDiv = document.getElementById("content")
ReactDOM.render(<IndexPage />, contentDiv)
>>>>>>> master
