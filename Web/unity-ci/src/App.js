import './App.css';
import React, {Fragment, useEffect} from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import JSZip from "jszip";
import { inflate } from "pako";
import {} from "js-untar";
function App() {
    const runId = window.location.pathname.split("/")[1];

    const [urls, setUrls] = React.useState({loaderUrl: "", dataUrl: "", wasmUrl: "", frameworkUrl: ""});
    const [error, setError] = React.useState("");
    useEffect(()=>{
        const asyncFetch = async () => {
            console.log("Fetching The build...");
            setError("Fetching The build...");
            const artifacts = await fetch(`https://api.github.com/repos/Pierre-ZACHARY/UnityCI/actions/runs/${runId}/artifacts`, {
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_ARTIFACT_READ_TOKEN}`
                }
            });
            if(!artifacts.ok){
                setError(`Error fetching build : ${artifacts.status} ${artifacts.statusText}`);
                return;
            }
            let artifactId = "";
            const artifactsJson = await artifacts.json();
            for(let i = 0; i < artifactsJson.artifacts.length; i++){
                if(artifactsJson.artifacts[i].name === "WebGLBuild"){
                    artifactId = artifactsJson.artifacts[i].id;
                    break;
                }
            }
            console.log(artifactsJson)
            if(artifactId.length === 0){
                setError("Error fetching build : No WebGLBuild artifact found");
                return;
            }
            const response = await fetch(`https://api.github.com/repos/Pierre-ZACHARY/UnityCI/actions/artifacts/${artifactId}/zip`, {
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_ARTIFACT_READ_TOKEN}`
                }
            });
            if(!response.ok){
                setError(`Error fetching build : ${response.status} ${response.statusText}`);
                return;
            }
            console.log("Extracting...");
            setError("Extracting...");
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
            console.log(loaderBlob, dataBlob, wasmBlob, frameworkBlob);

            const dataUrl = URL.createObjectURL(dataBlob);
            const wasmUrl = URL.createObjectURL(wasmBlob);
            const frameworkUrl = URL.createObjectURL(frameworkBlob);
            const loaderUrl = URL.createObjectURL(loaderBlob);

            setUrls({loaderUrl: loaderUrl, dataUrl: dataUrl, wasmUrl: wasmUrl, frameworkUrl: frameworkUrl});
        };
        asyncFetch();
    }, []);


    return (
        <>
            { urls.loaderUrl.length > 0 ? <DisplayUnity {...urls}/> :
                <div>{ error.length ? error : "Loading..."}</div>
            }
        </>
    );
}

function DisplayUnity({loaderUrl, dataUrl, frameworkUrl, wasmUrl}){
    console.log("Loading Unity...");
    const { unityProvider, loadingProgression, isLoaded } = useUnityContext({
        loaderUrl: "/WebGL.loader.js",
        dataUrl: dataUrl,
        frameworkUrl: frameworkUrl,
        codeUrl: wasmUrl,
    });

    return <Fragment>
        {!isLoaded && (
            <p>Loading Application... {Math.round(loadingProgression * 100)}%</p>
        )}
        <Unity
            unityProvider={unityProvider}
            style={{ visibility: isLoaded ? "visible" : "hidden" }}
        />
    </Fragment>;
}



export default App;
