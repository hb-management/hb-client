"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Truck, Calculator, Info, PrinterIcon } from 'lucide-react';

import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { useState, useEffect } from 'react';

export function OrderDetail({ orderId }: { orderId?: string }) {
  const router = useRouter();
  // If no orderId is passed, default to '001' or handle accordingly in the parent component

  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchOrder = async () => {
      try {
        if (!orderId) return;
        const data = await api.getOrder(orderId);
        if (mounted) {
          setOrderData(data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch order details', error);
        if (mounted) setLoading(false);
      }
    };
    fetchOrder();
    return () => { mounted = false; };
  }, [orderId]);

  if (loading || !orderData) {
    return <div className="py-12 text-center text-muted-foreground">Đang tải dữ liệu...</div>;
  }


  const handlePrintProductionOrder = () => {
    // TODO: Implement print functionality
    console.log('Printing production order...');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="size-4 mr-2" />
          Quay lại
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Chi tiết đơn hàng</h1>
        <p className="text-muted-foreground">Thông tin chi tiết và lịch sử giao hàng</p>
      </div>

      {/* Thông tin chung */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin chung</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Tên khách hàng</div>
                <div className="font-semibold text-lg">{orderData.customerName}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Tên sản phẩm</div>
                <div className="font-semibold">{orderData.productName}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Loại thùng</div>
                <div>{orderData.boxType}</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-primary/10 border-2 border-primary rounded-lg p-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Tổng số lượng</div>
                    <div className="font-bold text-lg">{orderData.totalQuantity.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Đã giao</div>
                    <div className="font-bold text-lg text-green-600">{orderData.delivered.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Còn lại</div>
                    <div className="font-bold text-lg text-orange-600">{orderData.remaining.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kích thước */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Kích thước</CardTitle>
            <Button variant="outline" size="sm" onClick={() => router.push('/formulas')}>
              <Calculator className="size-4 mr-2" />
              Xem công thức tính toán
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-2 mb-3">
                <Info className="size-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-1">
                    Thông số có sẵn
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    Dài, Rộng, Cao - nhập từ đơn hàng
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
              <div className="flex items-start gap-2 mb-3">
                <Calculator className="size-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-purple-900 dark:text-purple-100 mb-1">
                    Thông số tính toán
                  </div>
                  <div className="text-sm text-purple-700 dark:text-purple-300">
                    Số lượng chạy giấy, Khổ, Dài - tính theo công thức của loại thùng "{orderData.boxType}"
                  </div>
                </div>
              </div>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dài (mm)</TableHead>
                    <TableHead>Rộng (mm)</TableHead>
                    <TableHead>Cao (mm)</TableHead>
                    <TableHead className="bg-purple-50 dark:bg-purple-950/20">Số lượng chạy giấy *</TableHead>
                    <TableHead className="bg-purple-50 dark:bg-purple-950/20">Khổ (mm) *</TableHead>
                    <TableHead className="bg-purple-50 dark:bg-purple-950/20">Dài (mm) *</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold text-lg">{orderData.specifications.length}</TableCell>
                    <TableCell className="font-semibold text-lg">{orderData.specifications.width}</TableCell>
                    <TableCell className="font-semibold text-lg">{orderData.specifications.height}</TableCell>
                    <TableCell className="font-semibold text-purple-600 dark:text-purple-400 text-lg bg-purple-50 dark:bg-purple-950/20">
                      {orderData.specifications.paperQuantity.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/20">
                      {orderData.specifications.sheetSize}
                    </TableCell>
                    <TableCell className="font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/20">
                      {orderData.specifications.sheetLength}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="text-xs text-muted-foreground italic">
              * Giá trị được tính toán tự động dựa trên công thức của loại thùng
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chất lượng */}
      <Card>
        <CardHeader>
          <CardTitle>Chất lượng thùng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mặt</TableHead>
                  <TableHead>Đáy</TableHead>
                  <TableHead>Sóng</TableHead>
                  <TableHead>Dựng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">{orderData.quality.face}</TableCell>
                  <TableCell className="font-medium">{orderData.quality.base}</TableCell>
                  <TableCell className="font-medium">{orderData.quality.flute}</TableCell>
                  <TableCell className="font-medium">{orderData.quality.assembly}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Lịch sử giao hàng */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="size-5" />
            Lịch sử giao hàng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Lượt</TableHead>
                  <TableHead>Ngày giao</TableHead>
                  <TableHead className="text-right">Số lượng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderData.deliveries.map((delivery: any) => (
                  <TableRow key={delivery.stt}>
                    <TableCell className="font-medium">{delivery.stt}</TableCell>
                    <TableCell>{new Date(delivery.date).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell className="text-right font-semibold">{delivery.quantity.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={2} className="font-semibold">Tổng đã giao</TableCell>
                  <TableCell className="text-right font-bold text-green-600">{orderData.delivered.toLocaleString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Lệnh sản xuất - nút ở cuối */}
      <div className="flex justify-center pt-4">
        <Button size="lg" onClick={handlePrintProductionOrder}>
          <PrinterIcon className="size-5 mr-2" />
          In lệnh sản xuất
        </Button>
      </div>
    </div>
  );
}
