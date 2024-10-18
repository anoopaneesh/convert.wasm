import ConvertAction from '@/types/ConvertAction'
import React, { PropsWithChildren, useState } from 'react'
import { FaImage } from "react-icons/fa6";
import { MdAudiotrack } from "react-icons/md";
import { FaVideo } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { formatFileSize, getSupportedExtensions } from '@/utils/utils';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';
import { extensions } from '@/utils/constants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ConvertingStatus } from '@/types/common';

interface ConvertListProps {
  queue: ConvertAction[],
  handleRemoveFromQueue: (id: string) => void
  changeConvertTo: (id: string, value: string) => void
  converting: ConvertingStatus
}
const ConvertList: React.FC<PropsWithChildren<ConvertListProps>> = ({ queue, handleRemoveFromQueue, changeConvertTo, converting }) => {
  return (
    <div className='w-[80vw] bg-gray-800 rounded-md p-2 flex flex-col gap-2'>
      {queue.map((action, idx) => <ConvertListItem action={action} handleRemoveFromQueue={handleRemoveFromQueue} changeConvertTo={changeConvertTo} converting={converting} />)}
    </div>
  )
}


interface ConvertListItemProps {
  action: ConvertAction,
  changeConvertTo: (id: string, value: string) => void
  handleRemoveFromQueue: (id: string) => void
  converting: ConvertingStatus
}
const ConvertListItem: React.FC<ConvertListItemProps> = ({ action, changeConvertTo, handleRemoveFromQueue, converting }) => {
  const [selectedValue, setSelectedValue] = useState("")
  const [defaultTab, setDefaultTab] = useState('video')
  return <div className='w-full h-20 bg-gray-900 rounded-md flex items-center justify-between px-4' >
    <div className='flex items-center gap-2'>
      {getFileIcon(action.mimeType)}
      <p>{`${action.filename}.${action.from}`}</p>
      <p className='text-gray-400 text-sm'>{`(${formatFileSize(action.size)})`}</p>
    </div>
    <div className='flex gap-32 items-center'>
      <div className='flex items-center gap-2'>
        {!action.output_url && !action.is_converting && converting === 'Inital' ? <>
          <p> Convert to </p>
          <Select value={selectedValue} onValueChange={(value) => {
            if (extensions.audio.includes(value)) {
              setDefaultTab('audio')
            } else if (extensions.video.includes(value)) {
              setDefaultTab('video')
            }
            setSelectedValue(value)
            changeConvertTo(action.id, value)
          }}>
            <SelectTrigger className="w-[96px] bg-gray-800 outline-none focus:outline-none focus:ring-0">
              <SelectValue placeholder="..." />
            </SelectTrigger>
            <SelectContent className='h-fit bg-gray-800 text-white'>
              {action.mimeType.includes('video') ? <Tabs defaultValue={defaultTab}>
                <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                  <TabsTrigger value="video">Video</TabsTrigger>
                  <TabsTrigger value="audio">Audio</TabsTrigger>
                </TabsList>
                <TabsContent value="video">
                  <div className='grid grid-cols-3 gap-2'>
                    {getSupportedExtensions(action.mimeType).map(extension => <SelectItem key={extension} value={extension}>{extension}</SelectItem>)}
                  </div>
                </TabsContent>
                <TabsContent value="audio">
                  <div className='grid grid-cols-1 gap-2'>
                    {getSupportedExtensions('audio').map(extension => <SelectItem key={extension} value={extension}>{extension}</SelectItem>)}
                  </div>
                </TabsContent>
              </Tabs> : <div className='grid grid-cols-2 gap-2'>
                {getSupportedExtensions(action.mimeType).map(extension => <SelectItem key={extension} value={extension}>{extension}</SelectItem>)}
              </div>}
            </SelectContent>
          </Select>
        </> : <></>}
        {action.is_converting ? <p>Converting..</p> : (action.output_url ? <p>Completed</p> : (converting === 'Converting' ? <p>Waiting</p> : <></>))}
      </div>
      {converting === 'Inital' ?
        <IoMdClose size={20} className='cursor-pointer' onClick={() => handleRemoveFromQueue(action.id)} /> : <></>}
    </div>

  </div>
}



const getFileIcon = (mimeType: string) => {
  if (mimeType.includes('image')) return <FaImage className='text-green-500' />
  else if (mimeType.includes('audio')) return <MdAudiotrack className='text-green-500' />
  else if (mimeType.includes('video')) return <FaVideo className='text-green-500' />
  else return <></>
}

export default ConvertList