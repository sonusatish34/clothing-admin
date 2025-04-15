import Layout from "@/components/Layout/Layout";
import Link from "next/link";
import Orders from "@/components/Orders/Orders";
export default function OrdersPage() {
  return (
    <Layout>
      <div className="">
        <Orders />
      </div>
    </Layout>

  );
}
