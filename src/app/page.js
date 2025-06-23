'use client'
import {WebGLCanvas} from "@/components/WebGLCanvas";
import {Sidebar} from "@/components/Sidebar";
import {useRef, useState} from "react";
import {TimeSlider} from "@/components/TimeSlider";
import Link from "next/link";
import {iAddToGallery, iDownload, iGallery} from "@/components/icons";
import UploadModal from "@/components/UploadModal";


`TODO:
 - Likes
 - Pagination
 - Download settings
 - Coloring
`

export default function Viewer({initState, view}) {
  const [state, setState] = useState({
    maxIter: initState?.maxIter ?? 100,
    rad: initState?.rad ?? 2,
    t: initState?.t ?? 0,
    tLoop: 6.28,
    animSpeed: 0.025,
    paused: true,
    pixelToC: initState?.pixelToC ?? true,
    iterFunc: initState?.iterFunc ?? "pow(z, 2)",
    funcInput: initState?.funcInput ?? "pow(z, 2)",
    cFunc: initState?.cFunc ?? "0.7885*cis(t)",
    mouseC: false,
    xFlip: initState?.xFlip ?? 1,
    yFlip: initState?.yFlip ?? 1,
    grid: false,
    download: false,
    upload: 0,
    kill: false,
  });
  const stateRef = useRef(state);

  const updateState = (key, value) => {
    setState(prev => ({...prev, [key]: value}));
    stateRef.current[key] = value;
  };

  return (
      <div className="flex h-screen">
        <Sidebar state={state} updateState={updateState}/>

        <div className="flex-1 min-w-0 relative" id="content">
          <div className="absolute top-4 right-4 flex flex-col gap-4 z-10">
            <Link href="/gallery" onClick={() => updateState('kill', true)}
                  className="hover:transition-transform duration-200 hover:scale-125 drop-shadow-outline">
              {iGallery}
            </Link>

            <div className="relative">
              <button onClick={() => {
                updateState('upload', 1-state.upload);
              }}
                  className="hover:transition-transform duration-200 hover:scale-125 drop-shadow-outline">
                {iAddToGallery}
              </button>

              <UploadModal isOpen={state.upload === 1} setUpload={(value) => updateState('upload', value)} />

            </div>

            <button onClick={() => updateState('download', true)}
                    className="hover:transition-transform duration-200 hover:scale-125 drop-shadow-outline">
              {iDownload}
            </button>
          </div>

          <WebGLCanvas view={view} stateRef={stateRef} updateState={updateState}/>

          {state.pixelToC || state.cFunc.slice(-6) !== "cis(t)" ? null :
              <TimeSlider state={state} updateState={updateState}/>}
        </div>
      </div>
  );
}