"use client";

import axios from "axios";
import { Spinner } from "flowbite-react";
import { useQuery } from "react-query";

const getTicketList = async () => {
  return (await axios.get("/api/get/tickets")).data;
};

const TicketList = () => {
  const { data, isLoading } = useQuery(["ticket-list"], getTicketList, {
    refetchInterval: 1000 * 10,
  });
  console.log(data);
  return (
    <div className="w-full">
      {isLoading ? (
        <div className="w-full flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <div className="w-full flex gap-5 flex-wrap">
          {data?.tickets.map((t) => (
            <div className="rounded-lg border border-p-5 bg-p-1 min-w-[250px] cursor-pointer">
              <div className="p-5 bg-p-2">
                <h6 className="text-lg">{t?.body}</h6>
              </div>
              <hr className="border-p-6" />
              <div className="px-5 py-2 flex gap-5 justify-between items-center">
                <p className="text-sm text-p-7">{t?.Customer?.name}</p>
                <div
                  className={`rounded-md px-2 py-1 text-xs ${
                    t?.status === "PENDING"
                      ? "bg-yellow-900 text-yellow-100 border border-yellow-600"
                      : "bg-green-900 text-green-100 border border-green-600"
                  }`}
                >
                  {t?.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketList;
