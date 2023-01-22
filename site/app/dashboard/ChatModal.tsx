import React from "react";
import { Modal, Button, Spinner, TextInput, Textarea } from "flowbite-react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { HiOutlineArrowRight as SendIcon } from "react-icons/hi";

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
  const [text, setText] = useState<string>("");
  const sessionUser = useSession().data.user;
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    refetch: refetchChatThread,
  } = useQuery(
    ["chatThread", ticket?.Chat?.id, ticket?.id],
    async () =>
      (
        await axios.get(
          "/api/get/chatThread?chatId=" +
            ticket?.Chat?.id +
            "&ticketId=" +
            ticket?.id
        )
      ).data,
    {
      refetchInterval: 5 * 1000,
    }
  );

  const { isLoading: isSending, mutate: sendMessage } = useMutation(
    async () =>
      (
        await axios.post("/api/sendMessage", {
          text,
          chatId: ticket?.Chat?.id,
          ticketId: ticket?.id,
        })
      ).data,
    {
      onSuccess: () => refetchChatThread(),
    }
  );

  const { isLoading: isClosingTicket, mutate: closeTicket } = useMutation(
    async () =>
      (
        await axios.post("/api/closeTicket", {
          ticketId: ticket?.id,
          chatId: ticket?.Chat?.id,
        })
      ).data,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["ticket-list"]);
        onClose();
        setText("");
      },
    }
  );
  return (
    <Modal show={isOpen} position="center" onClose={onClose}>
      <Modal.Header>{`Chat with ${ticket?.Customer?.name}`}</Modal.Header>
      <Modal.Body className="max-h-96 overflow-auto pt-0 px-0 relative">
        {isLoading ? (
          <Spinner />
        ) : (
          <div className="flex flex-col gap-2 pt-5 px-5">
            {data?.chat?.ChatItems?.map((chatItem, i) => (
              <div
                className={`${
                  chatItem?.author == "CUSTOMER"
                    ? "self-start items-start"
                    : "self-end items-end"
                } flex flex-col`}
              >
                {data?.chat?.ChatItems?.[i - 1]?.author !==
                  chatItem?.author && (
                  <p className="px-2 py-2 text-p-7">
                    {chatItem?.author === "CUSTOMER"
                      ? ticket?.Customer?.name
                      : sessionUser?.name}
                  </p>
                )}
                <div
                  className={`px-5 py-2 bg-p-2 rounded-full max-w-fit ${
                    chatItem?.author == "CUSTOMER" ? "self-start" : "self-end"
                  }`}
                >
                  {chatItem?.body}
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal.Body>
      {ticket?.status !== "CLOSED" && (
        <Modal.Footer className="flex items-center gap-5 justify-between">
          <Button onClick={() => closeTicket()}>Close Ticket</Button>
          <div className="flex items-center gap-2">
            <Textarea
              className="resize-none h-10 max-h-10"
              rows={1}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <Button
              onClick={() => {
                sendMessage();
                setText("");
              }}
              disabled={text === ""}
            >
              {isSending ? <Spinner /> : <SendIcon />}
            </Button>
          </div>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default ChatModal;
