'use client'
import {WebGLCanvas} from "@/app/components/WebGLCanvas";
import {Sidebar} from "@/app/components/Sidebar";
import {useRef, useState} from "react";
import {TimeSlider} from "@/app/components/TimeSlider";

export default function Home() {
  const [state, setState] = useState({
    maxIter: 500,
    rad: 2,
    t: 0,
    tLoop: 6.28,
    animSpeed: 0.025,
    paused: true,
    pixelToC: true,
    iterFunc: "pow(z, 2)",
    funcInput: "pow(z, 2)",
    cFunc: "0.7885·cis(t)",
    xFlip: 1,
    yFlip: 1,
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
          <WebGLCanvas stateRef={stateRef} updateState={updateState} />
          {state.pixelToC ? null : <TimeSlider state={state} updateState={updateState} />}
        </div>
      </div>

  );
}
