import { cookies } from "next/headers";
import PageClintModule from "./PageClintModule";

export default function Home() {
  const cookieStore = cookies();
  return(
    <PageClintModule  userDetails={(cookieStore && cookieStore.get("nextvlogauthuserdetails") && cookieStore.get("nextvlogauthuserdetails").value && JSON.parse(cookieStore.get("nextvlogauthuserdetails").value)) || {}}/>
  );
}
