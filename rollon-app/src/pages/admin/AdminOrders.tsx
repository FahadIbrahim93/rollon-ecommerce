import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Search,
    MoreHorizontal,
    Eye,
    ArrowLeft,
    Truck,
    CheckCircle,
    Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOrders } from '@/hooks';
import type { Order } from '@/types';
import { toast } from 'sonner';

const AdminSidebar = () => (
    <aside className="w-64 bg-card border-r border-border h-screen fixed left-0 top-0 hidden lg:block">
        <div className="p-6 border-b border-border">
            <Link to="/admin" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">R</span>
                </div>
                <span className="font-bold text-lg">RollON Admin</span>
            </Link>
        </div>
        <nav className="p-4 space-y-1">
            {[
                { name: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
                { name: 'Products', href: '/admin/products', icon: 'Package' },
                { name: 'Orders', href: '/admin/orders', icon: 'ShoppingCart', active: true },
                { name: 'Customers', href: '/admin/customers', icon: 'Users' },
            ].map((link) => (
                <Link
                    key={link.name}
                    to={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${link.active
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                >
                    <span>{link.name}</span>
                </Link>
            ))}
        </nav>
    </aside>
);

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-500',
    processing: 'bg-blue-500/20 text-blue-500',
    shipped: 'bg-purple-500/20 text-purple-500',
    delivered: 'bg-green-500/20 text-green-500',
    cancelled: 'bg-red-500/20 text-red-500',
};

const paymentStatusColors: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-500',
    completed: 'bg-green-500/20 text-green-500',
    failed: 'bg-red-500/20 text-red-500',
    refunded: 'bg-gray-500/20 text-gray-500',
};

export function AdminOrders() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isUpdateStatusDialogOpen, setIsUpdateStatusDialogOpen] = useState(false);
    const [newStatus, setNewStatus] = useState('');

    const { data: orders = [] } = useOrders();

    // Filter orders
    const filteredOrders = orders.filter((order: Order) => {
        const matchesSearch =
            order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.shippingAddress.phone.includes(searchQuery);
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleView = (order: Order) => {
        setSelectedOrder(order);
        setIsViewDialogOpen(true);
    };

    const handleUpdateStatus = (order: Order) => {
        setSelectedOrder(order);
        setNewStatus(order.status);
        setIsUpdateStatusDialogOpen(true);
    };

    const confirmUpdateStatus = () => {
        toast.success(`Order status updated to ${newStatus}`);
        setIsUpdateStatusDialogOpen(false);
    };

    const getTotalRevenue = () => {
        return filteredOrders.reduce((sum: number, order: Order) => sum + order.total, 0);
    };

    const getOrderCountByStatus = (status: string) => {
        return orders.filter((o: Order) => o.status === status).length;
    };

    return (
        <div className="min-h-screen bg-background flex">
            <AdminSidebar />

            <main className="flex-1 lg:ml-64">
                {/* Header */}
                <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link to="/admin">
                                <Button variant="ghost" size="icon">
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                            </Link>
                            <h1 className="text-xl font-semibold">Orders</h1>
                        </div>
                        <Button variant="outline" className="hidden sm:flex">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                    </div>
                </header>

                {/* Content */}
                <div className="p-6">
                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                        <Card>
                            <CardContent className="p-4">
                                <p className="text-sm text-muted-foreground">Total Orders</p>
                                <p className="text-2xl font-bold">{orders.length}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <p className="text-sm text-muted-foreground">Pending</p>
                                <p className="text-2xl font-bold text-yellow-500">{getOrderCountByStatus('pending')}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <p className="text-sm text-muted-foreground">Processing</p>
                                <p className="text-2xl font-bold text-blue-500">{getOrderCountByStatus('processing')}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <p className="text-sm text-muted-foreground">Total Revenue</p>
                                <p className="text-2xl font-bold">৳{getTotalRevenue().toLocaleString()}</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters */}
                    <Card className="mb-6">
                        <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by order number, customer name, or phone..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-4 py-2 bg-background border border-border rounded-lg text-sm"
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Orders Table */}
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Payment</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-10"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOrders.map((order: Order) => (
                                        <TableRow key={order.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{order.orderNumber}</p>
                                                    <p className="text-xs text-muted-foreground">{order.items.length} items</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{order.customerName}</p>
                                                    <p className="text-xs text-muted-foreground">{order.shippingAddress.phone}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(order.createdAt).toLocaleDateString('en-GB', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                ৳{order.total.toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <Badge variant="secondary" className={paymentStatusColors[order.paymentStatus]}>
                                                        {order.paymentStatus}
                                                    </Badge>
                                                    <p className="text-xs text-muted-foreground text-[10px]">{order.paymentMethod}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className={statusColors[order.status]}>
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleView(order)}>
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleUpdateStatus(order)}>
                                                            <Truck className="h-4 w-4 mr-2" />
                                                            Update Status
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </main>

            {/* View Order Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Order Details - {selectedOrder?.orderNumber}</DialogTitle>
                    </DialogHeader>
                    {selectedOrder && (
                        <div className="space-y-6 py-4">
                            {/* Order Status */}
                            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                                <div>
                                    <p className="text-sm text-muted-foreground">Order Status</p>
                                    <Badge variant="secondary" className={statusColors[selectedOrder.status]}>
                                        {selectedOrder.status}
                                    </Badge>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-muted-foreground">Order Date</p>
                                    <p className="font-medium">
                                        {new Date(selectedOrder.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div>
                                <h4 className="font-semibold mb-3">Customer Information</h4>
                                <div className="bg-muted rounded-lg p-4">
                                    <p className="font-medium">{selectedOrder.customerName}</p>
                                    <p className="text-sm text-muted-foreground">{selectedOrder.shippingAddress.phone}</p>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div>
                                <h4 className="font-semibold mb-3">Shipping Address</h4>
                                <div className="bg-muted rounded-lg p-4">
                                    <p>{selectedOrder.shippingAddress.name}</p>
                                    <p>{selectedOrder.shippingAddress.address}</p>
                                    <p>{selectedOrder.shippingAddress.city}</p>
                                    {selectedOrder.shippingAddress.zone && (
                                        <p className="text-sm text-muted-foreground">{selectedOrder.shippingAddress.zone}</p>
                                    )}
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h4 className="font-semibold mb-3">Order Items</h4>
                                <div className="space-y-3">
                                    {selectedOrder.items.map((item, index) => (
                                        <div key={index} className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-medium">৳{(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="border-t border-border pt-4">
                                <div className="flex justify-between mb-2">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>৳{selectedOrder.total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span className="text-green-500">Free</span>
                                </div>
                                <div className="flex justify-between font-semibold text-lg">
                                    <span>Total</span>
                                    <span>৳{selectedOrder.total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                            Close
                        </Button>
                        <Button onClick={() => handleUpdateStatus(selectedOrder!)}>
                            <Truck className="h-4 w-4 mr-2" />
                            Update Status
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Update Status Dialog */}
            <Dialog open={isUpdateStatusDialogOpen} onOpenChange={setIsUpdateStatusDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Order Status</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Label>Select New Status</Label>
                        <Select value={newStatus} onValueChange={setNewStatus}>
                            <SelectTrigger className="mt-2">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsUpdateStatusDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={confirmUpdateStatus} className="bg-gradient-to-r from-orange-500 to-orange-600">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Update Status
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
