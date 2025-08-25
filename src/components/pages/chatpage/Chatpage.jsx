import { collection, onSnapshot, query, QuerySnapshot } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { fireDB } from "../../../firebase/FirebaseConfig";

// Dummy data for chats and messages
// const chats = [
//     {
//         id: 1,
//         name: "Luy Robin",
//         status: "writes",
//         time: "1 minute ago",
//         message: "Most of its text is made up from sections 1.10.32–3 of Cicero’s De finibus Bonorum et malorum...",
//         avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//         files: 2,
//         photo: true,
//         voice: false,
//     },
//     {
//         id: 2,
//         name: "Jared Sunn",
//         status: "records voice message",
//         time: "1 minute ago",
//         message: "Voice message (01:15)",
//         avatar: "https://randomuser.me/api/portraits/men/36.jpg",
//         files: 2,
//         photo: true,
//         voice: true,
//     },
//     {
//         id: 3,
//         name: "Nika Jerrado",
//         status: "last online 5 hours ago",
//         time: "3 days ago",
//         message: "Cicero famously orated against his political opponent Lucius Sergius Catilina.",
//         avatar: "https://randomuser.me/api/portraits/women/68.jpg",
//         files: 0,
//         photo: false,
//         voice: false,
//     },
//     {
//         id: 4,
//         name: "David Amorsa",
//         status: "do not disturb",
//         time: "",
//         message: "Do not disturb.",
//         avatar: "https://randomuser.me/api/portraits/men/72.jpg",
//         files: 0,
//         photo: false,
//         voice: false,
//     },
// ];

// const messagesByChat = {
//     1: [
//         {
//             id: 1,
//             sender: "Luy Robin",
//             time: "1 minute ago",
//             avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//             text: "Most of its text is made up from sections 1.10.32–3 of Cicero’s De finibus Bonorum et malorum...",
//             self: false,
//         },
//     ],
//     2: [
//         {
//             id: 1,
//             sender: "Jared Sunn",
//             time: "1 minute ago",
//             avatar: "https://randomuser.me/api/portraits/men/36.jpg",
//             text: "Voice message (01:15)",
//             self: false,
//         },
//         {
//             id: 2,
//             sender: "You",
//             time: "Now",
//             avatar: "",
//             text: "Thanks for your message!",
//             self: true,
//         },
//     ],
//     3: [
//         {
//             id: 1,
//             sender: "Nika Jerrado",
//             time: "4 days ago",
//             avatar: "https://randomuser.me/api/portraits/women/68.jpg",
//             text: "Hello! Finally found the time to write to you :) I need your help in creating interactive animations for my mobile application.",
//             self: false,
//         },
//         {
//             id: 2,
//             sender: "Nika Jerrado",
//             time: "4 days ago",
//             avatar: "https://randomuser.me/api/portraits/women/68.jpg",
//             text: "Can I send you my files?",
//             self: false,
//         },
//         {
//             id: 3,
//             sender: "You",
//             time: "4 days ago",
//             avatar: "",
//             text: "Hey! Okay, send out.",
//             self: true,
//         },
//         {
//             id: 4,
//             sender: "Nika Jerrado",
//             time: "3 days ago",
//             avatar: "https://randomuser.me/api/portraits/women/68.jpg",
//             text: "",
//             self: false,
//             file: {
//                 name: "Style.zip",
//                 size: "413.6 Mb",
//             },
//         },
//         {
//             id: 5,
//             sender: "You",
//             time: "3 days ago",
//             avatar: "",
//             text: "Hello! I tweaked everything you asked. I am sending the finished file.",
//             self: true,
//             file: {
//                 name: "NEW_Style.zip",
//                 size: "52.05 Mb",
//                 link: "#",
//             },
//         },
//         {
//             id: 1,
//             sender: "Nika Jerrado",
//             time: "4 days ago",
//             avatar: "https://randomuser.me/api/portraits/women/68.jpg",
//             text: "Hello! Finally found the time to write to you :) I need your help in creating interactive animations for my mobile application.",
//             self: false,
//         },
//         {
//             id: 2,
//             sender: "Nika Jerrado",
//             time: "4 days ago",
//             avatar: "https://randomuser.me/api/portraits/women/68.jpg",
//             text: "Can I send you my files?",
//             self: false,
//         },
//         {
//             id: 3,
//             sender: "You",
//             time: "4 days ago",
//             avatar: "",
//             text: "Hey! Okay, send out.",
//             self: true,
//         },
//         {
//             id: 4,
//             sender: "Nika Jerrado",
//             time: "3 days ago",
//             avatar: "https://randomuser.me/api/portraits/women/68.jpg",
//             text: "",
//             self: false,
//             file: {
//                 name: "Style.zip",
//                 size: "413.6 Mb",
//             },
//         },
//         {
//             id: 5,
//             sender: "You",
//             time: "3 days ago",
//             avatar: "",
//             text: "Hello! I tweaked everything you asked. I am sending the finished file.",
//             self: true,
//             file: {
//                 name: "NEW_Style.zip",
//                 size: "52.05 Mb",
//                 link: "#",
//             },
//         },
//     ],
//     4: [
//         {
//             id: 1,
//             sender: "David Amorsa",
//             time: "Just now",
//             avatar: "https://randomuser.me/api/portraits/men/72.jpg",
//             text: "Do not disturb.",
//             self: false,
//         },
//     ],
// };

