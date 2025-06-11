import {CanvasCard} from "@/components/CanvasCard";
import {fetchFractals} from "@/app/db";
import React from "react";
import GalleryUI from "@/app/gallery/GalleryUI";

export default async function Gallery({searchParams}) {
    const {query, ...filters} = await searchParams;
    const data = await fetchFractals(20, query ?? '', filters);
    return (
        <GalleryUI>
            {data.map((fractal) => (
                <CanvasCard key={fractal.key} state={fractal.state} view={fractal.view}/>
            ))}
        </GalleryUI>
    );
}