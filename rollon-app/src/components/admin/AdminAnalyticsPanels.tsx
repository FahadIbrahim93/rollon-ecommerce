import { Trophy } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AnalyticsSnapshot } from '@/lib/adminAnalytics';

interface AdminAnalyticsPanelsProps {
  analytics: AnalyticsSnapshot;
}

export function AdminAnalyticsPanels({ analytics }: AdminAnalyticsPanelsProps) {
  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 bg-white/[0.04] border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Revenue & Orders Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.monthlyRevenue}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1f" />
                <XAxis dataKey="month" stroke="#ffffff99" />
                <YAxis yAxisId="left" stroke="#ffffff99" />
                <YAxis yAxisId="right" orientation="right" stroke="#ffffff99" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172acc', border: '1px solid #ffffff26', borderRadius: '0.75rem' }}
                />
                <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#f97316" fillOpacity={1} fill="url(#colorRevenue)" />
                <Bar yAxisId="right" dataKey="orders" fill="#22d3ee" radius={[6, 6, 0, 0]} maxBarSize={32} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.04] border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Customer Segments</CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex flex-col gap-4">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.segmentedCustomers}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    {analytics.segmentedCustomers.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172acc', border: '1px solid #ffffff26', borderRadius: '0.75rem' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="space-y-2">
              {analytics.segmentedCustomers.map((segment) => (
                <li key={segment.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-white/80">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: segment.color }} />
                    {segment.name}
                  </span>
                  <span className="font-semibold text-white">{segment.value}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/[0.04] border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Best Selling Products
          </CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={analytics.bestSellers} margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1f" />
              <XAxis type="number" stroke="#ffffff99" />
              <YAxis type="category" dataKey="name" width={140} stroke="#ffffff99" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172acc', border: '1px solid #ffffff26', borderRadius: '0.75rem' }}
              />
              <Bar dataKey="units" fill="#f97316" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  );
}
