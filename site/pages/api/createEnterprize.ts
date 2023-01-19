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
    const newEnterprize = await dbClient.enterprize.create({
      data: {
        name: req.body?.name,
        email: req.body?.email,
        telegramToken: req.body?.telegramToken,
        Agents: {
          connect: { id: sessionUser?.id },
        },
      },
    });
    const URI = `${process.env.TG_WEBHOOK_URL}?id=${newEnterprize.id}`;
    const newTelegramResponse = (
      await axios.get(
        `https://api.telegram.org/bot${req?.body?.telegramToken}/setWebhook?url=${URI}`
      )
    ).data;
    console.log(newTelegramResponse);
    return res.status(200).json({
      message: "Enterprize Team Created Successfully",
      code: "SUCCESS",
    });
  } catch (error) {
    if (error?.response?.data?.error_code === 404) {
      return res.status(200).json({ code: "INVALID_TOKEN" });
    }
    res.status(200).json({ message: "Something went wrong" });
  }
}
