import { Button, Window } from "@uvcemarvel/web-ui";
import { signIn } from "next-auth/react";

export default function Home() {
  return (
    <main>
      <Window>
        <h1 className="text-xs">DBMS Project</h1>
        <h1 className="text-xs">Customer Support Management</h1>
        <div className="flex gap-5 flex-wrap">
          <Button>Login with Google</Button>
        </div>
      </Window>
    </main>
  );
}
