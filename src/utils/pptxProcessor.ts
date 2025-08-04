import JSZip from "jszip";

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

    URL.revokeObjectURL(link.href)
}

function removeUnwantedFiles(zip: JSZip) {
    Object.keys(zip.files).forEach((filePath) => {
        if (filePath.includes(".DS_Store")){
            console.log(`Removing unwanted file: ${filePath}`);
            zip.remove(filePath);
        }
    })
}
export class searchTerms {
    findString: string;
    replaceString: string;
    constructor(findString: string, replaceString: string){
        this.findString = findString;
        this.replaceString = replaceString;
    }
}
interface ISlideLoader {
    load(): Promise<Blob>
}
export async function manageSlide(loader:ISlideLoader) : Promise<Blob>{
    const pptxData : Blob = await loader.load();
    return pptxData;
}

class URLPptxLoader implements ISlideLoader {
    private fileURL: string;

    constructor(fileURL: string){
        this.fileURL = fileURL
    }

    async load(): Promise<Blob> {
        const zip = new JSZip();

        const response = await fetch(this.fileURL)
        if (!response.ok) throw new Error("Failed to fetch PPTX file")
        
        const pptxData = await response.arrayBuffer();

        await zip.loadAsync(pptxData, { base64: false});

        removeUnwantedFiles(zip)

        const modifiedBlob = await zip.generateAsync({ type: "blob" });

        const modifiedFile = blobToFile(modifiedBlob, "Duplicated_Presentation.pptx")
        handleUpload(modifiedFile, "Duplicated_Presentation.pptx")
    
        return modifiedFile;
    }
} 

class FilePptxLoader implements ISlideLoader {
    private fileURL: string;

    constructor(fileURL: string){
        this.fileURL = fileURL
    }

    async load(): Promise<Blob> {
        const zip = new JSZip();
        const pptxPath : string = new URL(`../assets/${this.fileURL}`, import.meta.url).href;

        const response : Response = await fetch(pptxPath)
        if (!response.ok) throw new Error("Failed to fetch PPTX file")
        
        const pptxData : ArrayBuffer = await response.arrayBuffer();

        await zip.loadAsync(pptxData, { base64: false});

        removeUnwantedFiles(zip)

        const modifiedBlob = await zip.generateAsync({ type: "blob" });

        const modifiedFile = blobToFile(modifiedBlob, "Duplicated_Presentation.pptx")
        handleUpload(modifiedFile, "Duplicated_Presentation.pptx")
    
        return modifiedFile;
    }
} 

export async function modifyPptx(file: File, slideNumber: number, replacements: SlideReplacements): Promise<Blob> {
    const zip = new JSZip();
    const pptxPath = new URL(`../assets/${file}`, import.meta.url).href;

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

