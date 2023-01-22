import type { NextApiRequest, NextApiResponse } from "next";
import dbClient from "../../lib/prismadb";
import teleSend from "../../lib/teleSend";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
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
        body: req.body?.text,
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

    await teleSend(
      chat?.Enterprize?.telegramToken,
      chat?.ChatKey,
      req.body.text
    );

    return res.status(200).json({
      message: "Chat item created",
      code: "SUCCESS",
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({ message: "Something went wrong" });
  }
}
