"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "flowbite-react";
import CreateTeamModal from "./CreateTeamModal";
import TicketList from "./TicketList";

const Dashboard = () => {
  const session = useSession();
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);

  if (!session?.data?.user?.Enterprize) {
    return (
      <div className="w-full flex justify-center">
        <div className="w-full max-w-5xl p-5 ">
          <h1 className="text-4xl my-10 ">
            You're not part of any Enterprize.
          </h1>
          <p className="max-w-md">
            You're not part of any enterprize team. You can either ask the
            existing team to add you or you can create a new Enterprize team.
          </p>
          <Button
            className="my-5"
            onClick={() => setIsCreateTeamModalOpen((p) => !p)}
          >
            Create a new Enterprize Team
          </Button>
          <CreateTeamModal
            open={isCreateTeamModalOpen}
            onClose={() => setIsCreateTeamModalOpen((p) => !p)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-full flex flex-wrap gap-5 max-w-6xl p-5 ">
        <h1 className="text-5xl my-5">Dashoard</h1>
        <div className="w-full">
          <TicketList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
