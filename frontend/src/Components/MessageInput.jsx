import React, { useRef } from 'react';
import { Image,Send, X } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';

export default function MessageInput() {
    const [message, setMessage] = React.useState({ text: '', image: null, filePreview: null });
    const { sendMessage,selectedUser,sendGroupMessage,selectedGroup } = useChatStore();
    const {authUser} = useAuthStore();
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        setMessage({ ...message, text: e.target.value });
    };
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please upload a valid image file.');
                return;
            }
            const filePreview = URL.createObjectURL(file);
            setMessage({ ...message, image: file, filePreview });
        }
    };

    const handleRemoveImage = () => {
        setMessage({ ...message, image: null, filePreview: null });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (message.text.trim() === '' && !message.image) return;

        const formData = new FormData();
        formData.append('text', message.text);
        formData.append('senderId', authUser._id);
        if (message.image) {
            formData.append('image', message.image);
        }

        if (selectedUser) {
            formData.append('receiverId', selectedUser._id);
            await sendMessage(formData);
        } else if (selectedGroup) {
            formData.append('groupId', selectedGroup._id);
            console.log('Group Message Form Data:', Array.from(formData.entries())); // Debugging statement
            await sendGroupMessage(formData);
        }

        setMessage({ text: '', image: null, filePreview: null });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center justify-between gap-2 p-4 border-t border-gray-200" encType='multipart/form-data'>
            {message.filePreview && (
                <div className="relative w-full mb-2">
                    <img src={message.filePreview} alt="Preview" className="w-24 h-24 object-cover rounded" />
                    <button
                        type="button"
                        className="absolute top-0 right-0 m-2 p-1 bg-white rounded-full shadow"
                        onClick={handleRemoveImage}
                    >
                        <X className="w-4 h-4 text-red-500" />
                    </button>
                </div>
            )}
            <div className="flex items-center justify-between gap-2 w-full">
                <div className="flex items-center gap-2 w-full">
                    <input
                        type="text"
                        placeholder="Type a message"
                        className="bg-base-100 border rounded w-full p-2"
                        name="text"
                        value={message.text}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="file">
                        <Image className="w-6 h-6 cursor-pointer" />
                    </label>
                    <input
                        type="file"
                        id="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                        ref={fileInputRef}
                    />
                </div>
                <label htmlFor="sub">
                    <Send className='size-6 cursor-pointer'/>
                </label>
                <button type='submit' className='hidden' id='sub'>
                </button>
            </div>
        </form>
    );
}