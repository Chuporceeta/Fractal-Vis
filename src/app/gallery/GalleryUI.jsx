'use client'
import Link from "next/link";
import {Suspense, useContext} from "react";
import {CheckboxInput, Header} from "@/components/miniComponents";
import Form from "next/form";
import {useRouter, useSearchParams} from "next/navigation";
import Login from "@/components/Login";
import {UserContext} from "@/components/userContext";
import {defaultFilters} from "@/app/gallery/page";

export default function GalleryUI({children}) {
    const {currentUser} = useContext(UserContext);
    const searchParams = useSearchParams();
    const { replace } = useRouter();

    const toggleParam = (name) => {
        const params = new URLSearchParams(searchParams);
        const value = params.get(name) ?? defaultFilters[name];
        params.set(name, value === 'true' ? 'false' : 'true');
        replace(`/gallery/?${params.toString()}`);
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-100 p-4 border-r overflow-y-auto flex flex-col justify-between">
                <div>
                <Link href="/" className="mb-4 text-blue-600 hover:underline block">
                    ← Back to Viewer
                </Link>
                <Header>Filters</Header>
                    <Form action="/gallery" id="form">
                        <CheckboxInput value={searchParams.get('p2c')??'true'} onChange={() => toggleParam('p2c')} name="p2c">
                            Pixels mapped to <span className="font-math italic"> c </span>
                        </CheckboxInput>
                        <CheckboxInput value={searchParams.get('p2z')??'true'} onChange={() => toggleParam('p2z')} name="p2z">
                            Pixels mapped to <span className="font-math italic"> z </span>
                        </CheckboxInput>
                        <fieldset disabled={currentUser===null} className={currentUser===null ? 'opacity-60' : ''}>
                            <CheckboxInput value={searchParams.get('mine')??'false'} onChange={() => toggleParam('mine')} name="mine">
                                My Uploads
                            </CheckboxInput>
                            <CheckboxInput value={searchParams.get('liked')??'false'} onChange={() => toggleParam('liked')} name="liked">
                                My Liked
                            </CheckboxInput>
                        </fieldset>
                    </Form>
                </div>
                <Login onLogOut={()=> {
                    const params = new URLSearchParams(searchParams);
                    params.delete('mine');
                    params.delete('liked');
                    replace(`/gallery/?${params.toString()}`);
                }}/>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                {/* Search */}
                <div className="p-4 border-b bg-white flex">
                    <input
                        form="form"
                        type="text"
                        name="query"
                        placeholder="Search by iterated function"
                        className="flex-1 border rounded px-3 py-2 mr-2"
                    />
                    <button type="submit" form="form"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Search
                    </button>
                </div>

                {/* Image Grid */}
                <div className="p-4 overflow-scroll grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                    <Suspense>
                        {children}
                    </Suspense>
                </div>
            </main>
        </div>
    );
}