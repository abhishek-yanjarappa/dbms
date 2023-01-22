"use client";

import axios from "axios";
import { Spinner, Button } from "flowbite-react";
import { useQuery } from "react-query";
import Ticket from "./Ticket";
import { useState } from "react";
import ChatModal from "./ChatModal";
import { BsFillGrid3X3GapFill as AllIcon } from "react-icons/bs";
import { ImWarning as PendingIcon } from "react-icons/im";
import { MdAssignmentTurnedIn as AssignedIcon } from "react-icons/md";
import { HiLockClosed as ClosedIcon } from "react-icons/hi";
import { FaUser as MineIcon } from "react-icons/fa";
import { HiUserGroup as GroupIcon } from "react-icons/hi";

type ChatModalInfo = {
  isOpen: boolean;
  ticket: any;
};

type FilterTabs = "all" | "pending" | "assigned" | "closed";

const TicketList = () => {
  const [filter, setFilter] = useState<FilterTabs>("all");
  const [own, setOwn] = useState<boolean>(false);
  const { data, isLoading } = useQuery(
    ["ticket-list", filter, own],
    async () =>
      (
        await axios.get(
          "/api/get/tickets?filter=" +
            filter +
            "&own=" +
            (own ? "true" : "false")
        )
      ).data,
    {
      refetchInterval: 1000 * 10,
    }
  );
  const [chatModal, setChatModal] = useState<ChatModalInfo>({
    isOpen: false,
    ticket: {},
  });
  return (
    <div className="w-full">
      <Button.Group className="mb-5 ">
        <Button
          color={filter === "all" ? "gray" : "dark"}
          disabled={filter === "all"}
          onClick={() => setFilter("all")}
        >
          <AllIcon className="mr-3 h-4 w-4" /> All
        </Button>
        <Button
          color={filter === "pending" ? "gray" : "dark"}
          disabled={filter === "pending"}
          onClick={() => setFilter("pending")}
        >
          <PendingIcon className="mr-3 h-4 w-4" /> Pending
        </Button>
        <Button
          color={filter === "assigned" ? "gray" : "dark"}
          disabled={filter === "assigned"}
          onClick={() => setFilter("assigned")}
        >
          <AssignedIcon className="mr-3 h-4 w-4" /> Assigned
        </Button>
        <Button
          color={filter === "closed" ? "gray" : "dark"}
          disabled={filter === "closed"}
          onClick={() => setFilter("closed")}
        >
          <ClosedIcon className="mr-3 h-4 w-4" /> Closed
        </Button>
      </Button.Group>

      {["all", "closed", "assigned"].includes(filter) && (
        <Button.Group className="mb-5 ml-5">
          <Button
            color={!own ? "gray" : "dark"}
            disabled={!own}
            onClick={() => setOwn(false)}
          >
            <GroupIcon className="mr-3 h-4 w-4" /> All
          </Button>
          <Button
            color={own ? "gray" : "dark"}
            disabled={own}
            onClick={() => setOwn(true)}
          >
            <MineIcon className="mr-3 h-4 w-4" /> Mine
          </Button>
        </Button.Group>
      )}

      {isLoading ? (
        <div className="w-full flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <div className="w-full flex gap-5 flex-wrap">
          {data?.tickets?.map((t, k) => (
            <Ticket
              ticket={t}
              key={k}
              setChatModal={() =>
                setChatModal({
                  ...chatModal,
                  isOpen: !chatModal.isOpen,
                  ticket: t,
                })
              }
            />
          ))}
        </div>
      )}
      {chatModal.isOpen && (
        <ChatModal
          ticket={chatModal?.ticket}
          isOpen={chatModal?.isOpen}
          onClose={() => setChatModal({ ...chatModal, isOpen: false })}
        />
      )}
    </div>
  );
};

export default TicketList;
