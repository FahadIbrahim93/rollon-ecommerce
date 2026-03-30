import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Search,
    MoreHorizontal,
    Eye,
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    ShoppingBag,
    DollarSign,
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
import { useCustomers, useOrders } from '@/hooks';
import type { Customer, Order } from '@/types';

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
                { name: 'Orders', href: '/admin/orders', icon: 'ShoppingCart' },
                { name: 'Customers', href: '/admin/customers', icon: 'Users', active: true },
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

export function AdminCustomers() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

    const { data: customers = [] } = useCustomers();
    const { data: orders = [] } = useOrders();

    // Filter customers
    const filteredCustomers = customers.filter((customer: Customer) => {
        const matchesSearch =
            customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.phone.includes(searchQuery);
        return matchesSearch;
    });

    const handleView = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsViewDialogOpen(true);
    };

    const getCustomerOrders = (customerId: string) => {
        return orders.filter((o: Order) => o.customerId === customerId);
    };

    const getTotalCustomers = () => customers.length;
    const getTotalRevenue = () => customers.reduce((sum: number, c: Customer) => sum + c.totalSpent, 0);
    const getAverageOrderValue = () => {
        const totalOrders = customers.reduce((sum: number, c: Customer) => sum + c.orders, 0);
        return totalOrders > 0 ? Math.round(getTotalRevenue() / totalOrders) : 0;
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
                            <h1 className="text-xl font-semibold">Customers</h1>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="p-6">
                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                        <Card>
                            <CardContent className="p-4">
                                <p className="text-sm text-muted-foreground">Total Customers</p>
                                <p className="text-2xl font-bold">{getTotalCustomers()}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <p className="text-sm text-muted-foreground">Total Revenue</p>
                                <p className="text-2xl font-bold">৳{getTotalRevenue().toLocaleString()}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <p className="text-sm text-muted-foreground">Total Orders</p>
                                <p className="text-2xl font-bold">
                                    {customers.reduce((sum: number, c: Customer) => sum + c.orders, 0)}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <p className="text-sm text-muted-foreground">Avg. Order Value</p>
                                <p className="text-2xl font-bold">৳{getAverageOrderValue().toLocaleString()}</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Search */}
                    <Card className="mb-6">
                        <CardContent className="p-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name, email, or phone..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Customers Table */}
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Orders</TableHead>
                                        <TableHead>Total Spent</TableHead>
                                        <TableHead>Joined</TableHead>
                                        <TableHead className="w-10"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCustomers.map((customer: Customer) => (
                                        <TableRow key={customer.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                                        <span className="text-primary font-medium">
                                                            {customer.name.charAt(0)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{customer.name}</p>
                                                        <p className="text-xs text-muted-foreground">ID: {customer.id}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Mail className="h-3 w-3 text-muted-foreground" />
                                                        {customer.email}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Phone className="h-3 w-3 text-muted-foreground" />
                                                        {customer.phone}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">{customer.orders} orders</Badge>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                ৳{customer.totalSpent.toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(customer.createdAt).toLocaleDateString('en-GB', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleView(customer)}>
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View Details
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

                {/* View Customer Dialog */}
                <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Customer Details</DialogTitle>
                        </DialogHeader>
                        {selectedCustomer && (
                            <div className="space-y-6 py-4">
                                {/* Customer Header */}
                                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                                        <span className="text-primary text-2xl font-medium">
                                            {selectedCustomer.name.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold">{selectedCustomer.name}</h3>
                                        <p className="text-muted-foreground">Customer since {new Date(selectedCustomer.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-muted rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Mail className="h-4 w-4 text-primary" />
                                            <span className="font-medium">Email</span>
                                        </div>
                                        <p>{selectedCustomer.email}</p>
                                    </div>
                                    <div className="bg-muted rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Phone className="h-4 w-4 text-primary" />
                                            <span className="font-medium">Phone</span>
                                        </div>
                                        <p>{selectedCustomer.phone}</p>
                                    </div>
                                </div>

                                {/* Address */}
                                {selectedCustomer.address && (
                                    <div className="bg-muted rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <MapPin className="h-4 w-4 text-primary" />
                                            <span className="font-medium">Address</span>
                                        </div>
                                        <p>{selectedCustomer.address}</p>
                                        {selectedCustomer.city && <p>{selectedCustomer.city}</p>}
                                    </div>
                                )}

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-primary/10 rounded-lg p-4 text-center">
                                        <ShoppingBag className="h-6 w-6 mx-auto mb-2 text-primary" />
                                        <p className="text-2xl font-bold">{selectedCustomer.orders}</p>
                                        <p className="text-sm text-muted-foreground">Total Orders</p>
                                    </div>
                                    <div className="bg-primary/10 rounded-lg p-4 text-center">
                                        <DollarSign className="h-6 w-6 mx-auto mb-2 text-primary" />
                                        <p className="text-2xl font-bold">৳{selectedCustomer.totalSpent.toLocaleString()}</p>
                                        <p className="text-sm text-muted-foreground">Total Spent</p>
                                    </div>
                                </div>

                                {/* Recent Orders */}
                                <div>
                                    <h4 className="font-semibold mb-3">Recent Orders</h4>
                                    <div className="space-y-2">
                                        {getCustomerOrders(selectedCustomer.id).length > 0 ? (
                                            getCustomerOrders(selectedCustomer.id).map((order: Order) => (
                                                <div key={order.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                                    <div>
                                                        <p className="font-medium">{order.orderNumber}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {new Date(order.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-medium">৳{order.total.toLocaleString()}</p>
                                                        <Badge variant="secondary" className="text-xs">
                                                            {order.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-muted-foreground text-center py-4">No orders found</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
}
