'use client'
import {WebGLCanvas} from "@/components/WebGLCanvas";
import {useRouter} from "next/navigation";
import {encode} from "@/urlEncoder";
import {iHeartFilled, iHeartOutline} from "@/components/icons";
import {useContext, useEffect, useState} from "react";
import {setFractalLike} from "@/app/db";
import {UserContext} from "@/components/userContext";

export const CanvasCard = ({id, numLikes, userLikes, state, view}) => {
    const router = useRouter();
    const {currentUser} = useContext(UserContext);

    const stateRef = {current: state}
    const [liked, setLiked] = useState(userLikes);
    const [likes, setLikes] = useState(numLikes);

    const toggleLike = () => {
        setLikes(likes + (liked ? -1 : 1));
        setLiked(!liked);
    }

    const [debouncedLiked, setDebouncedLiked] = useState(userLikes);
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (liked !== debouncedLiked) {
                setDebouncedLiked(liked);
                setFractalLike(id, liked);
            }
        }, 300); // debounce delay in ms

        return () => clearTimeout(timeout);
    }, [liked]);

    useEffect(() => {
        setLikes(numLikes);
        setLiked(userLikes);
        setDebouncedLiked(userLikes);
    }, [userLikes, numLikes]);

    return (
        <div className="w-48 h-48 relative hover:transition-transform duration-200 hover:scale-110"
             onClick={async () => {
                 const enc = await encode(state, view);
                 router.push(`/${enc}`)
             }}
        >
            <WebGLCanvas view={view} stateRef={stateRef}/>
            <div className="absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-100 hover:bg-gray-600/50">
                <div className="absolute top-2 left-2 drop-shadow-outline flex items-end gap-1">
                    <button disabled={currentUser === null}
                        className={currentUser === null ? "opacity-60" : "hover:transition-transform duration-100 hover:scale-110"}
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleLike();
                        }}> {liked ? iHeartFilled : iHeartOutline} </button>
                    <span className="select-none text-gray-200 drop-shadow-outline">{likes}</span>
                </div>
                <span className="absolute bottom-3 w-full text-gray-200 drop-shadow-outline text-balance select-none text-center">
                    {state.funcInput}
                </span>
            </div>
        </div>
    )
}