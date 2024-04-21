"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthProvider";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { session, handleSignUp, handleSignIn, handleSignOut, handleSignInDiscord } = useAuth();
  console.log(session);
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
      {session && (
        <div>
          id: {session.user.id}, email: {session.user.email}, which:{" "}
          {session.user.app_metadata.provider}
        </div>
      )}
      <div>user logged in?: {!!session ? "Yes" : "No"}</div>
      <button onClick={() => handleSignUp(email, password)}>SignUp</button>
      <button onClick={() => handleSignIn(email, password)}>SignIn</button>
      <button onClick={() => handleSignInDiscord()}>SignInDiscord</button>
      <button onClick={() => handleSignOut()}>SignOut</button>
    </>
  );
}