export default function ChatPage() {
    const [selectedChat, setSelectedChat] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([])

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    function getAllChat() {
        try {
            const q = query(
                collection(fireDB, "chats")
            );
            const data = onSnapshot(q, (QuerySnapshot) => {
                let chatArray = [];
                QuerySnapshot.forEach((doc) => {
                    console.log(doc.data())
                    chatArray.push({ ...doc.data(), id: doc.id })
                });
                setChats(chatArray);
            });
            return () => data;
        }
        catch (error) {
            console.log(error)
        }
    }

    const handleSelectedChat = (chat) => {
        setSelectedChat(chat);
        try {
            const q = query(
                collection(fireDB, "chats", chat.id, "messages")
            );
            const data = onSnapshot(q, (QuerySnapshot) => {
                let messageArray = [];
                QuerySnapshot.forEach((doc) => {
                    // console.log(doc.data())
                    messageArray.push({ ...doc.data(), id: doc.id })
                });
                setMessages(messageArray)
            });
            return () => data;
        } catch (error) {
            console.log(error)
        }
    }



    useEffect(() => {
        getAllChat();
        // const unsub = onSnapshot(collection(fireDB, "chats"), (snapshot) => {
        //     setChats(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data })));
        // });
        // console.log(unsub)
        // return () => unsub
    }, [])

    // const messages = selectedChat ? messagesByChat[selectedChat] || [] : [];



    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            {/* Header */}

            <div className="flex-1 flex flex-col h-screen sm:max-w-full sm:mx-auto sm:w-full sm:flex-row sm:bg-white sm:rounded-xl sm:shadow-lg sm:overflow-hidden">
                {/* Chat Sidebar */}
                {(isMobile ? selectedChat === null : true) && (
                    <aside className="w-full sm:w-1/3 border-b sm:border-b-0 sm:border-r bg-gray-50 p-3 sm:p-6 flex flex-col">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-0">Chats</h2>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 font-semibold shadow">
                                + Create New Chat
                            </button>
                        </div>
                        <div className="flex mb-4 gap-3">
                            <button className="text-blue-500 underline">Recent Chats</button>
                            <button className="text-gray-500">Messages</button>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-4">
                            {chats.map((chat) => (
                                <div
                                    key={chat.id}
                                    className={`p-3 sm:p-4 rounded-lg shadow-sm border cursor-pointer flex gap-3 items-start
                    ${selectedChat === chat.id ? "bg-blue-50 border-blue-500" : "bg-white"}
                    `}
                                    onClick={() => handleSelectedChat(chat)}
                                >
                                    <img
                                        src={chat.avatar}
                                        alt={chat.name}
                                        className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-800">{chat.name}</span>
                                            <span className="text-xs text-gray-400">{chat.status}</span>
                                        </div>
                                        <div className="text-xs text-gray-500">{chat.time}</div>
                                        <div className="mt-1 text-gray-700 text-sm">{chat.message}</div>
                                        <div className="flex gap-2 mt-2 flex-wrap">
                                            {chat.voice && (
                                                <span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-800">
                                                    Voice message (01:15)
                                                </span>
                                            )}
                                            {chat.files > 0 && (
                                                <span className="bg-blue-100 px-2 py-1 rounded text-xs text-blue-700">
                                                    Files ({chat.files})
                                                </span>
                                            )}
                                            {chat.photo && (
                                                <span className="bg-pink-100 px-2 py-1 rounded text-xs text-pink-700">Photo</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>
                )}

                {/* Chat Main */}
                {(isMobile ? selectedChat !== null : true) && (
                    <main className="w-full sm:w-2/3 flex flex-col h-screen">
                        {/* Back button for mobile */}
                        {isMobile && (
                            <div className="bg-white px-4 py-2 border-b flex items-center gap-2">
                                <button
                                    className="text-blue-600 flex items-center gap-1"
                                    onClick={() => setSelectedChat(null)}
                                >
                                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 4l-8 8 8 8" />
                                    </svg>
                                    Back to all chats
                                </button>
                            </div>
                        )}
                        {/* Chat header */}
                        <div className="p-3 sm:p-6 border-b flex items-center gap-4">
                            <img
                                src={
                                    selectedChat?.avatar || "https://randomuser.me/api/portraits/lego/1.jpg"
                                }
                                alt={"chat"}
                                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover"
                            />
                            <div>
                                <div className="font-semibold text-gray-800">
                                    {selectedChat?.name || ""}
                                </div>
                                <div className="text-xs text-gray-400">
                                    {selectedChat?.status || ""}
                                </div>
                            </div>
                            <div className="flex-1"></div>
                            <button className="hidden sm:inline text-gray-400 hover:text-gray-600 p-2">
                                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 8v4l3 3" />
                                </svg>
                            </button>
                            <button className="hidden sm:inline text-gray-400 hover:text-gray-600 p-2">
                                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 16h.01" />
                                </svg>
                            </button>
                        </div>
                        {/* Messages - make sure this fills available space above the input bar */}
                        <div className="flex-1 px-4 py-2 overflow-y-auto">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.self ? "justify-end" : "justify-start"} items-start mb-2`}
                                >
                                    {!msg.self && (
                                        <img
                                            src={msg.avatar}
                                            alt={msg.sender}
                                            className="h-8 w-8 sm:h-8 sm:w-8 rounded-full object-cover mr-2 sm:mr-3"
                                        />
                                    )}
                                    <div>
                                        <div
                                            className={`bg-gray-100 rounded-xl p-3 mb-1 text-gray-800 ${msg.self ? "bg-blue-50 text-gray-900" : "bg-gray-100 text-gray-800"
                                                } max-w-xs sm:max-w-lg`}
                                        >
                                            {msg.text && <div>{msg.text}</div>}
                                            {msg.file && (
                                                <div className="mt-2">
                                                    <a
                                                        href={msg.file.link || "#"}
                                                        className={`block px-4 py-2 rounded-lg border ${msg.self
                                                            ? "bg-white border-blue-200 text-blue-700"
                                                            : "bg-blue-500 text-white"
                                                            }`}
                                                    >
                                                        <span className="font-semibold">{msg.file.name}</span>
                                                        <span className="text-xs ml-2">{msg.file.size}</span>
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-400 ml-2">{msg.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Chat Input Bar: sticky to bottom on mobile, static on desktop */}
                        <div className="bg-white px-4 py-3 flex items-center gap-2 rounded-t-xl shadow-md
              sm:static sm:rounded-none sm:shadow-none
              sticky bottom-0 left-0 w-full">
                            <button className="bg-blue-100 p-2 rounded-full text-blue-500"><svg width="20" height="20"><circle cx="10" cy="10" r="9" fill="#4f8bff" /></svg></button>
                            <button className="bg-blue-100 p-2 rounded-full text-blue-500"><svg width="20" height="20"><circle cx="10" cy="10" r="9" fill="#4f8bff" /></svg></button>
                            <input className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm" placeholder="Type a message here" />
                            <button className="bg-blue-500 p-2 rounded-full text-white"><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12l16-6-7 7-1 4z" /></svg></button>
                        </div>
                    </main>
                )}
            </div>
        </div>
    );
}