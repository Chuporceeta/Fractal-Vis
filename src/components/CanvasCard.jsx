'use client'
import {WebGLCanvas} from "@/components/WebGLCanvas";
import {useRouter} from "next/navigation";
import {encode} from "@/urlEncoder";
import {iHeartFilled, iHeartOutline} from "@/components/icons";
import {useState} from "react";

export const CanvasCard = ({key, likes, state, view}) => {
    const stateRef = {
        current: state
    }
    const [liked, setLiked] = useState(false);
    const router = useRouter();
    return (
        <div className="w-48 h-48 m-2 relative hover:transition-transform duration-200 hover:scale-110"
             onClick={async () => {
                 const enc = await encode(state, view);
                 router.push(`/${enc}`)
             }}
        >
            <WebGLCanvas view={view} stateRef={stateRef}/>
            <div className="absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-100 hover:bg-gray-600/50">
                <div className="absolute top-2 left-2 drop-shadow-outline flex items-end gap-1">
                    <button onClick={(e) => {
                        e.stopPropagation();
                        setLiked(!liked);
                    }}>
                        {liked ? iHeartFilled : iHeartOutline}
                    </button>
                    <span className="select-none text-gray-200 drop-shadow-outline">{likes}</span>
                </div>
                <span className="absolute bottom-3 w-full text-gray-200 drop-shadow-outline text-balance select-none text-center">
                    {state.funcInput}
                </span>
            </div>
        </div>
    )
}