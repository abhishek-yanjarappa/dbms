import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import axios from "axios";
import dbClient from "../../../lib/prismadb";

type FilterTabs = "all" | "pending" | "assigned" | "closed";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const sessionUser = (await unstable_getServerSession(req, res, authOptions))
      .user;

    const filter: FilterTabs = req.query?.filter as FilterTabs;
    const own: boolean = req.query?.own === "true";
    const tickets = await dbClient.ticket.findMany({
      where: {
        ...(filter === "all"
          ? {
              AND: [
                {
                  enterprizeId: sessionUser?.Enterprize?.id,
                },
                own ? { agentId: sessionUser?.id } : null,
              ],
            }
          : filter === "assigned"
          ? {
              AND: [
                {
                  enterprizeId: sessionUser?.Enterprize?.id,
                },
                {
                  status: "ASSIGNED",
                },
                own ? { agentId: sessionUser?.id } : null,
              ],
            }
          : filter === "closed"
          ? {
              AND: [
                {
                  enterprizeId: sessionUser?.Enterprize?.id,
                },
                {
                  status: "CLOSED",
                },
                own ? { agentId: sessionUser?.id } : null,
              ],
            }
          : filter === "pending" && {
              AND: [
                {
                  enterprizeId: sessionUser?.Enterprize?.id,
                },
                {
                  status: "PENDING",
                },
              ],
            }),
      },
      include: {
        Customer: {
          select: {
            name: true,
          },
        },
        Agent: {
          select: {
            id: true,
            name: true,
          },
        },
        Chat: {
          select: {
            id: true,
          },
        },
      },
    });
    return res.status(200).json({
      tickets: tickets,
      message: "Tickets fetched Successfully",
      code: "SUCCESS",
    });
  } catch (error) {
    if (error?.response?.data?.error_code === 404) {
      return res.status(200).json({ code: "INVALID_TOKEN" });
    }
    res.status(200).json({ message: "Something went wrong" });
  }
}
