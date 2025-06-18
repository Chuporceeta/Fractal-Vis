import {CanvasCard} from "@/components/CanvasCard";
import {fetchFractals} from "@/app/db";
import React from "react";
import GalleryUI from "@/app/gallery/GalleryUI";

export default async function Gallery({searchParams}) {
    let {query, ...filters} = await searchParams;

    query = query ?? "";

    const defaultFilters = {
        p2c: 'true',
        p2z: 'true',
        mine: 'false',
        liked: 'false',
    }
    for (const [key, value] of Object.entries(defaultFilters))
        filters[key] = filters[key] ?? value;

    const data = await fetchFractals(20, query, filters);
    return (
        <GalleryUI>
            {data.map((fractal) => (
                <CanvasCard key={fractal.key} likes={fractal.likes} state={fractal.state} view={fractal.view}/>
            ))}
        </GalleryUI>
    );
}