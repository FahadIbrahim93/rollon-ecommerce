import type { Order } from '@/types';

export interface MonthlyMetric {
  month: string;
  revenue: number;
  orders: number;
}

export interface CustomerSegment {
  name: string;
  value: number;
  color: string;
}

export interface BestSellerMetric {
  name: string;
  units: number;
  revenue: number;
}

export interface AnalyticsSnapshot {
  monthlyRevenue: MonthlyMetric[];
  segmentedCustomers: CustomerSegment[];
  bestSellers: BestSellerMetric[];
}

const defaultSegments = [
  { label: 'VIP (৳20k+)', min: 20000, color: '#f97316' },
  { label: 'Loyal (৳8k-20k)', min: 8000, color: '#22d3ee' },
  { label: 'Growing (৳2k-8k)', min: 2000, color: '#a855f7' },
  { label: 'New (<৳2k)', min: 0, color: '#10b981' },
];

export function buildAdminAnalytics(orders: Order[], monthsToShow = 6): AnalyticsSnapshot {
  const now = new Date();
  const monthlyMap = new Map<string, { revenue: number; orders: number }>();

  Array.from({ length: monthsToShow }).forEach((_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (monthsToShow - 1 - index), 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthlyMap.set(key, { revenue: 0, orders: 0 });
  });

  const customerSpendMap = new Map<string, number>();
  const itemSalesMap = new Map<string, { units: number; revenue: number }>();

  orders.forEach((order) => {
    const orderDate = new Date(order.createdAt);
    const monthKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
    const monthEntry = monthlyMap.get(monthKey);

    if (monthEntry) {
      monthEntry.revenue += order.total;
      monthEntry.orders += 1;
    }

    customerSpendMap.set(order.customerId, (customerSpendMap.get(order.customerId) ?? 0) + order.total);

    order.items.forEach((item) => {
      const itemEntry = itemSalesMap.get(item.name) || { units: 0, revenue: 0 };
      itemSalesMap.set(item.name, {
        units: itemEntry.units + item.quantity,
        revenue: itemEntry.revenue + item.quantity * item.price,
      });
    });
  });

  const monthlyRevenue = Array.from(monthlyMap.entries()).map(([key, value]) => {
    const [year, month] = key.split('-').map(Number);
    const date = new Date(year, month - 1, 1);

    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      revenue: value.revenue,
      orders: value.orders,
    };
  });

  const segmentSpend = Array.from(customerSpendMap.values());
  const segmentedCustomers = defaultSegments.map((segment, index) => {
    const upperBound = defaultSegments[index - 1]?.min ?? Number.POSITIVE_INFINITY;
    const count = segmentSpend.filter((total) => total >= segment.min && total < upperBound).length;

    return {
      name: segment.label,
      value: count,
      color: segment.color,
    };
  });

  const bestSellers = Array.from(itemSalesMap.entries())
    .map(([name, value]) => ({ name, ...value }))
    .sort((a, b) => (b.units === a.units ? b.revenue - a.revenue : b.units - a.units))
    .slice(0, 5);

  // Fallback Mock Data for Demos when Database is Empty (DEV ONLY)
  const totalRealOrders = monthlyMap.size > 0 ? Array.from(monthlyMap.values()).reduce((sum, v) => sum + v.orders, 0) : 0;
  
  if (totalRealOrders === 0 && import.meta.env.DEV && import.meta.env.MODE !== 'test') {
    return {
      monthlyRevenue: Array.from({ length: monthsToShow }).map((_, i) => {
        const date = new Date(now.getFullYear(), now.getMonth() - (monthsToShow - 1 - i), 1);
        return {
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          revenue: 12500 + (i * 4500) + Math.floor(Math.random() * 2000),
          orders: 45 + (i * 12) + Math.floor(Math.random() * 10),
        };
      }),
      segmentedCustomers: [
        { name: 'VIP (৳20k+)', value: 12, color: '#f97316' },
        { name: 'Loyal (৳8k-20k)', value: 45, color: '#22d3ee' },
        { name: 'Growing (৳2k-8k)', value: 128, color: '#a855f7' },
        { name: 'New (<৳2k)', value: 312, color: '#10b981' }
      ],
      bestSellers: [
        { name: 'Titanium Grinder Pro', units: 145, revenue: 435000 },
        { name: 'Glass Beaker Bong', units: 112, revenue: 336000 },
        { name: 'Richer Kingslim Papers', units: 890, revenue: 178000 },
        { name: 'Activated Carbon Filters', units: 450, revenue: 112500 },
        { name: 'Silicone Storage Jar', units: 230, revenue: 69000 }
      ]
    };
  }

  return { monthlyRevenue, segmentedCustomers, bestSellers };
}
