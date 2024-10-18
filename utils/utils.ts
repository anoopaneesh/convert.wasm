import ConvertAction from "@/types/ConvertAction";
import { extensions } from "./constants";
import { v4 as uuidv4 } from 'uuid';
export function formatFileSize(bytes: number) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    let i = 0;

    // Continue dividing until the value is less than 1024 or no more units remain
    while (bytes >= 1024 && i < units.length - 1) {
        bytes /= 1024;
        i++;
    }

    // Return the value rounded to two decimal places, along with the appropriate unit
    return `${bytes.toFixed(2)} ${units[i]}`;
}

export function getSupportedExtensions(mimeType: string) {
    if (mimeType.includes('image')) return extensions.image
    if (mimeType.includes('audio')) return extensions.audio
    if (mimeType.includes('video')) return extensions.video
    return []
}

export function getAcceptString() {
    const accept: string[] = []
    Object.entries(extensions).forEach(([key, value]) => {
        value.forEach(val => accept.push(`${key}/${val}`))
    })
    return accept.join(",")
}

export const getConvertActionFromFile = (...files: File[]) : ConvertAction[] => {
    return files.map(file => ({
        id: uuidv4(),
        filename: file.name.split('.')[0],
        size: file.size,
        mimeType: file.type,
        from: file.name.split('.')[1],
        to: null,
        file,
        is_converting:false,
        convert_error:null,
        output_url:null
    }))
}