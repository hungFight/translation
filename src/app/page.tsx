import axios from "axios";
import Translate from "./components/Translate";

export const http = axios.create({
  baseURL: "https://trans-api-bths.onrender.com",
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});
export default async function Home() {
      const data = await http.get<{ [key: string]: string } | undefined>(
        "/lang-support",
      );
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center">
      <Translate data={data.data} />
    </div>
  );
}
