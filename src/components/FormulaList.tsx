"use client";

import { useState, useEffect } from 'react';
import { api, Formula } from '@/services/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Calculator } from 'lucide-react';



export function FormulaList() {
  const [searchTerm, setSearchTerm] = useState('');

  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchFormulas = async () => {
      try {
        const data = await api.getFormulas();
        if (mounted) {
          setFormulas(data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch formulas', error);
        if (mounted) setLoading(false);
      }
    };
    fetchFormulas();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return <div className="py-12 text-center text-muted-foreground">Đang tải dữ liệu...</div>;
  }

  const filteredFormulas = formulas.filter(formula =>
    formula.boxType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    formula.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Công thức tính kích thước theo thùng</h1>
          <p className="text-muted-foreground">Quản lý công thức tính toán cho từng loại thùng</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
          <Input
            placeholder="Tìm kiếm theo loại thùng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredFormulas.map((formula) => (
          <Card key={formula.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calculator className="size-5 text-primary" />
                  <div>
                    <CardTitle>{formula.boxType}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{formula.description}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {formula.layers} lớp
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-sm text-muted-foreground">CÔNG THỨC TÍNH TOÁN</h4>
                  <div className="space-y-3">
                    <div className="bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-500 p-3 rounded">
                      <div className="text-xs text-muted-foreground mb-1">Khổ giấy (mm)</div>
                      <div className="font-mono font-semibold text-blue-700 dark:text-blue-400">
                        {formula.sheetSizeFormula}
                      </div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-950/30 border-l-4 border-green-500 p-3 rounded">
                      <div className="text-xs text-muted-foreground mb-1">Dài giấy (mm)</div>
                      <div className="font-mono font-semibold text-green-700 dark:text-green-400">
                        {formula.sheetLengthFormula}
                      </div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-950/30 border-l-4 border-purple-500 p-3 rounded">
                      <div className="text-xs text-muted-foreground mb-1">Số lượng chạy giấy</div>
                      <div className="font-mono font-semibold text-purple-700 dark:text-purple-400">
                        {formula.paperQuantityFormula}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-sm text-muted-foreground">VÍ DỤ TÍNH TOÁN</h4>
                  <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                    <div>
                      <div className="text-xs text-muted-foreground mb-2">Đầu vào:</div>
                      <div className="flex gap-4 text-sm">
                        <span>D: <strong>{formula.example.input.length}</strong> mm</span>
                        <span>R: <strong>{formula.example.input.width}</strong> mm</span>
                        <span>C: <strong>{formula.example.input.height}</strong> mm</span>
                      </div>
                    </div>
                    <div className="h-px bg-border"></div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-2">Kết quả:</div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Khổ giấy:</span>
                          <strong className="text-blue-600 dark:text-blue-400">{formula.example.output.sheetSize} mm</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Dài giấy:</span>
                          <strong className="text-green-600 dark:text-green-400">{formula.example.output.sheetLength} mm</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Số lượng:</span>
                          <strong className="text-purple-600 dark:text-purple-400">{formula.example.output.paperQuantity.toLocaleString()}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFormulas.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Không tìm thấy công thức nào
        </div>
      )}
    </div>
  );
}
