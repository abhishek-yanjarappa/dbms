"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Navbar, Dropdown, Avatar, Button } from "flowbite-react";
import Link from "next/link";

const Appbar = () => {
  const { data: session, status } = useSession();

  return (
    <Navbar fluid={true} rounded={true}>
      <Navbar.Brand>
        <Link href="/">
          <span className="self-center whitespace-nowrap dark:text-white">
            DBMS Project CSM{" "}
            {session ? `| ${session?.user?.Enterprize?.name}` : ""}
          </span>
        </Link>
      </Navbar.Brand>
      <div className="flex md:order-2">
        {session ? (
          <Dropdown
            arrowIcon={false}
            inline={true}
            label={
              <Avatar
                alt="User settings"
                img={session.user?.photo}
                rounded={true}
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">{session.user?.name}</span>
              <span className="block truncate text-sm font-medium">
                {session?.user?.email}
              </span>
            </Dropdown.Header>
            <Dropdown.Item onClick={() => signOut()}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Button onClick={() => signIn("google")}>Login</Button>
        )}
        <Navbar.Toggle />
      </div>
    </Navbar>
  );
};

export default Appbar;
