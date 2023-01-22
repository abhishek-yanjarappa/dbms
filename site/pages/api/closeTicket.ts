import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import dbClient from "../../lib/prismadb";
import teleSend from "../../lib/teleSend";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const sessionUser = (await unstable_getServerSession(req, res, authOptions))
      .user;

    const chat = await dbClient.chat.findUnique({
      where: {
        id: Number(req.body?.chatId),
      },
      select: {
        ChatKey: true,
        Enterprize: {
          select: {
            telegramToken: true,
          },
        },
      },
    });

    await dbClient.chatItem.create({
      data: {
        author: "AGENT",
        body: "***This Conversation was closed by the agent*** ",
        Chat: {
          connect: {
            id: Number(req?.body?.chatId),
          },
        },
        Ticket: {
          connect: {
            id: Number(req.body?.ticketId),
          },
        },
      },
    });

    await dbClient.chat.update({
      where: {
        id: Number(req.body?.chatId),
      },
      data: {
        State: 2,
      },
    });

    await dbClient.ticket.update({
      where: {
        id: Number(req.body?.ticketId),
      },
      data: {
        status: "CLOSED",
      },
    });

    await teleSend(
      chat?.Enterprize?.telegramToken,
      chat?.ChatKey,
      "***This Conversation was closed by the agent*** "
    );

    return res.status(200).json({
      message: "Ticket closed",
      code: "SUCCESS",
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({ message: "Something went wrong" });
  }
}
