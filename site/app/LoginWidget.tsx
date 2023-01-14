"use client";
import { Button } from "flowbite-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
const LoginWidget = () => {
  const session = useSession();
  const router = useRouter();

  if (session?.data?.user) {
    return (
      <div className="w-full my-5">
        <Button onClick={() => router.push("/dashboard")}>
          Go To Dasboard
        </Button>
      </div>
    );
  }
};

export default LoginWidget;
