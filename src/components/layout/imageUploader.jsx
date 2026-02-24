
/*
import React, { useState } from 'react';
import api from "../../lib/apiClient";

export default function ImageUploader({ onUpload }) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);

    const handleFile = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Show preview immediately
        setPreview(URL.createObjectURL(file));
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('image', file);

            // Need raw fetch here - apiClient uses JSON, but upload needs multipart
            const token = localStorage.getItem('nikeAuthToken');
            const res = await fetch('http://localhost:5000/api/upload/image', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            const data = await res.json();
            if (data.success) {
                onUpload(data.data.url); // pass URL up to parent
            } else {
                alert('Upload failed: ' + data.message);
            }
        } catch (err) {
            console.error('Upload error:', err);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-700">
                Product Image
            </label>
            <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 text-center hover:border-black transition-colors cursor-pointer"
                onClick={() => document.getElementById('imageInput').click()}>
                {preview ? (
                    <img src={preview} alt="Preview"
                        className="mx-auto h-40 object-contain rounded-lg" />
                ) : (
                    <div className="space-y-2">
                        <p className="text-4xl">📁</p>
                        <p className="text-sm text-neutral-500">Click to upload image</p>
                        <p className="text-xs text-neutral-400">JPG, PNG, WEBP up to 10MB</p>
                    </div>
                )}
                {uploading && (
                    <p className="mt-2 text-sm text-blue-500 animate-pulse">Uploading...</p>
                )}
            </div>
            <input id="imageInput" type="file"
                accept="image/jpg,image/jpeg,image/png,image/webp"
                className="hidden" onChange={handleFile} />
        </div>
    );
}
    */