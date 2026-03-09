import { CustomerDetail } from '@/components/CustomerDetail';

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <CustomerDetail id={id} />;
}
