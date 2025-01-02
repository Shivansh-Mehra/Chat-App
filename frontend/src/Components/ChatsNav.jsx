export default function ChatsNav() {
    return (
        <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
            <h1 className="text-2xl font-bold">Chat App</h1>
            <div>
                <a href="/newChat" className="mr-4">New Chat</a>
            </div>
        </div>
    )
}