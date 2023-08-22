import "./ReportView.sass";
import folderStructure from "../folder-structure.json";
export function ReportView(){

    return(
        <>
            {
                folderStructure.map((folder, index) => {
                    return(
                        <div key={index}>
                            <h1>{folder.name}</h1>
                        </div>
                    );
                })
            }
        </>
    )
}
