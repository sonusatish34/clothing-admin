import { useRouter } from "next/router";
import StoreItemsTable from "@/components/StoreItemsTable";
import Layout from "@/components/Layout/Layout";

export default function StoreItemsPage() {
    const router = useRouter();
    const { id } = router.query;

    if (!id) return <div>Loading...</div>;

    return <Layout><StoreItemsTable storeId={id} /></Layout> ;
}