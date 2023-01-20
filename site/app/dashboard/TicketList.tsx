"use client";

import axios from "axios";
import { Spinner } from "flowbite-react";
import { useQuery } from "react-query";
import Ticket from "./Ticket";
import { useState } from "react";
import { Ticket as TicketType } from "@prisma/client";
import ChatModal from "./ChatModal";

type ChatModalInfo = {
  isOpen: boolean;
  ticket: any;
};

const getTicketList = async () => {
  return (await axios.get("/api/get/tickets")).data;
};

const TicketList = () => {
  const { data, isLoading } = useQuery(["ticket-list"], getTicketList, {
    refetchInterval: 1000 * 10,
  });
  const [chatModal, setChatModal] = useState<ChatModalInfo>({
    isOpen: false,
    ticket: {},
  });
  return (
    <div className="w-full">
      {isLoading ? (
        <div className="w-full flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <div className="w-full flex gap-5 flex-wrap">
          {data?.tickets.map((t, k) => (
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
