export const TimeSlider = ({ settings, updateSetting }) => {
    return (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-11/12 z-50 flex items-center gap-2">
            <button
                onClick={() => {
                    updateSetting("paused", !settings.paused);
                }}
            >
                {settings.paused ?
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-7 fill-gray-300">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z" clipRule="evenodd" />
                    </svg> :
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-7 fill-gray-300">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM9 8.25a.75.75 0 0 0-.75.75v6c0 .414.336.75.75.75h.75a.75.75 0 0 0 .75-.75V9a.75.75 0 0 0-.75-.75H9Zm5.25 0a.75.75 0 0 0-.75.75v6c0 .414.336.75.75.75H15a.75.75 0 0 0 .75-.75V9a.75.75 0 0 0-.75-.75h-.75Z" clipRule="evenodd" />
                    </svg>
                }


            </button>
            <span className="font-math italic text-gray-300">t</span>
            <input
                type="range"
                min={0}
                max={6.28}
                step={0.01}
                value={settings.t}
                onChange={(e) => updateSetting("t", parseFloat(e.target.value))}
                className="w-full appearance-none h-1 bg-gray-300 rounded-lg outline-none
                   transition-all duration-200"
            />
            <input
                type="number"
                min={0}
                step={0.01}
                value={settings.tLoop}
                onChange={(e) => updateSetting("tLoop", parseFloat(e.target.value))}
                className="w-15 text-gray-300"
            />
        </div>
    );
};