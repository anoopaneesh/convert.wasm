import React, { Dispatch, PropsWithChildren, SetStateAction, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { IoCloudDownloadOutline } from "react-icons/io5";
import { FaPaperclip } from "react-icons/fa6"
import ConvertAction from '@/src/types/ConvertAction';
import { useToast } from '@/src/hooks/use-toast';
import { accepted_files, extensions } from '@/src/utils/constants';
import { getConvertActionFromFile } from '@/src/utils/utils';

interface FileDropZoneProps {
    queue: ConvertAction[]
    handleAddToQueue: (...props: ConvertAction[]) => void
}


const FileDropZone: React.FC<PropsWithChildren<FileDropZoneProps>> = ({ queue, handleAddToQueue }) => {
    const { toast } = useToast()
    const onDrop = useCallback((acceptedFiles: any) => {
        acceptedFiles.forEach((file: File) => {
            handleAddToQueue(...getConvertActionFromFile(file))
        })

    }, [])
    const onDropRejected = useCallback(() => {
        toast({
            variant: "destructive",
            title: "Error uploading your file(s)",
            description: "Allowed Files: Audio, Video and Images.",
            duration: 5000,
        });
    }, [toast])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: accepted_files, onDropRejected, onError: onDropRejected })

    return (
        <div className='w-[80vw] h-[20vw] bg-gray-800 rounded-md p-2'>
            <div {...getRootProps()} className='w-full h-full border-dashed border rounded-md'>
                <div className='flex flex-col items-center justify-center gap-2 h-full'>
                    <IoCloudDownloadOutline size={30} className='text-green-300' />
                    {isDragActive ? <p>Drop files here....</p> : <>
                        <p>Drag & drop files here</p>
                        <p className='text-gray-600'>or</p>
                        <p className='px-2 py-1 rounded-sm bg-gray-600 cursor-pointer flex gap-1 items-center'><span>
                            <FaPaperclip />
                        </span><span>Choose files</span></p>
                    </>}
                </div>
                <input {...getInputProps()} />
            </div>
        </div>
    )
}

export default FileDropZone