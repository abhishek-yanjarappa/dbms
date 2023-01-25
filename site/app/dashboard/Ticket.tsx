import axios from "axios";
import { Badge, Button, Spinner } from "flowbite-react";
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { useSession } from "next-auth/react";

const assignAgent = async (ticketId: number) => {
  return (await axios.post(`/api/assignAgent?ticketId=${ticketId}`)).data;
};

const Ticket = ({
  ticket: t,
  setChatModal,
}: {
  ticket: any;
  setChatModal: ({}) => void;
}) => {
  const { data, isLoading, mutate } = useMutation(() => assignAgent(t?.id));
  const sessionUser = useSession().data.user;
  const queryClient = useQueryClient();
  const handlePick = () => {
    mutate();
    queryClient.invalidateQueries(["ticket-list"]);
  };

  return (
    <div className="rounded-lg border border-p-5 bg-p-1 min-w-[250px] cursor-pointer flex-1 max-w-[250px] h-min">
      <div className="p-5 bg-p-2 rounded-t-lg">
        <h6 className="text-lg">{t?.body}</h6>
      </div>
      <hr className="border-p-6" />
      <div className="px-5 py-2 flex gap-5 justify-between items-center">
        <p className="text-sm text-p-7">{t?.Customer?.name}</p>
        <Badge
          size={"xs"}
          color={
            t?.status === "PENDING"
              ? "warning"
              : t?.status === "ASSIGNED"
              ? "info"
              : "success"
          }
        >
          {t?.status}
        </Badge>
      </div>
      <hr className="border-p-6" />
      <div>
        {t?.status === "PENDING" ? (
          <Button
            onClick={handlePick}
            className="w-full rounded-none rounded-b-lg"
            color={"dark"}
          >
            {isLoading ? <Spinner /> : "Pick"}
          </Button>
        ) : t?.status === "CLOSED" ? (
          <Button
            onClick={setChatModal}
            color={"dark"}
            className="w-full rounded-none rounded-b-lg"
          >
            {isLoading ? <Spinner /> : "View"}
          </Button>
        ) : t?.Agent?.id === sessionUser?.id ? (
          <Button
            className="w-full rounded-none rounded-b-lg"
            onClick={setChatModal}
            color={"dark"}
          >
            {isLoading ? <Spinner /> : "Open"}
          </Button>
        ) : (
          <div className="w-full rounded-b-lg flex justify-center text-sm py-3">{`Assigned to ${t?.Agent?.name}`}</div>
        )}
      </div>
    </div>
  );
};

export default Ticket;
