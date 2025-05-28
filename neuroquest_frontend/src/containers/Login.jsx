import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import BaseLayout from "./BaseLayout";

// Animistic mushrooms & arcane glows are simulated with gradients and glowy rings.
// Optionally: Lottie animation can be added at the top if desired (not included here).

// PUBLIC_INTERFACE
export default function Login() {
  const { loginWithGoogle, loginWithEmail, signupWithEmail, authError } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    displayName: "",
  });
  const [localError, setLocalError] = useState(null);

  const handleInput = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setLocalError(null);
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError(null);
    try {
      if (isSignup) {
        await signupWithEmail(inputs.email, inputs.password, inputs.displayName);
      } else {
        await loginWithEmail(inputs.email, inputs.password);
      }
    } catch (err) {
      setLocalError(err.message);
    }
    setLoading(false);
  };

  return (
    <BaseLayout>
      <div className="flex items-center justify-center min-h-screen py-8 bg-secondary/90">
        <div className="relative bg-secondary/80 max-w-md w-full px-8 py-10 rounded-3xl shadow-xl border-4 border-accent/40 animate-glow-card">
          {/* Glowing animated border ring */}
          <div className="absolute -inset-2 bg-gradient-to-br from-primary/90 via-accent/70 to-primary/80 blur-2xl rounded-3xl opacity-40 pointer-events-none animate-pulse"></div>
          <h1 className="text-3xl md:text-4xl text-accent font-extrabold text-center drop-shadow-lg tracking-widest mb-5">
            {isSignup ? "Quest Registration" : "Adventurer Login"}
          </h1>
          <form className="flex flex-col gap-5" onSubmit={handleEmailAuth}>
            {isSignup && (
              <input
                className="p-3 rounded-xl bg-secondary border-primary/50 border-2 text-lg text-white font-semibold focus:outline-none focus:ring-2 focus:ring-accent/50 transition"
                placeholder="Your Heroic Name"
                name="displayName"
                value={inputs.displayName}
                onChange={handleInput}
                autoComplete="nickname"
              />
            )}
            <input
              className="p-3 rounded-xl bg-secondary border-accent/30 border-2 text-lg text-white font-semibold focus:outline-none focus:ring-2 focus:ring-accent/50 transition"
              placeholder="Email"
              type="email"
              name="email"
              value={inputs.email}
              onChange={handleInput}
              autoComplete="email"
              required
            />
            <input
              className="p-3 rounded-xl bg-secondary border-accent/30 border-2 text-lg text-white font-semibold focus:outline-none focus:ring-2 focus:ring-accent/50 transition"
              placeholder="Password"
              type="password"
              name="password"
              value={inputs.password}
              onChange={handleInput}
              autoComplete={isSignup ? "new-password" : "current-password"}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full p-3 bg-accent text-secondary font-extrabold rounded-xl mt-1 shadow-lg hover:bg-primary/80 hover:text-white transition-all tracking-widest text-lg border-b-2 border-accent/80 animate-glow"
              style={{ filter: "drop-shadow(0 0 8px #4ade80cc)" }}
            >
              {isSignup
                ? loading
                  ? "Registering..."
                  : "Begin Your Quest!"
                : loading
                ? "Entering..."
                : "Login"}
            </button>
            <div className="flex items-center mt-2 gap-2 text-[15px] justify-center text-slate-300">
              {isSignup ? (
                <span>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="font-bold text-accent underline hover:text-primary"
                    onClick={() => setIsSignup(false)}
                  >
                    Login
                  </button>
                </span>
              ) : (
                <span>
                  New here?{" "}
                  <button
                    type="button"
                    className="font-bold text-accent underline hover:text-primary"
                    onClick={() => setIsSignup(true)}
                  >
                    Register
                  </button>
                </span>
              )}
            </div>
          </form>
          <div className="flex flex-col items-center gap-2 mt-6">
            <button
              onClick={async () => {
                setLoading(true);
                await loginWithGoogle();
                setLoading(false);
              }}
              className="p-3 w-full bg-gradient-to-r from-primary to-accent text-white font-bold rounded-2xl shadow hover:bg-fuchsia-400 transition-all tracking-widest text-lg flex items-center justify-center gap-3 animate-glow"
              type="button"
              disabled={loading}
              style={{
                boxShadow:
                  "0 0 10px 3px #4ade80cc, 0 0 44px 1px #7c3aed66, 0 0 24px 2px #27253E inset",
              }}
            >
              <span role="img" aria-label="Google">🌟</span>
              Login with Google
            </button>
            {(localError || authError) && (
              <div className="w-full rounded p-2 bg-rose-950/80 text-rose-300 mt-2 border border-rose-400 shadow animate-error-shake">
                {localError || authError?.message || "Auth error"}
              </div>
            )}
          </div>
        </div>
        <style>{`
          .animate-glow-card {
            animation: glow 3.5s infinite alternate;
          }
          @keyframes glow {
            0% { box-shadow: 0 0 16px 4px #4ade80cc, 0 0 50px 8px #7c3aed77; }
            100% { box-shadow: 0 0 26px 7px #7c3aedbb, 0 0 70px 17px #4ade80aa; }
          }
          .animate-glow {
            animation: neonGlow 1.7s infinite alternate;
          }
          @keyframes neonGlow {
            0% { filter: drop-shadow(0 0 6px #4ade80bb); }
            100% { filter: drop-shadow(0 0 14px #4ade80e7); }
          }
          .animate-error-shake {
            animation: shake 1s cubic-bezier(.36,.07,.19,.97) both;
          }
          @keyframes shake {
            10%,90%{transform:translateX(-1px);}
            20%,80%{transform:translateX(2px);}
            30%,50%,70%{transform:translateX(-4px);}
            40%,60%{transform:translateX(4px);}
          }
        `}</style>
      </div>
    </BaseLayout>
  );
}
