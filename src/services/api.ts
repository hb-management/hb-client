// src/app/services/api.ts

export interface OrderItem {
    id: string;
    productName: string;
    description?: string;
    quality: {
        face: string;
        base: string;
        flute: string;
        assembly: string;
    };
    quantity: number;
    delivered: number;
    status: 'Đã giao' | 'Thiếu';
}

export interface APIOrder {
    id: string;
    manufacturingNumber: string;
    customerName: string;
    orderDate: string;
    deliveryDate: string;
    priority: 'cao' | 'trung-binh' | 'thap';
    status: string; // Summary status e.g. "Thiếu (6,000/8,500)" or "Đã giao"
    productListLength: number;
    items?: OrderItem[];
}

export interface ProductionOrder {
    stt: number;
    productionOrder: string;
    productCode: string;
    productionDate: string;
    deliveryDate: string;
}

export interface Formula {
    id: string;
    boxType: string;
    layers: number;
    sheetSizeFormula: string;
    sheetLengthFormula: string;
    paperQuantityFormula: string;
    description: string;
    example: {
        input: { length: number; width: number; height: number };
        output: { sheetSize: number; sheetLength: number; paperQuantity: number };
    };
}

const mockOrders: APIOrder[] = [
    {
        id: '001',
        customerName: 'Công ty TNHH Bao bì Sài Gòn',
        orderDate: '2026-02-01',
        priority: 'cao',
        status: 'Thiếu (6,000/8,500)',
        items: [
            {
                id: 'item-1',
                productName: 'Thùng carton 5 lớp 120x80x50',
                description: 'Mặt hàng #1',
                quality: {
                    face: 'Kraft liner 200gsm',
                    base: 'Test liner 150gsm',
                    flute: 'Sóng B+C',
                    assembly: 'Dán keo nóng',
                },
                quantity: 5000,
                delivered: 3500,
                status: 'Thiếu'
            },
            {
                id: 'item-2',
                productName: 'Thùng carton 3 lớp 100x70x40',
                description: 'Mặt hàng #2',
                quality: {
                    face: 'Kraft liner 175gsm',
                    base: 'Test liner 125gsm',
                    flute: 'Sóng B',
                    assembly: 'Dán keo trắng',
                },
                quantity: 2000,
                delivered: 2000,
                status: 'Đã giao'
            },
            {
                id: 'item-3',
                productName: 'Thùng carton 7 lớp 150x100x60',
                description: 'Mặt hàng #3',
                quality: {
                    face: 'White liner 250gsm',
                    base: 'Kraft liner 180gsm',
                    flute: 'Sóng BC',
                    assembly: 'Dán keo nóng',
                },
                quantity: 1500,
                delivered: 500,
                status: 'Thiếu'
            }
        ]
    },
    {
        id: '002',
        customerName: 'Công ty CP In ấn Việt Nam',
        orderDate: '2026-02-01',
        priority: 'trung-binh',
        status: 'Đã giao',
        items: [
            {
                id: 'item-4',
                productName: 'Thùng carton 3 lớp 100x70x40',
                description: 'Mặt hàng #1',
                quality: {
                    face: 'Kraft liner 175gsm',
                    base: 'Test liner 125gsm',
                    flute: 'Sóng B',
                    assembly: 'Dán keo trắng',
                },
                quantity: 3000,
                delivered: 3000,
                status: 'Đã giao'
            }
        ]
    },
    {
        id: '003',
        customerName: 'Xí nghiệp Bao bì Đông Nam',
        orderDate: '2026-01-30',
        priority: 'thap',
        status: 'Thiếu (4,200/6,500)',
        items: [
            {
                id: 'item-5',
                productName: 'Thùng carton 3 lớp 90x60x45',
                description: 'Mặt hàng #1',
                quality: {
                    face: 'Kraft liner 150gsm',
                    base: 'Test liner 100gsm',
                    flute: 'Sóng C',
                    assembly: 'Dán keo trắng',
                },
                quantity: 4000,
                delivered: 3200,
                status: 'Thiếu'
            },
            {
                id: 'item-6',
                productName: 'Thùng carton 5 lớp 120x85x35',
                description: 'Mặt hàng #2',
                quality: {
                    face: 'Kraft liner 200gsm',
                    base: 'Test liner 150gsm',
                    flute: 'Sóng B+C',
                    assembly: 'Dán keo nóng',
                },
                quantity: 2500,
                delivered: 1000,
                status: 'Thiếu'
            }
        ]
    }
] as unknown as APIOrder[];

