import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import axios from "axios";
import dbClient from "../../../lib/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const sessionUser = (await unstable_getServerSession(req, res, authOptions))
      .user;

    const tickets = await dbClient.ticket.findMany({
      where: {
        enterprizeId: sessionUser?.Enterprize?.id,
      },
      include: {
        Customer: {
          select: {
            name: true,
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
