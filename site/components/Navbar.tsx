"use client";

import {
  Appbar,
  Button,
  IconButton,
  Avatar,
  LoadingPulser,
} from "@uvcemarvel/web-ui";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { HiOutlineBars2 as MenuIcon } from "react-icons/hi2";

const Navbar = () => {
  const { data: session, status } = useSession();

  return (
    <Appbar className={"bottom-0"}>
      <div
        className={`w-full max-w-screen-lg flex justify-between items-center relative `}
      >
        <div className="flex items-center">
          <IconButton variant={"text"} className="mr-2">
            <MenuIcon aria-hidden className="h-6 w-6 text-p-10" />
          </IconButton>
          <Link href={"/"}>
            <span className="text-p-8 font-semibold text-center cursor-pointer">
              MARVEL.
            </span>
          </Link>
        </div>
        {session?.user ? (
          <div className="flex items-center">
            <Link href={`/u/${session?.user?.slug}`} className="mr-3">
              <Avatar
                src={session?.user?.profilePic}
                alt={session?.user?.name}
              />
            </Link>
            <Button
              onClick={() => signOut()}
              className="text-sm hidden md:block"
            >
              Sign Out
            </Button>
          </div>
        ) : status === "loading" ? (
          <LoadingPulser />
        ) : (
          <Button
            onClick={() => signIn("google", { redirect: false })}
            className={"text-sm"}
          >
            Sign In
          </Button>
        )}
      </div>
    </Appbar>
  );
};

export default Navbar;
