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

    const chatId = req.query?.chatId;
    const chat = await dbClient.chat.findUnique({
      where: {
        id: Number(chatId),
      },

      select: {
        ChatItems: {
          where: {
            ticketId: Number(req.query?.ticketId),
          },
        },
        Enterprize: {
          select: {
            id: true,
          },
        },
      },
    });

    if (chat?.Enterprize?.id !== sessionUser?.Enterprize?.id) {
      return res
        .status(403)
        .json({ code: "INVALID_REQUEST", message: "not authorised" });
    }

    return res.status(200).json({
      chat: chat,
      message: "Tickets fetched Successfully",
      code: "SUCCESS",
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({ message: "Something went wrong" });
  }
}
