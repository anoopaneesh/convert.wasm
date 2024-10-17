"use client"
import ConvertList from "@/components/ConvertList";
import FileDropZone from "@/components/FileDropZone";
import Navbar from "@/components/Navbar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import ConvertAction from "@/types/ConvertAction";
import { getAcceptString, getConvertActionFromFile } from "@/utils/utils";
import { useState } from "react";


export default function Home() {
  const [convertQ, setConvertQ] = useState<ConvertAction[]>([])
  const handleAddToQueue = (...props: ConvertAction[]) => {
    setConvertQ(oldState => [...oldState, ...props])
  }
  const handleRemoveFromQueue = (id: string) => {
    setConvertQ(oldState => [...oldState.filter(item => item.id !== id)])
  }
  const changeConvertTo = (id: string, value: string) => {
    setConvertQ((oldState) => {
      const newState = [...oldState]
      const item = newState.find(item => item.id === id)
      if (item) item.to = value;
      return newState
    })
  }
  return (
    <div>
      <Navbar />
      <div className="flex flex-col justify-center gap-4 items-center">
        <div className="flex flex-col gap-4 mt-8 items-center w-4xl text-center justify-center">
          <h1 className="text-7xl flex flex-col justify-center gap-4">
            <span className="text-green-400">Convert your</span>
            <span>files easily</span>
          </h1>
          <p className=" max-w-4xl text-gray-300">The ultimate tool for unlimited and free multimedia conversion. Transform images, audio, and videos effortlessly, without restriction. Start converting now and elevate your content like never before!</p>
        </div>
        {convertQ.length ? <><ConvertList queue={convertQ} handleRemoveFromQueue={handleRemoveFromQueue} changeConvertTo={changeConvertTo} />
          <div className="flex flex-col items-end w-[80vw] gap-2">
            <Label htmlFor="picture" className={cn(buttonVariants({ variant: "default", size: "default", className: "" }))}>
              Add more files
            </Label>
            <Input id="picture" type="file" className="hidden" accept={getAcceptString()} onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) {
                handleAddToQueue(...getConvertActionFromFile(file))
              }
            }} />
            <Button disabled={!convertQ.length || convertQ.some(i => i.to == null)}>Convert All</Button>
          </div></> : <FileDropZone handleAddToQueue={handleAddToQueue} queue={convertQ} />}
      </div>
    </div>
  );
}
