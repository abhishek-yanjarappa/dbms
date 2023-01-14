import LoginWidget from "./LoginWidget";

export default function Home() {
  return (
    <div className="w-full flex justify-center">
      <main className="w-full max-w-5xl m-5 p-5 border rounded-lg">
        <h1 className="text-xs tracking-widest">DBMS PROJECT</h1>
        <h1 className="text-4xl">Customer Support Management</h1>
        <p className="w-full text-p-7 ">By</p>
        <ul>
          <li className="text-base">Abhishek Y (20GANSE004)</li>
          <li className="text-base">Darchan T D (20GANSE016)</li>
        </ul>
        <div className="w-full">
          <LoginWidget />
        </div>
      </main>
    </div>
  );
}
