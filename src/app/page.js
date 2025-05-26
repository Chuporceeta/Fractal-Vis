'use client'
import {WebGLCanvas} from "@/app/components/WebGLCanvas";
import {Sidebar} from "@/app/components/sidebar";
import {useRef, useState} from "react";
import {TimeSlider} from "@/app/components/TimeSlider";

export default function Home() {
  const [settings, setSettings] = useState({
    maxIter: 500,
    t: 0,
    paused: true,
    tLoop: 6.28,
    pixelToC: true,
    animSpeed: 0.025,
    xFlip: 1,
    yFlip: 1,
    rad: 2,
    iterFunc: "z^2",
    cFunc: "1",
  });
  const settingsRef = useRef(settings);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    settingsRef.current[key] = value;
  };

  return (
      <div className="flex h-screen">
        <Sidebar settings={settings} updateSetting={updateSetting} />
        <div className="flex-1 min-w-0 relative">
          <WebGLCanvas settingsRef={settingsRef} updateSetting={updateSetting} />
          {settings.pixelToC ? null : <TimeSlider settings={settings} updateSetting={updateSetting} />}
        </div>
      </div>

  );
}
