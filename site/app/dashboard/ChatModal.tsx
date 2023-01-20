import React from "react";
import { Modal, Button, Spinner, TextInput } from "flowbite-react";
import { useQuery } from "react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

const ChatModal = ({
  ticket,
  onClose,
  isOpen,
  ...props
}: {
  ticket: any;
  onClose: () => void;
  isOpen: boolean;
}) => {
  const sessionUser = useSession().data.user;
  const { data, isLoading } = useQuery(
    ["chatThread", ticket?.Chat?.id],
    async () =>
      (await axios.get("/api/get/chatThread?chatId=" + ticket?.Chat?.id)).data,
    {
      refetchInterval: 5 * 1000,
    }
  );

  return (
    <Modal show={isOpen} position="center" onClose={onClose}>
      <Modal.Header>{`Chat with ${ticket?.Customer?.name}`}</Modal.Header>
      <Modal.Body className="max-h-96 overflow-auto pt-0 px-0">
        <div className="w-full py-2 px-5 flex justify-between sticky bg-p-1">
          <p>{ticket?.Customer?.name}</p>
          <p>{sessionUser?.name}</p>
        </div>
        {isLoading ? (
          <Spinner />
        ) : (
          <div className="flex flex-col gap-2 pt-5 px-5">
            {data?.chat?.ChatItems?.map((chatItem, i) => (
              <div
                className={`px-5 py-2 bg-p-2 rounded-full max-w-fit ${
                  chatItem?.author == "CUSTOMER" ? "self-start" : "self-end"
                }`}
              >
                {chatItem?.body}
              </div>
            ))}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <TextInput id="small" type="text" sizing="sm" />
      </Modal.Footer>
    </Modal>
  );
};

export default ChatModal;
