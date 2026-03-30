import { lazy, Suspense, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  LogOut,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PackageCheck,
  UserPlus,
  Search,
  Bell,
  Menu,
  ChevronRight,
  MoreHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useProducts, useOrders, useCustomers } from '@/hooks';
import type { Order } from '@/types';
import { FadeIn } from '@/components/animations/FadeIn';
import { buildAdminAnalytics } from '@/lib/adminAnalytics';
import { isAdminLinkActive } from '@/lib/adminNav';

const AdminAnalyticsPanels = lazy(() =>
  import('@/components/admin/AdminAnalyticsPanels').then((module) => ({ default: module.AdminAnalyticsPanels })),
);

const sidebarLinks = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { name: 'Products', icon: Package, href: '/admin/products' },
  { name: 'Orders', icon: ShoppingCart, href: '/admin/orders' },
  { name: 'Customers', icon: Users, href: '/admin/customers' },
  { name: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
  { name: 'Settings', icon: Settings, href: '/admin/settings' },
];

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-200 border-yellow-500/20',
    processing: 'bg-blue-500/20 text-blue-200 border-blue-500/20',
    shipped: 'bg-purple-500/20 text-purple-200 border-purple-500/20',
    delivered: 'bg-green-500/20 text-green-200 border-green-500/20',
    cancelled: 'bg-red-500/20 text-red-200 border-red-500/20',
  };
  return colors[status] || 'bg-gray-500/20 text-gray-200 border-gray-500/20';
};

export function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { data: products = [] } = useProducts();
  const { data: orders = [] } = useOrders();
  const { data: customers = [] } = useCustomers();
  const analytics = buildAdminAnalytics(orders);

  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const previousRevenue = analytics.monthlyRevenue.at(-2)?.revenue ?? 0;
  const currentRevenue = analytics.monthlyRevenue.at(-1)?.revenue ?? 0;
  const revenueDelta = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

  const stats = [
    {
      title: 'Total Sales',
      value: `৳${totalSales.toLocaleString()}`,
      change: `${revenueDelta >= 0 ? '+' : ''}${revenueDelta.toFixed(1)}%`,
      trend: revenueDelta >= 0 ? 'up' : 'down',
      icon: DollarSign,
      color: 'from-green-400/80 to-emerald-500/80',
    },
    {
      title: 'Total Orders',
      value: orders.length.toString(),
      change: `+${analytics.monthlyRevenue.at(-1)?.orders ?? 0} this month`,
      trend: 'up',
      icon: ShoppingCart,
      color: 'from-cyan-500/80 to-blue-500/80',
    },
    {
      title: 'Products',
      value: products.length.toString(),
      change: 'Catalog active',
      trend: 'up',
      icon: PackageCheck,
      color: 'from-violet-500/80 to-fuchsia-500/80',
    },
    {
      title: 'Customers',
      value: customers.length.toString(),
      change: `${analytics.segmentedCustomers.reduce((sum, segment) => sum + segment.value, 0)} active buyers`,
      trend: 'up',
      icon: UserPlus,
      color: 'from-orange-400/80 to-amber-500/80',
    },
  ];

  return (
    <div className="min-h-screen bg-[#06070a] text-white flex">
      <aside className="hidden lg:flex w-64 flex-col bg-white/[0.03] border-r border-white/10 fixed h-full backdrop-blur-2xl">
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-bold text-lg">RollON Admin</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isAdminLinkActive(location.pathname, link.href)
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
            >
              <link.icon className="h-5 w-5" />
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-red-300 hover:text-red-200 hover:bg-red-500/20"
            onClick={() => navigate('/')}
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>

      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-[#0d1119] border-white/10 text-white">
          <div className="p-6 border-b border-white/10">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="font-bold text-lg">RollON Admin</span>
            </Link>
          </div>
          <nav className="p-4 space-y-1">
            {sidebarLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isAdminLinkActive(location.pathname, link.href)
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <link.icon className="h-5 w-5" />
                <span>{link.name}</span>
              </Link>
            ))}
          </nav>
          <div className="mt-auto p-4 border-t border-white/10">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-red-300 hover:bg-red-500/20"
              onClick={() => {
                setIsSidebarOpen(false);
                navigate('/');
              }}
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </SheetContent>

        <main className="flex-1 lg:ml-64">
          <header className="sticky top-0 z-30 bg-[#06070a]/95 backdrop-blur border-b border-white/10 px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden text-white" aria-label="Open admin navigation menu">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <h1 className="text-xl font-semibold hidden sm:block">Dashboard Intelligence</h1>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative hidden sm:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                  <Input placeholder="Search analytics..." className="pl-10 w-64 bg-white/5 border-white/15 text-white" />
                </div>

                <Button variant="ghost" size="icon" className="relative text-white" aria-label="Open notifications panel">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </Button>

                <div className="w-9 h-9 rounded-full bg-primary/80 flex items-center justify-center">
                  <span className="text-black font-semibold text-sm">A</span>
                </div>
              </div>
            </div>
          </header>

          <div className="p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <FadeIn key={stat.title} delay={index * 0.1}>
                  <Card className="bg-white/[0.04] border-white/10 backdrop-blur-xl">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-white/70">{stat.title}</p>
                          <p className="text-2xl font-bold mt-1">{stat.value}</p>
                          <div className="flex items-center gap-1 mt-2">
                            {stat.trend === 'up' ? (
                              <TrendingUp className="h-4 w-4 text-green-300" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-300" />
                            )}
                            <span className={`text-sm ${stat.trend === 'up' ? 'text-green-300' : 'text-red-300'}`}>
                              {stat.change}
                            </span>
                          </div>
                        </div>
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                          <stat.icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </div>

            <FadeIn delay={0.3}>
              <Suspense
                fallback={
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <Card className="xl:col-span-2 bg-white/[0.04] border-white/10 backdrop-blur-xl">
                      <CardContent className="h-80 animate-pulse" />
                    </Card>
                    <Card className="bg-white/[0.04] border-white/10 backdrop-blur-xl">
                      <CardContent className="h-80 animate-pulse" />
                    </Card>
                  </div>
                }
              >
                <AdminAnalyticsPanels analytics={analytics} />
              </Suspense>
            </FadeIn>

            <div className="grid grid-cols-1 gap-6">
              <FadeIn delay={0.4}>
                <Card className="bg-white/[0.04] border-white/10 backdrop-blur-xl">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Orders</CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/admin/orders">
                        View All
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="w-10"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.slice(0, 5).map((order: Order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.orderNumber}</TableCell>
                            <TableCell>{order.customerName}</TableCell>
                            <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>৳{order.total.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" aria-label={`More actions for order ${order.orderNumber}`}>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </FadeIn>
            </div>
          </div>
        </main>
      </Sheet>
    </div>
  );
}
