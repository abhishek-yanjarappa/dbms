import type { NextApiRequest, NextApiResponse } from "next";
import dbClient from "../../lib/prismadb";
import axios from "axios";

const extractEmail = (str: string): string | boolean => {
  const emailRegex = /\S+@\S+\.\S+/;
  const match = str.match(emailRegex);
  return match ? match[0] : false;
};

const getMessageMeaning = async (incomingMessage: string) => {
  const response = await axios.get(
    `https://api.wit.ai/message?q=${incomingMessage}&n=1`,
    { headers: { Authorization: `Bearer ${process.env.WIT_AI}` } }
  );
  return response.data;
};

const sendMessage = async (token: string, chatId: string, message: string) => {
  const response = await axios.get(
    `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${message}&parse_mode=HTML`
  );
  return response.data;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const enterprizeId = req.query?.id;
    const chatKey = String(req.body?.message?.chat?.id);
    const chat = await dbClient.chat.findUnique({
      where: {
        ChatKey: chatKey,
      },
      include: {
        Enterprize: {
          select: {
            telegramToken: true,
            name: true,
            email: true,
            id: true,
          },
        },
        Customer: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });
    const chatState = chat?.State;
    const incomingMessage: string = req.body?.message?.text;
    console.log(req.body?.message, chatState);
    switch (chatState) {
      case undefined:
        await dbClient.chat.create({
          data: {
            ChatKey: chatKey,
            State: 1,
            ChatMedium: "TELEGRAM",
            Enterprize: {
              connect: { id: Number(enterprizeId) },
            },
          },
        });
        const theEnterprize = await dbClient.enterprize.findUnique({
          where: {
            id: Number(enterprizeId),
          },
        });
        const message = `Hello, You've reached ${theEnterprize.name}'s Customer Support Chat. Please enter your email ID to continue!.`;
        await sendMessage(theEnterprize?.telegramToken, chatKey, message);
        break;
      case 1:
        const email = extractEmail(incomingMessage);
        if (email) {
          const newUser = await dbClient.customer.create({
            data: {
              email: email as string,
              name:
                req.body?.message?.from?.first_name ||
                "" + " " + req.body?.message?.from?.last_name ||
                "",
              Chats: {
                connect: {
                  id: chat.id,
                },
              },
            },
          });
          await dbClient.chat.update({
            where: {
              id: chat.id,
            },
            data: {
              State: 2,
              Customer: {
                connect: {
                  id: newUser?.id,
                },
              },
            },
          });
          await sendMessage(
            chat.Enterprize.telegramToken,
            chat.ChatKey,
            `Thank you, ${newUser?.name}!. Please enter your query`
          );
        } else {
          await sendMessage(
            chat.Enterprize.telegramToken,
            chat.ChatKey,
            `Please enter the correct email address. Thankyou`
          );
        }
      case 2:
        await dbClient.chatItem.create({
          data: {
            body: incomingMessage,
            Chat: {
              connect: { id: chat.id },
            },
            author: "CUSTOMER",
          },
        });
        await dbClient.ticket.create({
          data: {
            body: incomingMessage,
            Chat: {
              connect: {
                id: chat.id,
              },
            },
            Enterprize: {
              connect: {
                id: chat.Enterprize.id,
              },
            },
            Customer: {
              connect: {
                id: chat.Customer.id,
              },
            },
            status: "PENDING",
          },
        });
        await dbClient.chat.update({
          where: {
            id: chat.id,
          },
          data: {
            State: 3,
          },
        });
        await sendMessage(
          chat.Enterprize.telegramToken,
          chat.ChatKey,
          `A Ticket has been raised for your query:\n\n
          "${incomingMessage}"\n
          Please wait for an agent to respond. Thank you.
          `
        );
      case 3:
        await dbClient.chatItem.create({
          data: {
            author: "CUSTOMER",
            body: incomingMessage,
            Chat: {
              connect: {
                id: chat.id,
              },
            },
          },
        });
      default:
        break;
    }

    return res.status(201).json({ message: "message recieved successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
}
