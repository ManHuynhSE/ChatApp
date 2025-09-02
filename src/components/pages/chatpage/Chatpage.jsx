import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, QuerySnapshot, serverTimestamp, where } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { auth, fireDB } from "../../../firebase/FirebaseConfig";
import { avatar } from "@material-tailwind/react";
import toast from "react-hot-toast";


// const users = [
//     {
//         id: 1,
//         name: "Luy Robin",
//         avatar: "/avatar1.png",
//         online: false,
//     },
//     {
//         id: 2,
//         name: "Mân",
//         avatar: "/avatar2.png",
//         online: true,
//     },
//     // Thêm user khác nếu cần
// ];
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
    const [selectedChat, setSelectedChat] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([])
    const [modalOpen, setModalOpen] = useState(false);
    const [selected, setSelected] = useState([]);
    const [user, setUsers] = useState([]);
    const [nameChat, setNameChat] = useState('');
    const [avtSelected, setAvtSelected] = useState("");
    const [text, setText] = useState('')
    const currentUser = auth.currentUser;
    const id = "single-toast";
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleUser = (id, photoUrl) => {
        let newSelected;
        if (selected.includes(id)) {
            newSelected = selected.filter((uid) => uid !== id);
        } else {
            newSelected = [...selected, id];
        }
        setSelected(newSelected);
        if (newSelected.length === 1) {
            setAvtSelected(photoUrl);
        } else {
            setAvtSelected("https://th.bing.com/th/id/R.7cc4e920df01c81a1109ee19734250e2?rik=jWJ1a62euL3hjw&pid=ImgRaw&r=0")
        }
    };

    const handleCreateChat = async () => {

        const currentUid = auth.currentUser?.uid;
        const members = currentUid
            ? Array.from(new Set([currentUid, ...selected]))
            : selected;
        if (!nameChat) {
            toast.error("Chưa nhập tên đoạn chat");
            return;
        }
        if (selected.length < 1) {
            toast.error("Chưa nhập tên đoạn chat");
            return;
        }
        try {
            const newChat = collection(fireDB, "chats");
            await addDoc(newChat, {
                members,
                message: "",
                updatedAt: serverTimestamp(),
                type: selected.length > 1 ? "group" : "direct",
                name: nameChat,
                avatar: avtSelected
            })
            setNameChat('')
            setSelected([]);
            setModalOpen(false);
        }
        catch (error) {
            console.log(error)
        }
    };

    const getAllChat = async () => {
        try {
            const q = query(
                collection(fireDB, "chats"),
                where("members", "array-contains", currentUser.uid)
            );
            const data = onSnapshot(q, async (QuerySnapshot) => {
                let chatArray = [];
                for (const docSnap of QuerySnapshot.docs) {
                    const chatData = docSnap.data();
                    const chatId = docSnap.id;
                    if (chatData.type === "direct") {
                        const friendId = chatData.members.find((id) => id !== currentUser.uid);
                        const friendRef = doc(fireDB, "users", friendId);
                        const friendSnap = await getDoc(friendRef);
                        const friendData = friendSnap.exists() ? friendSnap.data() : {};

                        chatArray.push({
                            id: chatId,
                            type: "direct",
                            name: friendData.name,
                            avatar: friendData.avatar,
                            lastMessage: chatData.message,
                            updatedAt: chatData.updatedAt,
                        });
                    } else {
                        chatArray.push({
                            id: chatId,
                            type: "group",
                            name: chatData.name,
                            avatar: chatData.avatar,
                            lastMessage: chatData.message,
                            updatedAt: chatData.updatedAt,
                        });
                    }
                }
                setChats(chatArray);
            });
            return () => data;
        }
        catch (error) {
            console.log(error)
        }
    }


    function getAllUsers() {
        try {
            const q = query(
                collection(fireDB, "users"),
                where("uid", "!=", currentUser.uid)
            );
            const data = onSnapshot(q, (QuerySnapshot) => {
                let userArray = [];
                QuerySnapshot.forEach((doc) => {
                    // console.log(doc),
                    userArray.push({ ...doc.data(), id: doc.id })
                })
                console.log(userArray)
                setUsers(userArray);
            })
            return () => data;
        }
        catch (error) {
            console.log(error)
        }
    }

    const handleSelectedChat = (chat) => {
        setSelectedChat(chat);
        console.log(chat.id)
        try {
            const q = query(
                collection(fireDB, "chats", chat.id, "messages"),
                orderBy("createdAt", "asc")
            );
            const data = onSnapshot(q, (QuerySnapshot) => {
                let messageArray = [];
                QuerySnapshot.forEach((doc) => {
                    console.log(doc.data())
                    messageArray.push({ ...doc.data(), id: doc.id })
                });
                setMessages(messageArray)
            });
            return () => data;
        } catch (error) {
            console.log(error)
        }
    }

    const sendChat = async (chat) => {
        if (!text) {
            toast.error("Nhập tin nhắn trước khi gửi", { id: id })
        }
        const chatsRef = collection(fireDB, "chats/" + chat.id + "/messages");
        try {
            await addDoc(
                chatsRef, {
                sender: currentUser.uid,
                text: text,
                createdAt: serverTimestamp()
            }
            )
            setText('')
        }
        catch (error) {
            console.log(error)
        }
    }



    useEffect(() => {
        getAllChat();
        getAllUsers();

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
                    <aside className="w-full h-screen sm:w-1/3 border-b sm:border-b-0 sm:border-r bg-gray-50 p-3 sm:p-6 flex flex-col">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-0">Chats</h2>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 font-semibold shadow"
                                onClick={() => setModalOpen(true)}
                            >
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
                                    className={`flex ${msg.sender === currentUser.uid ? "justify-end" : "justify-start"} items-start mb-2`}
                                >
                                    <div>
                                        <div
                                            className={`bg-gray-100 rounded-xl p-3 mb-1 text-gray-800 ${msg.sender === currentUser.uid ? "bg-blue-50 text-gray-900" : "bg-gray-100 text-gray-800"
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
                            <input onChange={(e) => setText(e.target.value)} className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm" placeholder="Type a message here" />
                            <button onClick={() => sendChat(selectedChat)} className="bg-blue-500 p-2 rounded-full text-white"><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12l16-6-7 7-1 4z" /></svg></button>
                        </div>
                    </main>
                )}

                {/* Modal chọn user tạo chat mới */}
                {modalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white p-8 rounded-lg w-[350px] shadow-xl">
                            <h3 className="font-bold text-lg mb-4 text-gray-800">Select users to start a new chat</h3>
                            <div className="flex flex-row items-center space-x-4 mt-4 mb-4">
                                <input
                                    onChange={(e) => setNameChat(e.target.value)}
                                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                    type="text"
                                    placeholder="Tên đoạn chat"

                                />
                            </div>
                            <div className="flex flex-col gap-3 mb-6">
                                {user.map((user) => (
                                    <label
                                        key={user.id}
                                        className="flex items-center gap-3 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selected.includes(user.id)}
                                            onChange={() => {
                                                toggleUser(user.id, user.avatar);
                                            }}
                                            className="accent-blue-600"
                                        />
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                        <span className="font-medium text-gray-700">{user.name}</span>
                                        {user.online && (
                                            <span className="text-xs text-green-600">online</span>
                                        )}
                                    </label>
                                ))}
                            </div>
                            <div className="flex gap-2 justify-end">
                                <button
                                    onClick={() => {
                                        setSelected([]);

                                        setModalOpen(false);
                                    }}
                                    className="px-4 py-2 rounded bg-gray-100 text-gray-600 font-medium hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateChat}
                                    className="px-4 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700"
                                    disabled={selected.length === 0}
                                >
                                    Create Chat
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}