import './App.css';
import React, {Fragment} from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function App() {
    console.log(window.location.pathname);

    const location = window.location.pathname;

  const { unityProvider, loadingProgression, isLoaded } = useUnityContext({
    loaderUrl: location+"/build/WebGL/WebGL/Build/WebGL.loader.js",
    dataUrl: location+"/build/WebGL/WebGL/Build/WebGL.data",
    frameworkUrl: location+"/build/WebGL/WebGL/Build/WebGL.framework.js",
    codeUrl: location+"/build/WebGL/WebGL/Build/WebGL.wasm",
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
