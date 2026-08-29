import { useState } from "react";
import type { FormEvent } from "react";
import { login } from "../../../services/authService";


export const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const result = {
            email : email,
            password : password
        }
        console.log("Login submitted for:", result);

        try {
            const response : any = await login(result);
            console.log("Login response:", response);

            if(response.data.token){
                localStorage.setItem("token",response.data.token);
            }

            console.log("Local storage",localStorage.getItem("token"));
        } catch (error) {
            console.error("Login failed:", error);
        }
        

        
    };

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700" htmlFor="email">
                    Email address
                </label>
                <input
                    autoComplete="email"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                    id="email"
                    name="email"
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    required
                    type="email"
                    value={email}
                />
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-slate-700" htmlFor="password">
                        Password
                    </label>
                    <a className="text-sm font-semibold text-cyan-700 hover:text-cyan-900" href="#">
                        Forgot password?
                    </a>
                </div>
                <input
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                    id="password"
                    minLength={8}
                    name="password"
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    required
                    type="password"
                    value={password}
                />
            </div>

            <button
                className="w-full rounded-xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-200 active:scale-[0.99]"
                type="submit"
            >
                Sign in
            </button>
        </form>
    );
};

