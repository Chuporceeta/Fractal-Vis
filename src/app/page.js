'use client'
import {WebGLCanvas} from "@/components/WebGLCanvas";
import {Sidebar} from "@/components/Sidebar";
import {useRef, useState} from "react";
import {TimeSlider} from "@/components/TimeSlider";
import Link from "next/link";

`TODO:
 - Whole database portion
 - Download settings (dimensions, video)
 - Fix coloring
 - Coloring settings
`

export default function Home() {
  const [state, setState] = useState({
    maxIter: 100,
    rad: 2,
    t: 0,
    tLoop: 6.28,
    animSpeed: 0.025,
    paused: true,
    pixelToC: true,
    iterFunc: "pow(z, 2)",
    funcInput: "pow(z, 2)",
    cFunc: "0.7885*cis(t)",
    mouseC: false,
    xFlip: 1,
    yFlip: 1,
    grid: false,
    download: false,
  });
  const stateRef = useRef(state);

  const updateState = (key, value) => {
    setState(prev => ({ ...prev, [key]: value }));
    stateRef.current[key] = value;
  };

  return (
      <div className="flex h-screen">
        <Sidebar state={state} updateState={updateState} />
        <div className="flex-1 min-w-0 relative">
          <div className="absolute top-4 right-4 flex flex-col gap-4 z-10">
            <Link className="hover:transition-transform duration-200 hover:scale-125" href="/gallery">
              <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.143 4H4.857A.857.857 0 0 0 4 4.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 10 9.143V4.857A.857.857 0 0 0 9.143 4Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 20 9.143V4.857A.857.857 0 0 0 19.143 4Zm-10 10H4.857a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286a.857.857 0 0 0 .857-.857v-4.286A.857.857 0 0 0 9.143 14Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286a.857.857 0 0 0 .857-.857v-4.286a.857.857 0 0 0-.857-.857Z"/>
              </svg>
            </Link>

            <button className="hover:transition-transform duration-200 hover:scale-125">
              <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 17h6m-3 3v-6M4.857 4h4.286c.473 0 .857.384.857.857v4.286a.857.857 0 0 1-.857.857H4.857A.857.857 0 0 1 4 9.143V4.857C4 4.384 4.384 4 4.857 4Zm10 0h4.286c.473 0 .857.384.857.857v4.286a.857.857 0 0 1-.857.857h-4.286A.857.857 0 0 1 14 9.143V4.857c0-.473.384-.857.857-.857Zm-10 10h4.286c.473 0 .857.384.857.857v4.286a.857.857 0 0 1-.857.857H4.857A.857.857 0 0 1 4 19.143v-4.286c0-.473.384-.857.857-.857Z"/>
              </svg>
            </button>

            <button className="hover:transition-transform duration-200 hover:scale-125"
              onClick={() => updateState('download', true)}
            >
              <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"/>
              </svg>
            </button>
          </div>
          <WebGLCanvas stateRef={stateRef} updateState={updateState} />
          {state.pixelToC || state.cFunc.slice(-6) !== "cis(t)" ? null : <TimeSlider state={state} updateState={updateState} />}
        </div>
      </div>

  );
}
