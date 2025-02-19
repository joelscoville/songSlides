import { modifyPptx, SlideReplacements } from "../utils/pptxProcessor.ts";
import { useState } from "react";

export default function UploadPPTX() {
    const [file, setFile] = useState<File | null>(null);

    const loadFile = async () => {
        try {
            const response = await fetch(`../assets/presentation.pptx`);
            const blob = await response.blob(); 

            // Create a File object from the Blob
            const fileObject = new File([blob], 'presentation.pptx', { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
            setFile(fileObject); // Set the File object in state
            console.log('File object created:', fileObject);
        } catch (error) {
            console.error('Error loading file:', error);
        }
    };

    const handleModify = async () => {
        if (!file) {
            console.warn("No file loaded yet");
            return;
        }
        
        const slideRelacement : SlideReplacements = {
            find: "test",
            replaceWith: "test"
        }
        try {
            const modifiedPptx = await modifyPptx(file, 1, slideRelacement); 
            
            // Trigger download
            const link = document.createElement("a");
            link.href = URL.createObjectURL(modifiedPptx);
            link.download = "Updated_Slides.pptx";
            link.click();
        } catch (error) {
            console.error("Error modifying PPTX:", error)
        }
    };

    return (
        <div>
            <button onClick={loadFile}>Load PPTX File</button>
            {file && (
                <>
                    <p>Loaded file: {file.name}</p>
                    <button onClick={handleModify}>Modify & Download</button>
                </>
            )}
        </div>
    );
}