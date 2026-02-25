import { useState } from 'react';
import { Upload, X, Link as LinkIcon } from 'lucide-react';

export default function ImageUploader({ value, onChange, label = "Product Image", multiple = false }) {
    const [imageUrls, setImageUrls] = useState(
        multiple
            ? (Array.isArray(value) ? value : [])
            : (value ? [value] : [])
    );
    const [urlInput, setUrlInput] = useState('');
    const [showUrlInput, setShowUrlInput] = useState(false);

    const handleAddUrl = () => {
        if (!urlInput.trim()) return;

        const newUrls = multiple
            ? [...imageUrls, urlInput.trim()]
            : [urlInput.trim()];

        setImageUrls(newUrls);
        onChange(multiple ? newUrls : newUrls[0]);
        setUrlInput('');
        setShowUrlInput(false);
    };

    const handleRemove = (index) => {
        const newUrls = imageUrls.filter((_, i) => i !== index);
        setImageUrls(newUrls);
        onChange(multiple ? newUrls : (newUrls[0] || ''));
    };

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
                {label} {multiple && '(Multiple)'}
            </label>

            {/* Image Preview Grid */}
            {imageUrls.length > 0 && (
                <div className={`grid gap-4 ${multiple ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
                    {imageUrls.map((url, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={url}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-48 object-cover rounded-lg border border-gray-300"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/400x400/E5E5E5/666666?text=Invalid+URL';
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => handleRemove(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={16} />
                            </button>
                            <div className="mt-2 text-xs text-gray-500 truncate">
                                {url}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Image Button */}
            {(!imageUrls.length || multiple) && (
                <div>
                    {!showUrlInput ? (
                        <button
                            type="button"
                            onClick={() => setShowUrlInput(true)}
                            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-black transition-colors flex flex-col items-center justify-center gap-2"
                        >
                            <LinkIcon className="text-gray-400" size={32} />
                            <span className="text-sm text-gray-600">
                                Click to add image URL
                            </span>
                            <span className="text-xs text-gray-400">
                                Paste a link to an image from Nike.com, Unsplash, or any CDN
                            </span>
                        </button>
                    ) : (
                        <div className="border-2 border-dashed border-black rounded-lg p-6 space-y-4">
                            <div className="flex items-center gap-2">
                                <LinkIcon className="text-gray-400" size={20} />
                                <span className="text-sm font-medium">Add Image URL</span>
                            </div>

                            <input
                                type="url"
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                                placeholder="https://static.nike.com/a/images/..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddUrl();
                                    }
                                }}
                            />

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleAddUrl}
                                    className="flex-1 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                                >
                                    Add Image
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowUrlInput(false);
                                        setUrlInput('');
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                            </div>

                            <div className="text-xs text-gray-500 space-y-1">
                                <p className="font-medium">💡 Where to find image URLs:</p>
                                <ul className="list-disc list-inside space-y-1 ml-2">
                                    <li>Nike.com: Right-click product image → "Copy image address"</li>
                                    <li>Unsplash: Use direct image links</li>
                                    <li>Any CDN: Paste the full image URL</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                <p className="font-medium mb-1">ℹ️ About Image Upload</p>
                <p className="text-xs">
                    Currently, we use image URLs (no file upload yet). This is perfect for:
                </p>
                <ul className="list-disc list-inside text-xs mt-2 space-y-1">
                    <li>Using official Nike product images</li>
                    <li>Fast loading from CDNs</li>
                    <li>No storage costs</li>
                </ul>
                <p className="text-xs mt-2 text-blue-600">
                    📸 File upload with Cloudinary coming soon!
                </p>
            </div>
        </div>
    );
}