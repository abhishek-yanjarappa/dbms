"use client";
import { signIn } from "next-auth/react";
import { ReactNode } from "react";

const LoginWidget = () => {
  return (
    <div className="flex gap-5 flex-wrap">
      <button onClick={() => signIn("google")}>Login with Google</button>
    </div>
  );
};

export default LoginWidget;
