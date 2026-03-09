import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Info, Plus, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface QualityPreset {
  id: string;
  name: string;
  face: string;
  base: string;
  flute: string;
  assembly: string;
}

interface Customer {
  id: string;
  name: string;
  qualityPresets: QualityPreset[];
}

interface OrderItem {
  id?: string;
  productName: string;
  boxType: string;
  quantity: string;
  length: string;
  width: string;
  height: string;
  face: string;
  base: string;
  flute: string;
  assembly: string;
  presetUsed: string;
}

interface AddOrderFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (orderData: any) => void;
}

export function AddOrderForm({ open, onClose, onSubmit }: AddOrderFormProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [orderDate, setOrderDate] = useState<Date>();
  const [priority, setPriority] = useState<string>('');

  // Multi-item state
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Item editor state
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [useCustomQuality, setUseCustomQuality] = useState(false);

  // Mock data - khách hàng với preset chất lượng quen dùng
  const customers: Customer[] = [
    {
      id: 'KH001',
      name: 'Công ty TNHH Bao bì Sài Gòn',
      qualityPresets: [
        {
          id: 'preset1',
          name: 'Thùng xuất khẩu',
          face: 'Kraft liner 200gsm',
          base: 'Test liner 150gsm',
          flute: 'Sóng B + Sóng C (BC)',
          assembly: 'Dán keo nóng, 4 cánh gấp',
        },
        {
          id: 'preset2',
          name: 'Thùng nội địa tiêu chuẩn',
          face: 'Kraft liner 175gsm',
          base: 'Test liner 125gsm',
          flute: 'Sóng B',
          assembly: 'Dán keo trắng, 4 cánh gấp',
        },
      ],
    },
    {
      id: 'KH002',
      name: 'Công ty CP In ấn Việt Nam',
      qualityPresets: [
        {
          id: 'preset3',
          name: 'Thùng cao cấp in offset',
          face: 'White liner 250gsm',
          base: 'Kraft liner 180gsm',
          flute: 'Sóng C',
          assembly: 'Dán keo nóng, 4 cánh gấp, có sóng chống xẹp',
        },
      ],
    },
    {
      id: 'KH003',
      name: 'Xí nghiệp Bao bì Đông Nam',
      qualityPresets: [
        {
          id: 'preset4',
          name: 'Thùng cơ bản',
          face: 'Kraft liner 150gsm',
          base: 'Test liner 100gsm',
          flute: 'Sóng C',
          assembly: 'Dán keo trắng, 2 cánh gấp',
        },
      ],
    },
  ];

  const boxTypes = [
    { id: '3', name: 'Thùng carton 3 lớp', layers: 3 },
    { id: '5', name: 'Thùng carton 5 lớp', layers: 5 },
    { id: '7', name: 'Thùng carton 7 lớp', layers: 7 },
    { id: 'special', name: 'Thùng carton đặc biệt', layers: 5 },
  ];

  const [itemFormData, setItemFormData] = useState<OrderItem>({
    productName: '',
    boxType: '',
    length: '',
    width: '',
    height: '',
    quantity: '',
    face: '',
    base: '',
    flute: '',
    assembly: '',
    presetUsed: 'custom',
  });

  const selectedCustomerData = customers.find((c: Customer) => c.id === selectedCustomer);
  const selectedPresetData = selectedCustomerData?.qualityPresets.find((p: QualityPreset) => p.id === selectedPreset);

  const handlePresetChange = (presetId: string) => {
    setSelectedPreset(presetId);
    const preset = selectedCustomerData?.qualityPresets.find((p: QualityPreset) => p.id === presetId);
    if (preset) {
      setItemFormData(prev => ({
        ...prev,
        face: preset.face,
        base: preset.base,
        flute: preset.flute,
        assembly: preset.assembly,
        presetUsed: presetId,
      }));
      setUseCustomQuality(false);
    }
  };

  const handleAddItem = () => {
    if (!itemFormData.productName || !itemFormData.quantity) return;

    if (editingIndex !== null) {
      const newItems = [...orderItems];
      newItems[editingIndex] = { ...itemFormData };
      setOrderItems(newItems);
      setEditingIndex(null);
    } else {
      setOrderItems([...orderItems, { ...itemFormData, id: Math.random().toString(36).substr(2, 9) }]);
    }
    resetItemEditor();
  };

  const resetItemEditor = () => {
    setItemFormData({
      productName: '',
      boxType: '',
      length: '',
      width: '',
      height: '',
      quantity: '',
      face: '',
      base: '',
      flute: '',
      assembly: '',
      presetUsed: 'custom',
    });
    setSelectedPreset('');
    setUseCustomQuality(false);
    setEditingIndex(null);
  };

  const handleEditItem = (index: number) => {
    const item = orderItems[index];
    setItemFormData(item);
    setEditingIndex(index);
    if (item.presetUsed !== 'custom') {
      setSelectedPreset(item.presetUsed);
      setUseCustomQuality(false);
    } else {
      setUseCustomQuality(true);
    }
  };

  const handleRemoveItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
    if (editingIndex === index) {
      resetItemEditor();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderItems.length === 0) {
      alert('Vui lòng thêm ít nhất một mặt hàng');
      return;
    }

    const orderData = {
      customerId: selectedCustomer,
      customerName: selectedCustomerData?.name,
      orderDate: orderDate,
      priority: priority,
      items: orderItems.map(item => ({
        productName: item.productName,
        boxType: item.boxType,
        dimensions: {
          length: parseInt(item.length),
          width: parseInt(item.width),
          height: parseInt(item.height),
        },
        quantity: parseInt(item.quantity),
        quality: {
          face: item.face,
          base: item.base,
          flute: item.flute,
          assembly: item.assembly,
        },
        presetUsed: item.presetUsed,
      })),
    };

    onSubmit(orderData);
    handleReset();
  };

  const handleReset = () => {
    setSelectedCustomer('');
    setOrderDate(undefined);
    setPriority('');
    setOrderItems([]);
    resetItemEditor();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl min-w-6xl max-h-[90vh] min-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm đơn đặt hàng mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Column 1: Order Meta & Item List */}
            <div className="space-y-8 h-full flex flex-col">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <span className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                    Thông tin đơn hàng
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {/* Khách hàng */}
                    <div className="space-y-2">
                      <Label htmlFor="customer">Khách hàng *</Label>
                      <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Chọn khách hàng..." />
                        </SelectTrigger>
                        <SelectContent>
                          {customers.map(customer => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Ngày đặt và Độ ưu tiên */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Ngày đặt *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal bg-background"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {orderDate ? format(orderDate, 'dd/MM/yyyy', { locale: vi }) : <span>Chọn ngày</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={orderDate}
                              onSelect={setOrderDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="priority">Độ ưu tiên *</Label>
                        <Select value={priority} onValueChange={setPriority}>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Chọn độ ưu tiên..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cao">Cao</SelectItem>
                            <SelectItem value="trung-binh">Trung bình</SelectItem>
                            <SelectItem value="thap">Thấp</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <span className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                      Danh sách mặt hàng ({orderItems.length})
                    </h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={resetItemEditor}
                      className="h-8 gap-1"
                    >
                      <Plus className="h-3.5 w-3.5" /> Thêm mặt hàng
                    </Button>
                  </div>

                  <div className="border rounded-xl divide-y overflow-hidden overflow-y-auto max-h-[200px] bg-muted/5 min-h-[200px]">
                    {orderItems.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground italic text-sm">
                        Chưa có mặt hàng nào. Thêm thông tin bên phải để bắt đầu.
                      </div>
                    ) : (
                      orderItems.map((item, index) => (
                        <div
                          key={item.id}
                          className={`p-4 flex items-center justify-between group transition-colors hover:bg-muted/10 ${editingIndex === index ? 'bg-primary/5 border-l-2 border-l-primary' : ''}`}
                        >
                          <div className="space-y-1">
                            <div className="font-medium text-sm">{item.productName}</div>
                            <div className="text-xs text-muted-foreground">
                              SL: {item.quantity} | {item.length}x{item.width}x{item.height} mm
                            </div>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-primary"
                              onClick={() => handleEditItem(index)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => handleRemoveItem(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Item Editor */}
            <div className="bg-muted/50 border rounded-2xl px-6 py-4 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                {editingIndex !== null ? 'Sửa mặt hàng' : 'Chi tiết mặt hàng'}
              </h3>

              <div className="space-y-3">
                {/* Tên hàng */}
                <div className="space-y-2">
                  <Label htmlFor="productName">Tên hàng / Mã hàng *</Label>
                  <Input
                    id="productName"
                    className="bg-background"
                    placeholder="VD: Thùng đựng điện tử 120x80x50"
                    value={itemFormData.productName}
                    onChange={(e) => setItemFormData({ ...itemFormData, productName: e.target.value })}
                  />
                </div>

                {/* Loại thùng và Số lượng */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="boxType">Loại thùng *</Label>
                    <Select value={itemFormData.boxType} onValueChange={(value) => setItemFormData({ ...itemFormData, boxType: value })}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Chọn loại thùng..." />
                      </SelectTrigger>
                      <SelectContent>
                        {boxTypes.map((type: any) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name} ({type.layers} lớp)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Số lượng *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      className="bg-background"
                      placeholder="5000"
                      value={itemFormData.quantity}
                      onChange={(e) => setItemFormData({ ...itemFormData, quantity: e.target.value })}
                    />
                  </div>
                </div>

                {/* Kích thước */}
                <div className="space-y-2">
                  <Label>Kích thước thùng (mm) *</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor="length" className="text-xs text-muted-foreground">Dài (D)</Label>
                      <Input
                        id="length"
                        type="number"
                        className="bg-background"
                        placeholder="1200"
                        value={itemFormData.length}
                        onChange={(e) => setItemFormData({ ...itemFormData, length: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="width" className="text-xs text-muted-foreground">Rộng (R)</Label>
                      <Input
                        id="width"
                        type="number"
                        className="bg-background"
                        placeholder="800"
                        value={itemFormData.width}
                        onChange={(e) => setItemFormData({ ...itemFormData, width: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="height" className="text-xs text-muted-foreground">Cao (C)</Label>
                      <Input
                        id="height"
                        type="number"
                        className="bg-background"
                        placeholder="50"
                        value={itemFormData.height}
                        onChange={(e) => setItemFormData({ ...itemFormData, height: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Chất lượng thùng */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">Chất lượng thùng *</Label>
                    {selectedCustomerData && selectedCustomerData.qualityPresets.length > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs h-7 px-2"
                        onClick={() => setUseCustomQuality(!useCustomQuality)}
                      >
                        {useCustomQuality ? '← Dùng preset' : 'Tùy chỉnh →'}
                      </Button>
                    )}
                  </div>

                  {!useCustomQuality && selectedCustomerData && selectedCustomerData.qualityPresets.length > 0 && (
                    <div className="space-y-3">
                      <Select value={selectedPreset} onValueChange={handlePresetChange}>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Chọn cấu hình chất lượng..." />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedCustomerData.qualityPresets.map((preset: QualityPreset) => (
                            <SelectItem key={preset.id} value={preset.id}>
                              {preset.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {selectedPresetData && (
                        <div className="bg-muted/30 rounded-lg p-3 grid grid-cols-2 gap-2 text-xs">
                          <div><span className="text-muted-foreground">Mặt:</span> {selectedPresetData.face}</div>
                          <div><span className="text-muted-foreground">Đáy:</span> {selectedPresetData.base}</div>
                          <div><span className="text-muted-foreground">Sóng:</span> {selectedPresetData.flute}</div>
                          <div><span className="text-muted-foreground">Dựng:</span> {selectedPresetData.assembly}</div>
                        </div>
                      )}
                    </div>
                  )}

                  {(useCustomQuality || !selectedCustomerData || selectedCustomerData.qualityPresets.length === 0) && (
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="space-y-1">
                        <Label htmlFor="face" className="text-xs">Giấy mặt</Label>
                        <Input
                          id="face"
                          className="h-9 text-xs bg-background"
                          placeholder="Kraft liner"
                          value={itemFormData.face}
                          onChange={(e) => setItemFormData({ ...itemFormData, face: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="base" className="text-xs">Giấy đáy</Label>
                        <Input
                          id="base"
                          className="h-9 text-xs bg-background"
                          placeholder="Test liner"
                          value={itemFormData.base}
                          onChange={(e) => setItemFormData({ ...itemFormData, base: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="flute" className="text-xs">Loại sóng</Label>
                        <Input
                          id="flute"
                          className="h-9 text-xs bg-background"
                          placeholder="Sóng BC"
                          value={itemFormData.flute}
                          onChange={(e) => setItemFormData({ ...itemFormData, flute: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="assembly" className="text-xs">Dựng</Label>
                        <Input
                          id="assembly"
                          className="h-9 text-xs bg-background"
                          placeholder="Dán keo"
                          value={itemFormData.assembly}
                          onChange={(e) => setItemFormData({ ...itemFormData, assembly: e.target.value })}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  type="button"
                  className="w-full h-11 mt-2"
                  onClick={handleAddItem}
                  disabled={!itemFormData.productName || !itemFormData.quantity}
                >
                  {editingIndex !== null ? 'Cập nhật mặt hàng' : 'Lưu mặt hàng này'}
                </Button>
              </div>
            </div>
          </div>


          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">
              Thêm đơn hàng
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}