"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthProvider";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, handleSignUp, handleSignIn, handleSignOut } = useAuth();

  // TODO: Setup checks for user state to see if logged in or not
  return (
    <>
      <input
        type="email"
        name="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        placeholder="Email"
      />
      <input
        type="password"
        name="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        placeholder="Password"
      />
      <div>user logged in?: {!!user ? "Yes" : "No"}</div>
      <button onClick={() => handleSignUp(email, password)}>Sign up</button>
      <button onClick={() => handleSignIn(email, password)}>Sign in</button>
      <button onClick={() => handleSignOut(email, password)}>Sign out</button>
    </>
  );
}
