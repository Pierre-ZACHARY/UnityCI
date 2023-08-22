import './App.css';
import React, {Fragment, useEffect} from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import JSZip from "jszip";
import { inflate } from "pako";
import {} from "js-untar";
import "./main.sass";
import {ReportView} from "./report_view/ReportView";
// this token only allow to read current repo artifacts

function App(){
    return (
        <div className="main flex screenheight">
            <ReportView/>
            <a href={"/generated/master/256d9a6853b06fded36dae385b350f5610be9f45_2023_08_21_01_05_46/report.html"}>report</a>
        </div>
    );
}


function AppOld(){

    const [token, setToken] = React.useState(localStorage.getItem("token") || "");
    const [error, setError] = React.useState("");
    const [loaded, setLoaded] = React.useState(false);
    const [initialLoad, setInitialLoad] = React.useState(false);

    const getQueryParam = (param) => {
        const searchParams = new URLSearchParams(window.location.search);
        return searchParams.get(param);
    };

    // Retrieve the 'runId' query parameter
    const runId = getQueryParam('runId');

    // Do something with the 'runId' value
    console.log('runId:', runId);
    const submitForm = async () => {
        console.log(token);
        const artifacts = await fetch(`https://api.github.com/repos/Pierre-ZACHARY/UnityCI/actions/runs/${runId}/artifacts`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if(!artifacts.ok){
            setError(`Error : ${artifacts.status} ${artifacts.statusText} ( most likely invalid token )`);
            return;
        }
        localStorage.setItem("token", token);
        setLoaded(true);
    }
    // if a token is
    if(localStorage.getItem("token") && !initialLoad){
        submitForm().then();
        setInitialLoad(true);
    }
    return (
        <>
            {loaded ? <App2 token={token}/> : <>
                    <p>{error}</p>
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        submitForm().then()
                    }}>
                        <label>
                            Token:
                            <input type="text" value={token} onChange={(e)=>setToken(e.target.value)}/>
                        </label>
                        <input type="submit" value="Submit" />
                    </form>
                    <a target={"_blank"} rel="noreferrer" href={"https://github.com/settings/personal-access-tokens/new"}>Ask for token ( you need 'Read access to actions and metadata' on current repository )</a>
                </>
            }
        </>
    )
}
function App2(token) {
    const getQueryParam = (param) => {
        const searchParams = new URLSearchParams(window.location.search);
        return searchParams.get(param);
    };

    // Retrieve the 'runId' query parameter
    const runId = getQueryParam('runId');

    // Do something with the 'runId' value
    console.log('runId:', runId);
    const [urls, setUrls] = React.useState({loaderUrl: "", dataUrl: "", wasmUrl: "", frameworkUrl: ""});
    const [error, setError] = React.useState("");
    useEffect(()=>{
        const asyncFetch = async () => {
            console.log("Fetching The build...");
            console.log(token.token)
            setError("Fetching The build...");
            const artifacts = await fetch(`https://api.github.com/repos/Pierre-ZACHARY/UnityCI/actions/runs/${runId}/artifacts`, {
                headers: {
                    Authorization: `Bearer ${token.token}`
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
                    Authorization: `Bearer ${token.token}`
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
            const tarDataGzArray = inflate(new Uint8Array(dataGzArray), { to: 'array' });
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
    }, [runId, token.token]);


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
    let loaderUrlLocal = "/WebGL.loader.js";

    if(window.location.pathname.length > 1){
        loaderUrlLocal = window.location.pathname+"/WebGL.loader.js";
    }
    const { unityProvider, loadingProgression, isLoaded } = useUnityContext({
        loaderUrl: loaderUrlLocal,
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
