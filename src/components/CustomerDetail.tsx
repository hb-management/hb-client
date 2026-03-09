"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Phone, Mail, MapPin } from 'lucide-react';

interface ProductionOrder {
  stt: number;
  productionOrder: string;
  productCode: string;
  productionDate: string;
  deliveryDate: string;
}

import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/services/api';
import { useState, useEffect } from 'react';

export function CustomerDetail({ id }: { id?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const customerName = searchParams?.get('name') || `Khách hàng ${id}`;

  const [customerInfo, setCustomerInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchCustomer = async () => {
      try {
        if (!id) return;
        const data = await api.getCustomer(id, customerName);
        if (mounted) {
          setCustomerInfo(data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch customer', error);
        if (mounted) setLoading(false);
      }
    };
    fetchCustomer();
    return () => { mounted = false; };
  }, [id, customerName]);

  if (loading || !customerInfo) {
    return <div className="py-12 text-center text-muted-foreground">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="size-4 mr-2" />
          Quay lại
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Chi tiết khách hàng</h1>
        <p className="text-muted-foreground">Thông tin khách hàng và lệnh sản xuất</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin khách hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Tên khách hàng</div>
                <div className="font-semibold text-lg">{customerInfo.name}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Mã khách hàng</div>
                <div className="font-mono">{customerInfo.code}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Mã số thuế</div>
                <div>{customerInfo.taxCode}</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <Phone className="size-4 mt-1 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Điện thoại</div>
                  <div>{customerInfo.phone}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="size-4 mt-1 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div>{customerInfo.email}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="size-4 mt-1 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Địa chỉ</div>
                  <div>{customerInfo.address}</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Chất lượng thùng quen dùng (Preset)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên preset</TableHead>
                  <TableHead>Giấy mặt</TableHead>
                  <TableHead>Giấy đáy</TableHead>
                  <TableHead>Loại sóng</TableHead>
                  <TableHead>Dựng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customerInfo.qualityPresets.map((preset: any) => (
                  <TableRow key={preset.id}>
                    <TableCell className="font-semibold text-primary">{preset.name}</TableCell>
                    <TableCell>{preset.face}</TableCell>
                    <TableCell>{preset.base}</TableCell>
                    <TableCell>{preset.flute}</TableCell>
                    <TableCell>{preset.assembly}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách lệnh sản xuất</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">STT</TableHead>
                  <TableHead>Lệnh SX</TableHead>
                  <TableHead>Mã hàng</TableHead>
                  <TableHead>Ngày SX</TableHead>
                  <TableHead>Ngày giao</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customerInfo.productionOrders.map((order: any) => (
                  <TableRow key={order.stt}>
                    <TableCell className="font-medium">{order.stt}</TableCell>
                    <TableCell className="font-mono text-sm cursor-pointer text-primary hover:underline" onClick={() => router.push(`/orders/${order.productionOrder}`)}>
                      {order.productionOrder}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{order.productCode}</TableCell>
                    <TableCell>{new Date(order.productionDate).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell>{new Date(order.deliveryDate).toLocaleDateString('vi-VN')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}