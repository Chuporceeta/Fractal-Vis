import Login from "@/components/Login";

export default function UploadModal({ isOpen, setUpload }) {
    if (!isOpen) return null;
    return (
        <div className="absolute top-full right-0 mt-2 z-50 bg-white p-6 rounded-xl shadow-lg w-80">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Upload to Gallery</h2>
            <Login onCancel={()=>setUpload(0)} onLogin={()=>setUpload(2)} submitText="Upload" modal={true}/>
        </div>
    );
}
