export default function NavBar() {
    return (
        <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
            <h1 className="text-2xl font-bold">Chat App</h1>
            <div>
                <a href="/login" className="mr-4">Login</a>
                <a href="/register">Register</a>
            </div>
        </div>
    )
}