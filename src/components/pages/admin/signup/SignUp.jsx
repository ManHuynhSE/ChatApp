import React, { useContext, useState } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Input,
    Button,
    Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import myContext from "../../../../context/myContext";
import { useNavigate } from "react-router-dom"; // đúng package
import toast from "react-hot-toast";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, fireDB } from "../../../../firebase/FirebaseConfig.jsx";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

export default function SignUp() {
    const context = useContext(myContext);
    const mode = context?.mode ?? "dark";

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('')
    const [avatar, setAvatar] = useState();

    // Dummy login function, replace with your logic
    const handleCreateUser = async () => {
        const id = "single-toast";
        toast.loading("Loading", { id: id })

        if (!email || !password || !name) {
            toast.error("Nhập đầy đủ thông tin!!", { id: id })
            return;
        }
        try {
            const formData = new FormData();
            formData.append("file", avatar);
            formData.append("upload_preset", "manddok");
            formData.append("cloud_name", "dmghtw364");

            // Upload ảnh
            const uploadPromise = fetch(
                `https://api.cloudinary.com/v1_1/dmghtw364/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            ).then(res => res.json());

            // Tạo user (không phụ thuộc ảnh)
            const userPromise = createUserWithEmailAndPassword(auth, email, password);

            // Đợi cả hai xong
            const [data, userCredential] = await Promise.all([uploadPromise, userPromise]);

            const url = data.secure_url;

            // Update profile
            await updateProfile(userCredential.user, {
                displayName: name,
                photoURL: url,
            });

            // Lưu vào Firestore (không cần đợi updateProfile xong nếu không quan trọng)
            setDoc(doc(fireDB, "users", userCredential.user.uid), {
                uid: userCredential.user.uid,
                email: userCredential.user.email,
                name: name,
                avatar: url,
                status: "offline",
                createdAt: serverTimestamp(),
            });

            toast.success("Tạo tài khoản thành công", { id: id });
            navigate("/");


            // localStorage.setItem('admin', JSON.stringify(result));
            navigate('/');
        } catch (error) {
            toast.error("Lỗi!!", { id: id })
            console.log(error)
        }
    };


    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
            <div className="max-w-screen-2xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
                {/* <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
                    <div
                        className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
                        style={{
                            backgroundImage:
                                "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')"
                        }}
                    />
                </div> */}
                <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
                    <div>
                        <img
                            src="https://storage.googleapis.com/devitary-image-host.appspot.com/15846435184459982716-LogoMakr_7POjrN.png"
                            className="w-32 mx-auto"
                            alt="Logo"
                        />
                    </div>
                    <div className="mt-12 flex flex-col items-center">
                        <h1 className="text-2xl xl:text-3xl font-extrabold">Create new account</h1>
                        <p className="text-xl">Fast and easy</p>
                        <div className="w-full my-6 border-b text-center">
                        </div>
                        <div className="w-full flex-1 mt-3">
                            <div className="flex flex-row items-center space-x-4">
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                    type="text"
                                    placeholder="Họ tên"
                                />
                                {/* <input

                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                    type="text"
                                    placeholder="Tên"
                                /> */}
                            </div>
                            <p className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">Email</p>
                            <div className="flex flex-row items-center space-x-4 mt-4">
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                    type="email"
                                    placeholder="Email"
                                />
                            </div>
                            <p className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">Ảnh đại diện</p>
                            <div className="flex flex-row items-center space-x-4 mt-4">
                                <input
                                    onChange={(e) => setAvatar(e.target.files[0])}
                                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                    type="file"
                                />
                            </div>
                            <p className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">Mật khẩu mới</p>
                            <div className="flex flex-row items-center space-x-4 mt-4">
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                    type="password"
                                    placeholder="Mật khẩu"
                                />
                            </div>


                            <div className="my-12 border-b text-center">

                            </div>

                            <div className="mx-auto max-w-xs">
                                {/* <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                    type="email"
                                    placeholder="Email"
                                />
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                                    type="password"
                                    placeholder="Password"
                                /> */}
                                <button
                                    type="button"
                                    onClick={handleCreateUser}
                                    className="mt-5 tracking-wide font-semibold bg-green-400 text-gray-100 w-full py-4 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                                >
                                    <svg
                                        className="w-6 h-6 -ml-2"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                        <circle cx="8.5" cy="7" r="4" />
                                        <path d="M20 8v6M23 11h-6" />
                                    </svg>
                                    <span className="ml-3">Tạo tài khoản</span>
                                </button>
                                <div className="mt-5 flex justify-center">
                                    <Link style={{ color: "rgb(67, 56, 202)" }} className="" to={'/'}>Đã có tài khoản đăng nhập tại đây</Link>
                                </div>

                                <p className="mt-6 text-xs text-gray-600 text-center">
                                    I agree to abide by templatana's
                                    <a href="#" className="border-b border-gray-500 border-dotted">
                                        Terms of Service
                                    </a>
                                    and its
                                    <a href="#" className="border-b border-gray-500 border-dotted">
                                        Privacy Policy
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div >
    );
}
