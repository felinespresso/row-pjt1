import { useState, useEffect, useRef } from "react";
import { FaTimes, FaRegUser } from "react-icons/fa";
import { addAdmins } from "@/lib/users/admin";
import Image from "next/image";
import { FaCheck } from "react-icons/fa";

export default function AddAdminsModal({ onClose, buttonRef }:any) {
    const [selectedAdmins, setSelectedAdmins] = useState<string[]>([]);
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const modalRef = useRef<HTMLDivElement | null>(null);

    // Fetch users saat modal dibuka
    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await fetch("/api/user");
                if (!response.ok) throw new Error("Failed to fetch");
                
                const data = await response.json();
                setUsers(data || []);
            } catch (error) {
                console.error("Failed to fetch users:", error);
                setUsers([]);
            }
        }
        fetchUsers();
    }, []);

    useEffect(() => {
        function handleClickOutside(event:any) {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                onClose();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    const toggleAdmin = (userId: string) => {
        setSelectedAdmins((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    const handleSubmit = async () => {
        const res = await addAdmins(selectedAdmins);
        if (res.success) {
            alert("Admins added successfully!");
            onClose();
        } else {
            alert("Failed to add admins!");
        }
    };

    const filteredUsers = (users || [])
    .filter((user:any) => user.role === "user")
    .filter((user:any) => user.username.toLowerCase().includes(search.toLowerCase()));

    return (
            <div ref={modalRef} className="absolute right-0 z-50 p-6 mt-5 bg-white rounded-lg shadow-boxShadow w-[440px] ring-1 ring-gray-600">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Add Admins</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FaTimes size={24} />
                    </button>
                </div>
                <div className="flex items-center px-2 py-[2px] bg-gray-300 rounded-lg w-full mt-4">
                    <FaRegUser className="m-2 text-base text-gray-500"/>
                    <input type="text" placeholder="Search by Username" value={search} onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 w-0 min-w-0 mx-1 text-base placeholder-gray-500 bg-gray-300 outline-none"/>
                </div>
                <div className="mt-3 overflow-y-auto max-h-36">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user:any) => (
                            <div key={user.id} className="flex items-center p-2 border-b">
                                <label className="relative cursor-pointer">
                                    <input type="checkbox"
                                        checked={selectedAdmins.includes(user.id)}
                                        onChange={() => toggleAdmin(user.id)}
                                        className="hidden peer"
                                    />
                                    <div className="flex items-center justify-center w-5 h-5 transition-all border-2 border-gray-300 rounded-md peer-checked:bg-blue-500 peer-checked:border-blue-500">
                                        {selectedAdmins.includes(user.id) && (
                                            <FaCheck className="w-3 h-3 text-white"/>
                                        )}
                                    </div>
                                </label>
                                <Image src={user.image || "/avatar.jpg"} alt={user.username} width={40} height={40} className="w-10 h-10 ml-2 rounded-full" />
                                <div className="flex-col">
                                    <p className="ml-3 text-base font-bold">{user.username}</p>
                                    <p className="ml-3 text-sm text-gray-600">({user.email})</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="mt-4 text-center text-gray-500">No users found</p>
                    )}
                </div>
                <button
                    className="w-full py-2 mt-4 text-white bg-blue-600 rounded"
                    onClick={handleSubmit}
                    disabled={selectedAdmins.length === 0}
                >
                    Add Admins
                </button>
            </div>
    );
}