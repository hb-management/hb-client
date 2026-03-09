"use client";

import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Eye, Plus, Pencil, ChevronRight, ChevronDown, Package } from 'lucide-react';
import { OrderItem } from '@/services/api';
import { AddOrderForm } from '@/components/AddOrderForm';

import { api, APIOrder } from '@/services/api';

import { useRouter } from 'next/navigation';

export function OrderList() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddOrderForm, setShowAddOrderForm] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({ '001': true }); // Expand first one by default for demo
  const [editDeliveryDialog, setEditDeliveryDialog] = useState<{ open: boolean; orderId: string | null; itemId: string | null }>({ open: false, orderId: null, itemId: null });
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryQuantity, setDeliveryQuantity] = useState('');

  const [orders, setOrders] = useState<APIOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchOrders = async () => {
      try {
        const data = await api.getOrders();
        if (mounted) {
          setOrders(data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch orders', error);
        if (mounted) setLoading(false);
      }
    };
    fetchOrders();
    return () => { mounted = false; };
  }, []);

  const filteredOrders = orders.filter(order =>
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.items.some(item => item.productName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case 'cao':
        return { color: 'text-red-600', dot: 'bg-red-600', text: 'Cao' };
      case 'trung-binh':
        return { color: 'text-yellow-500', dot: 'bg-yellow-500', text: 'Trung bình' };
      case 'thap':
        return { color: 'text-green-600', dot: 'bg-green-600', text: 'Thấp' };
      default:
        return { color: '', dot: '', text: priority };
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'Đã giao' ? 'default' : 'destructive';
  };

  const handleAddOrder = (orderData: any) => {
    console.log('New order:', orderData);
    // TODO: Add order to database
    setShowAddOrderForm(false);
    // Show success toast
  };

  const handleOpenEditDelivery = (orderId: string, itemId: string) => {
    setEditDeliveryDialog({ open: true, orderId, itemId });
    setDeliveryDate(new Date().toISOString().split('T')[0]);
    setDeliveryQuantity('');
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrders(prev => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const handleSaveDelivery = async () => {
    if (editDeliveryDialog.orderId && editDeliveryDialog.itemId && deliveryDate && deliveryQuantity) {
      try {
        const { orderId, itemId } = editDeliveryDialog;
        const updatedOrder = await api.updateDelivery(orderId, itemId, parseInt(deliveryQuantity));
        setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
        setEditDeliveryDialog({ open: false, orderId: null, itemId: null });
      } catch (error) {
        console.error('Failed to update delivery', error);
      }
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-muted-foreground">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Thông tin đặt hàng</h1>
          <p className="text-muted-foreground">Danh sách đơn hàng theo khách và ngày</p>
        </div>
        <Button
          onClick={() => setShowAddOrderForm(true)}
        >
          <Plus className="size-4 mr-2" />
          Thêm đơn hàng
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
          <Input
            placeholder="Tìm kiếm theo tên khách hàng, tên hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="border rounded-xl overflow-hidden bg-background shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead className="font-semibold">Tên khách hàng</TableHead>
              <TableHead className="font-semibold">Ngày đặt</TableHead>
              <TableHead className="font-semibold">Độ ưu tiên</TableHead>
              <TableHead className="font-semibold">Trạng thái</TableHead>
              <TableHead className="font-semibold">Số mặt hàng</TableHead>
              <TableHead className="text-right font-semibold">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => {
              const priorityInfo = getPriorityInfo(order.priority);
              const isExpanded = !!expandedOrders[order.id];

              return (
                <React.Fragment key={order.id}>
                  <TableRow className={`${isExpanded ? 'bg-red-50/30' : ''} border-b`}>
                    <TableCell className="p-0 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleExpand(order.id)}
                      >
                        {isExpanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                      </Button>
                    </TableCell>
                    <TableCell
                      className="font-semibold text-gray-800 cursor-pointer hover:underline"
                      onClick={() => router.push(`/customers/${order.id}?name=${encodeURIComponent(order.customerName)}`)}
                    >
                      {order.customerName}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`size-3 rounded-full ${priorityInfo.dot}`} />
                        <span className="font-medium">{priorityInfo.text}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${order.status === 'Đã giao' ? 'bg-black hover:bg-black' : 'bg-[#e11d48] hover:bg-[#e11d48]'} text-white border-0 font-normal px-3 py-1 rounded-full whitespace-nowrap`}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {order.items.length} mặt hàng
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-black"
                        onClick={() => router.push(`/orders/${order.id}`)}
                      >
                        <Eye className="size-4 mr-2" />
                        Chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>

                  {isExpanded && order.items.map((item, idx) => (
                    <TableRow key={item.id} className="bg-red-50/10 border-b last:border-b-0 hover:bg-red-50/20 transition-colors">
                      <TableCell colSpan={2} className="pl-12">
                        <div className="flex items-start gap-4">
                          <div className="mt-2 text-gray-400">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M10 5 L10 15 L20 15" />
                            </svg>
                          </div>
                          <div className="space-y-1 py-1">
                            <div className="font-bold text-gray-800">{item.productName}</div>
                            <div className="text-xs text-muted-foreground italic">{item.description}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell colSpan={2}>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[13px] py-1">
                          <div className="flex gap-2">
                            <span className="text-muted-foreground w-10">Mặt:</span>
                            <span className="text-gray-700">{item.quality.face}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-muted-foreground w-10">Đáy:</span>
                            <span className="text-gray-700">{item.quality.base}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-muted-foreground w-10">Sóng:</span>
                            <span className="text-gray-700">{item.quality.flute}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-muted-foreground w-10">Dựng:</span>
                            <span className="text-gray-700">{item.quality.assembly}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${item.status === 'Đã giao' ? 'bg-black hover:bg-black' : 'bg-[#e11d48] hover:bg-[#e11d48]'} text-white border-0 font-normal px-3 py-1 rounded-full text-xs whitespace-nowrap`}
                        >
                          {item.status} {item.status === 'Thiếu' && `(${item.delivered.toLocaleString()}/${item.quantity.toLocaleString()})`}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-gray-800">
                        {item.quantity.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-8 border-gray-300 shadow-sm"
                          onClick={() => handleOpenEditDelivery(order.id, item.id)}
                        >
                          <Pencil className="size-3 mr-2" />
                          Giao hàng
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Không tìm thấy đơn hàng nào
        </div>
      )}

      <AddOrderForm
        open={showAddOrderForm}
        onClose={() => setShowAddOrderForm(false)}
        onSubmit={handleAddOrder}
      />

      {/* Dialog chỉnh sửa số lượng đã giao */}
      <Dialog open={editDeliveryDialog.open} onOpenChange={(open) => setEditDeliveryDialog({ open, orderId: null, itemId: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đăng ký giao hàng</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="deliveryDate">Ngày giao</Label>
              <Input
                id="deliveryDate"
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryQuantity">Số lượng giao</Label>
              <Input
                id="deliveryQuantity"
                type="number"
                placeholder="Nhập số lượng đã giao..."
                value={deliveryQuantity}
                onChange={(e) => setDeliveryQuantity(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDeliveryDialog({ open: false, orderId: null, itemId: null })}>
              Hủy
            </Button>
            <Button onClick={handleSaveDelivery}>
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
