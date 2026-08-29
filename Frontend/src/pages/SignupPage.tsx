import { Link } from "react-router";
import { SignupForm } from "../features/auth/components/signupForm";

function SignupPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10 text-slate-950 sm:px-10 lg:px-16">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-slate-900/10 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="relative">
            <div className="mb-12 flex items-center gap-3 text-sm font-semibold tracking-wide text-cyan-300">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-400 text-lg font-black text-slate-950">A</span>
              AI Document Assistant
            </div>
            <p className="mb-5 max-w-md text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
              Build your knowledge base
            </p>
            <h1 className="max-w-lg text-5xl font-semibold leading-[1.05] tracking-tight">
              Turn your documents into answers you can trust.
            </h1>
          </div>
          <p className="relative max-w-sm text-sm leading-6 text-slate-400">
            Create your workspace, upload your documents, and ask questions grounded in your own knowledge.
          </p>
        </section>

        <section className="flex items-center px-6 py-12 sm:px-12 lg:px-16">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-10 lg:hidden">
              <p className="text-sm font-bold tracking-wide text-cyan-700">AI DOCUMENT ASSISTANT</p>
            </div>
            <div className="mb-8">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Get started</p>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Create your workspace</h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Start chatting with your documents and retrieve the context you need.
              </p>
            </div>
            <SignupForm />
            <p className="mt-8 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link className="font-semibold text-cyan-700 hover:text-cyan-900" to="/login">
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default SignupPage;
