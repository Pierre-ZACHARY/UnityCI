import './App.css';
import React, {Fragment, useEffect} from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import JSZip from "jszip";
import { inflate } from "pako";
import {} from "js-untar";
function App() {
    console.log(window.location.pathname);

    const [urls, setUrls] = React.useState({loaderUrl: "", dataUrl: "", wasmUrl: "", frameworkUrl: ""});
    useEffect(()=>{
        const asyncFetch = async () => {
            console.log("Fetching The build...");
            const response = await fetch("https://github.com/Pierre-ZACHARY/UnityCI/suites/14483264822/artifacts/818433185", {mode: "no-cors"});
            console.log("Extracting...");
            const data = await response.arrayBuffer();
            const zip = await JSZip.loadAsync(data);
            const loaderJs = zip.file("WebGL/WebGL/Build/WebGL.loader.js");
            const dataGz = zip.file("WebGL/WebGL/Build/WebGL.data.gz");
            const wasmGz = zip.file("WebGL/WebGL/Build/WebGL.wasm.gz");
            const frameworkJsGz = zip.file("WebGL/WebGL/Build/WebGL.framework.js.gz");
            if(!(dataGz && wasmGz && loaderJs && frameworkJsGz)){
                console.error("Missing files in WebGLBuild.zip");
                return;
            }
            const dataGzArray = await dataGz.async("arraybuffer");
            const wasmGzArray = await wasmGz.async("arraybuffer");
            const frameworkJsGzArray = await frameworkJsGz.async("arraybuffer");
            const loaderJsArray = await loaderJs.async("arraybuffer");
            const tarDataGzArray = inflate(new Uint8Array(dataGzArray), { to: 'array'});
            const tarWasmGzArray = inflate(new Uint8Array(wasmGzArray), { to: 'array'});
            const tarFrameworkJsGzArray = inflate(new Uint8Array(frameworkJsGzArray), { to: 'array'});
            const loaderBlob = new Blob([loaderJsArray], {type: "application/javascript"});
            const dataBlob = new Blob([tarDataGzArray], {type: "application/data"});
            const wasmBlob = new Blob([tarWasmGzArray], {type: "application/wasm"});
            const frameworkBlob = new Blob([tarFrameworkJsGzArray], {type: "application/javascript"});
            console.log("Extraction successful!");

            const dataUrl = URL.createObjectURL(dataBlob);
            const wasmUrl = URL.createObjectURL(wasmBlob);
            const frameworkUrl = URL.createObjectURL(frameworkBlob);
            const loaderUrl = URL.createObjectURL(loaderBlob);

            setUrls({loaderUrl: loaderUrl, dataUrl: dataUrl, wasmUrl: wasmUrl, frameworkUrl: frameworkUrl});
        };
        asyncFetch();
    }, []);


    return (<>
        { urls.loaderUrl.length>0 ? <DisplayUnity {...urls} /> : <div>Loading...</div> }
    </>);
}

function DisplayUnity({loaderUrl, dataUrl, frameworkUrl, wasmUrl}){
    console.log("Loading Unity...");
    const { unityProvider } = useUnityContext({
        loaderUrl: "/WebGL.loader.js",
        dataUrl: dataUrl,
        frameworkUrl: frameworkUrl,
        codeUrl: wasmUrl,
    });

    return <Unity unityProvider={unityProvider} />;
}

export default App;