const mockFormulas: Formula[] = [
    {
        id: '1',
        boxType: 'Thùng carton 3 lớp',
        layers: 3,
        sheetSizeFormula: '(Dài + Rộng) × 2 + 40',
        sheetLengthFormula: 'Rộng + Cao × 2 + 30',
        paperQuantityFormula: 'Số lượng thùng',
        description: 'Công thức cho thùng carton 3 lớp tiêu chuẩn',
        example: {
            input: { length: 1200, width: 800, height: 50 },
            output: { sheetSize: 4040, sheetLength: 930, paperQuantity: 5000 },
        },
    },
    {
        id: '2',
        boxType: 'Thùng carton 5 lớp',
        layers: 5,
        sheetSizeFormula: '(Dài + Rộng) × 2 + 50',
        sheetLengthFormula: 'Rộng + Cao × 2 + 40',
        paperQuantityFormula: 'Số lượng thùng',
        description: 'Công thức cho thùng carton 5 lớp có độ bền cao',
        example: {
            input: { length: 1200, width: 800, height: 50 },
            output: { sheetSize: 4050, sheetLength: 940, paperQuantity: 5000 },
        },
    },
    {
        id: '3',
        boxType: 'Thùng carton 7 lớp',
        layers: 7,
        sheetSizeFormula: '(Dài + Rộng) × 2 + 60',
        sheetLengthFormula: 'Rộng + Cao × 2 + 50',
        paperQuantityFormula: 'Số lượng thùng',
        description: 'Công thức cho thùng carton 7 lớp siêu bền',
        example: {
            input: { length: 1500, width: 1000, height: 60 },
            output: { sheetSize: 5060, sheetLength: 1170, paperQuantity: 2000 },
        },
    },
    {
        id: '4',
        boxType: 'Thùng carton đặc biệt',
        layers: 5,
        sheetSizeFormula: '(Dài + Rộng) × 2 + 45',
        sheetLengthFormula: 'Rộng + Cao × 2 + 35',
        paperQuantityFormula: 'Số lượng thùng × 1.1',
        description: 'Công thức đặc biệt với hệ số dự phòng',
        example: {
            input: { length: 1000, width: 700, height: 40 },
            output: { sheetSize: 3445, sheetLength: 815, paperQuantity: 3300 },
        },
    },
];

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const calculatePriority = (deliveryDate: string): 'cao' | 'trung-binh' | 'thap' => {
    const today = new Date();
    const delivery = new Date(deliveryDate);
    const diffTime = delivery.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 3) return 'cao';
    if (diffDays <= 7) return 'trung-binh';
    return 'thap';
};

