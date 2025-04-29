import Login from "@/components/Login/Login";
import { useEffect } from "react";
export default function ApprovalLogin() {

  useEffect(() => {
    localStorage.clear()
  }, [])

  return (
    <Login role='approval' />
  );
}
