import Layout from "@/components/Layout/Layout";
import Link from "next/link";
import Dashboard from "@/components/Dashboard/Dashboard";
export default function DashboardPage() {
  return (
    <Layout>
      <div className="">
      {/* <p className="text-red-400">jjj</p> */}
        <Dashboard />
      </div>
    </Layout>

  );
}
