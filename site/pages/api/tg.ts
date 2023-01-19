import type { NextApiRequest, NextApiResponse } from "next";
import dbClient from "../../lib/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log(req.body);
    const chat = await dbClient.chat.findUnique({
      where: {
        ChatKey: req.body?.message?.chat?.id,
      },
    });
    const chatState = chat?.State;
    switch (chatState) {
      case undefined || null:
        break;

      default:
        break;
    }

    return res.status(201).json({ message: "message recieved successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}
