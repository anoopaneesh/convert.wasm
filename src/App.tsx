import ConvertList from "@/src/components/ConvertList";
import FileDropZone from "@/src/components/FileDropZone";
import Navbar from "@/src/components/Navbar";
import { Button, buttonVariants } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { cn } from "@/src/lib/utils";
import ConvertAction from "@/src/types/ConvertAction";
import { getAcceptString, getConvertActionFromFile } from "@/src/utils/utils";
import { useEffect, useRef, useState } from "react";
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import { ConvertingStatus } from "@/src/types/common";
import { Toaster } from "./components/ui/toaster";


export default function App() {
  const ffmpegRef = useRef(new FFmpeg())
  const messageRef = useRef("")
  const [converting, setConverting] = useState<ConvertingStatus>("Inital")
  const [isLoading, setIsLoading] = useState(false)
  const [convertQ, setConvertQ] = useState<ConvertAction[]>([])
  const load = async () => {
    setIsLoading(true)
    const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm";
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on("log", ({ message }) => {
      if (messageRef.current) messageRef.current.innerHTML = message;
    });
    // toBlobURL is used to bypass CORS issue, urls with the same
    // domain can be used directly.
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
      workerURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.worker.js`,
        "text/javascript"
      ),
    });
    setIsLoading(false);
  };
  const transcode = async () => {
    setConverting("Converting")
    const ffmpeg = ffmpegRef.current
    const tmp_actions = [...convertQ]
    for (const action of tmp_actions) {
      try {
        action.is_converting = true
        setConvertQ([...tmp_actions])
        const input = action.file.name
        const output = `${action.filename}.${action.to}`
        await ffmpeg.writeFile(input, await fetchFile(action.file))
        await ffmpeg.exec(action.to === '3gp' ? [
          '-i',
          input,
          '-r',
          '20',
          '-s',
          '352x288',
          '-vb',
          '400k',
          '-acodec',
          'aac',
          '-strict',
          'experimental',
          '-ac',
          '1',
          '-ar',
          '8000',
          '-ab',
          '24k',
          output,
        ] : ['-i', input, output])
        const fileData = (await ffmpeg.readFile(output)) as any;
        const data = new Uint8Array(fileData as ArrayBuffer);
        const url = URL.createObjectURL(
          new Blob([data.buffer], { type: 'video/mp4' })
        )
        action.output_url = url
        action.is_converting = false
      } catch (error: any) {
        action.is_converting = false
        action.convert_error = error?.message || "Convert Error"
      } finally {
        setConvertQ([...tmp_actions])
      }

    }
    setConverting("Completed")
  }
  const downloadAll = () => {
    for (const action of convertQ) {
      download(action)
    }
  }
  const download = (action: ConvertAction) => {
    if (action.output_url) {
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = action.output_url;
      a.download = `${action.filename}.${action.to}`;

      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(action.output_url);
      document.body.removeChild(a);
    }
  }
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
  const resetQueue = () => {
    setConvertQ([])
    setConverting("Inital")
  }
  useEffect(() => {
    load()
  }, [])
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
        {convertQ.length ? <><ConvertList
          converting={converting}
          queue={convertQ}
          handleRemoveFromQueue={handleRemoveFromQueue}
          changeConvertTo={changeConvertTo} />
          <div className="flex flex-col items-end w-[80vw] gap-2">
            {converting === "Inital" ? <> <Label htmlFor="picture" className={cn(buttonVariants({ variant: "default", size: "default", className: "" }))}>
              Add more files
            </Label>
              <Input id="picture" type="file" className="hidden" accept={getAcceptString()} onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) {
                  handleAddToQueue(...getConvertActionFromFile(file))
                }
              }} /></> : <></>}
            {converting === 'Completed' ? <>
              <Button onClick={() => downloadAll()}>Download All</Button>
              <Button onClick={() => resetQueue()}>Convert Other files</Button>
            </>
              : <></>}
            <Button disabled={!convertQ.length || convertQ.some(i => i.to == null)} onClick={() => transcode()}>
              {converting === 'Inital' ? 'Convert All' : 'Convert Again'}
            </Button>
          </div></> : <FileDropZone handleAddToQueue={handleAddToQueue} queue={convertQ} />}
      </div>
      <Toaster />
    </div>
  );
}
