import JSZip from "jszip";

const pptxPath = new URL("../assets/presentation.pptx", import.meta.url).href;

export type SlideReplacements = {
    find: string; 
    replaceWith: string;
}

function blobToFile(blob: Blob, fileName: string): File {
    return new File([blob], fileName, {type: "application/vnd.openxmlformats-officedocument.presentationml.presentation"})
}

async function handleUpload(file: File, name: string){
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file)
    link.download = name;
    link.click();
}

function removeUnwantedFiles(zip: JSZip) {
    console.log("test it is doing this!")
    Object.keys(zip.files).forEach((filePath) => {
        if (filePath.includes(".DS_Store")){
            console.log("Removing unwanted file: ${filePath}");
            zip.remove(filePath);
        }
    })
}

export async function modifyPptx(file: File, slideNumber: number, replacements: SlideReplacements): Promise<Blob> {
    const zip = new JSZip();

    const response = await fetch(pptxPath)
    if (!response.ok) throw new Error("Failed to fetch PPTX file")


    const pptxData = await response.arrayBuffer();
   
    
    await zip.loadAsync(pptxData, { base64: false});

    removeUnwantedFiles(zip);

    const modifiedBlob = await zip.generateAsync({ type: "blob" });

    const modifiedFile = blobToFile(modifiedBlob, "Duplicated_Presentation.pptx")
    handleUpload(modifiedFile, "Duplicated_Presentation.pptx")

    return modifiedFile;
}

