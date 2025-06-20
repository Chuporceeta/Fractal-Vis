'use client'
import Link from "next/link";
import React, {Suspense} from "react";
import {CheckboxInput, Header} from "@/components/miniComponents";
import Form from "next/form";
import {useRouter, useSearchParams} from "next/navigation";

export default function GalleryUI({loggedIn, children}) {
    const searchParams = useSearchParams();
    const { replace } = useRouter();

    const toggleParam = (name) => {
        const params = new URLSearchParams(searchParams);
        params.set(name, params.get(name)==='true' ? 'false' : 'true');
        replace(`/gallery/?${params.toString()}`);
    }

    return (
        <Form className="flex h-screen bg-gray-50" action="/gallery">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-100 p-4 border-r overflow-y-auto">
                <Link href="/" className="mb-4 text-blue-600 hover:underline block">
                    ← Back to Viewer
                </Link>
                <Header>Filters</Header>
                <div>
                    <CheckboxInput value={searchParams.get('p2c')??true} onChange={() => toggleParam('p2c')} name="p2c" checked>
                        Pixels mapped to <span className="font-math italic"> c </span>
                    </CheckboxInput>
                    <CheckboxInput value={searchParams.get('p2z')??true} onChange={() => toggleParam('p2z')} name="p2z" checked>
                        Pixels mapped to <span className="font-math italic"> z </span>
                    </CheckboxInput>
                    <fieldset disabled={!loggedIn} className={loggedIn ? '' : 'opacity-60'}>
                        <CheckboxInput value={searchParams.get('mine')??false} onChange={() => toggleParam('mine')} name="mine">
                            My Uploads
                        </CheckboxInput>
                        <CheckboxInput value={searchParams.get('liked')??false} onChange={() => toggleParam('liked')} name="liked">
                            My Liked
                        </CheckboxInput>
                    </fieldset>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                {/* Search */}
                <div className="p-4 border-b bg-white flex">
                    <input
                        type="text"
                        name="query"
                        placeholder="Search by iterated function"
                        className="flex-1 border rounded px-3 py-2 mr-2"
                    />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Search
                    </button>
                </div>

                {/* Image Grid */}
                <div className="flex-1 overflow-auto p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <Suspense>
                        {children}
                    </Suspense>
                </div>
            </main>
        </Form>
    );
}