export const api = {
    getOrders: async (): Promise<APIOrder[]> => {
        try {
            const res = await fetch('/api/orders', {
                headers: {
                    'Accept': 'application/ld+json'
                }
            });
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await res.json();
            
            return data.member.map((item: Record<string, string | number>) => ({
                id: String(item.id),
                manufacturingNumber: String(item.manufacturingNumber),
                customerName: String(item.customerName),
                orderDate: String(item.orderDate),
                deliveryDate: String(item.deliveryDate),
                priority: calculatePriority(String(item.deliveryDate)),
                status: `${item.productListLength} mặt hàng`, // Temporary status based on length
                productListLength: Number(item.productListLength),
                items: [] // Initially empty, products will be fetched separately
            }));
        } catch (error) {
            console.error('Failed to fetch from real API. Falling back to mock data.', error);
            // Fallback for development if backend isn't running
            await delay(300);
            return [...mockOrders];
        }
    },

    getOrder: async (id: string) => {
        await delay(200);
        const order = mockOrders.find((o: APIOrder) => o.id === id);
        if (!order) throw new Error('Order not found');

        const firstItem = order.items && order.items.length > 0 ? order.items[0] : null;
        if (!firstItem) throw new Error('Order item not found');

        return {
            orderId: id,
            customerName: order.customerName,
            productName: firstItem.productName,
            boxType: firstItem.productName.includes('5 lớp') ? 'Thùng carton 5 lớp' : 'Thùng carton 3 lớp',
            totalQuantity: firstItem.quantity,
            delivered: firstItem.delivered,
            remaining: firstItem.quantity - firstItem.delivered,
            deliveries: [
                { stt: 1, date: '2026-02-06', quantity: 2000 },
                { stt: 2, date: '2026-02-08', quantity: firstItem.delivered - 2000 > 0 ? firstItem.delivered - 2000 : 0 },
            ],
            quality: firstItem.quality,
            specifications: {
                length: 1200,
                width: 800,
                height: 50,
                paperQuantity: firstItem.quantity,
                sheetSize: 2400,
                sheetLength: 1600,
            },
        };
    },

    getOrderItems: async (orderId: string): Promise<OrderItem[]> => {
        // Fallback or real API logic can go here
        // For now using mockOrders as local fallback until real /api/orders/{id}/items exists
        try {
            const res = await fetch(`/api/orders/${orderId}/items`);
            if (res.ok) {
                const data = await res.json();
                return data.member || data;
            }
        } catch (e) {
            console.error('Failed to fetch items, using mock', e);
        }
        await delay(200);
        const order = mockOrders.find((o: APIOrder) => o.id === orderId);
        return order?.items || [];
    },

    updateDelivery: async (orderId: string, itemId: string, deliveryQuantity: number) => {
        await delay(400);
        const orderIndex = mockOrders.findIndex((o: APIOrder) => o.id === orderId);
        if (orderIndex > -1) {
            const order = mockOrders[orderIndex];
            if (!order.items) throw new Error('No items in order');
            const itemIndex = order.items.findIndex((i: OrderItem) => i.id === itemId);
            if (itemIndex > -1) {
                const item = order.items[itemIndex];
                const newDelivered = item.delivered + deliveryQuantity;
                order.items[itemIndex] = {
                    ...item,
                    delivered: newDelivered,
                    status: newDelivered >= item.quantity ? 'Đã giao' : 'Thiếu'
                };

                // Update overall status summary
                const totalQuantity = order.items.reduce((sum: number, i: OrderItem) => sum + i.quantity, 0);
                const totalDelivered = order.items.reduce((sum: number, i: OrderItem) => sum + i.delivered, 0);

                if (totalDelivered >= totalQuantity) {
                    order.status = 'Đã giao';
                } else {
                    order.status = `Thiếu (${totalDelivered.toLocaleString()}/${totalQuantity.toLocaleString()})`;
                }

                return order;
            }
            throw new Error('Item not found');
        }
        throw new Error('Order not found');
    },

    getCustomer: async (id: string, name?: string) => {
        await delay(200);
        return {
            name: name || `Khách hàng ${id}`,
            code: id,
            phone: '028 1234 5678',
            email: 'contact@company.vn',
            address: '123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh',
            taxCode: '0123456789',
            qualityPresets: [
                {
                    id: 1,
                    name: 'Thùng xuất khẩu',
                    face: 'Kraft liner 200gsm',
                    base: 'Test liner 150gsm',
                    flute: 'Sóng B + Sóng C (BC)',
                    assembly: 'Dán keo nóng, 4 cánh gấp',
                },
                {
                    id: 2,
                    name: 'Thùng nội địa tiêu chuẩn',
                    face: 'Kraft liner 175gsm',
                    base: 'Test liner 125gsm',
                    flute: 'Sóng B',
                    assembly: 'Dán keo trắng, 4 cánh gấp',
                },
            ],
            productionOrders: [
                {
                    stt: 1,
                    productionOrder: 'LSX001',
                    productCode: 'P001',
                    productionDate: '2026-02-05',
                    deliveryDate: '2026-02-10',
                },
                {
                    stt: 2,
                    productionOrder: 'LSX002',
                    productCode: 'P003',
                    productionDate: '2026-01-25',
                    deliveryDate: '2026-01-30',
                },
                {
                    stt: 3,
                    productionOrder: 'LSX003',
                    productCode: 'P001',
                    productionDate: '2026-02-03',
                    deliveryDate: '2026-02-08',
                },
                {
                    stt: 4,
                    productionOrder: 'LSX004',
                    productCode: 'P006',
                    productionDate: '2026-01-28',
                    deliveryDate: '2026-02-02',
                },
            ]
        };
    },

    getFormulas: async (): Promise<Formula[]> => {
        await delay(200);
        return [...mockFormulas];
    }
};
