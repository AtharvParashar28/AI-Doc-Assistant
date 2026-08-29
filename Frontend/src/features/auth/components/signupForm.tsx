import { useState } from "react";
import type { FormEvent } from "react";
import { signup } from "../../../services/authService";

export const SignupForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const signupData = { name, email, password };
    console.log("Signup submitted for:", { name, email });

    try {
      const response = await signup(signupData);
      console.log("Signup response:", response);
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor="name">
          Full name
        </label>
        <input
          autoComplete="name"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
          id="name"
          name="name"
          onChange={(event) => setName(event.target.value)}
          placeholder="Your full name"
          required
          type="text"
          value={name}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor="signup-email">
          Email address
        </label>
        <input
          autoComplete="email"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
          id="signup-email"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
          type="email"
          value={email}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700" htmlFor="signup-password">
          Password
        </label>
        <input
          autoComplete="new-password"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
          id="signup-password"
          minLength={8}
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="At least 8 characters"
          required
          type="password"
          value={password}
        />
      </div>

      <button
        className="w-full rounded-xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-200 active:scale-[0.99]"
        type="submit"
      >
        Create account
      </button>
    </form>
  );
};
