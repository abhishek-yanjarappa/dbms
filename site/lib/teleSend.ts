import axios from "axios";

export default async (token: string, chatId: string, message: string) => {
  const response = await axios.get(
    `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${message}&parse_mode=HTML`
  );
  return response.data;
};
