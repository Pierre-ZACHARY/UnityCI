import './App.css';
import React, {Fragment} from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
  const { unityProvider, loadingProgression, isLoaded } = useUnityContext({
    loaderUrl: "/build/WebGL/WebGL/Build/WebGL.loader.js",
    dataUrl: "/build/WebGL/WebGL/Build/WebGL.data",
    frameworkUrl: "/build/WebGL/WebGL/Build/WebGL.framework.js",
    codeUrl: "/build/WebGL/WebGL/Build/WebGL.wasm",
  });

  return (
      <Fragment>
        {!isLoaded && (
            <p>Loading Application... {Math.round(loadingProgression * 100)}%</p>
        )}
          <div className={"unity-container"}>
            <Unity
                unityProvider={unityProvider}
                style={{ visibility: isLoaded ? "visible" : "hidden" }}
            />
          </div>
      </Fragment>
  );
}

export default App;
