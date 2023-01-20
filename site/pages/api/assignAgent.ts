import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import axios from "axios";
import dbClient from "../../lib/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const sessionUser = (await unstable_getServerSession(req, res, authOptions))
      .user;

    const ticketId = req.query.ticketId;
    const ticket = await dbClient.ticket.findUnique({
      where: {
        id: Number(ticketId),
      },
      include: {
        Enterprize: {
          select: {
            id: true,
          },
        },
      },
    });

    if (ticket?.Enterprize?.id !== sessionUser?.Enterprize?.id)
      return res
        .status(403)
        .json({ message: "Invalid request", code: "INVALID_REQUEST" });

    await dbClient.ticket.update({
      where: {
        id: ticket?.id,
      },
      data: {
        status: "ASSIGNED",
        Agent: {
          connect: { id: sessionUser?.id },
        },
      },
    });
    console.log("agent connected");
    return res.status(200).json({
      message: "Agent assigned",
      code: "SUCCESS",
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({ message: "Something went wrong" });
  }
}
