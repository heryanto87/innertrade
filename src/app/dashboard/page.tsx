"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { BarChart3, DollarSign, TrendingDown, TrendingUp, Plus } from "lucide-react"

export default function DashboardPage() {
  // Mock data - in real app this would come from tRPC
  const stats = {
    totalBalance: 25420.50,
    totalPnL: 2340.75,
    winRate: 68.5,
    totalTrades: 147
  }

  const recentTrades = [
    {
      id: 1,
      symbol: "EURUSD",
      type: "Long",
      pnl: 125.50,
      date: "2024-01-15",
      status: "closed"
    },
    {
      id: 2,
      symbol: "GBPJPY",
      type: "Short",
      pnl: -45.20,
      date: "2024-01-14",
      status: "closed"
    },
    {
      id: 3,
      symbol: "USDJPY",
      type: "Long",
      pnl: 0,
      date: "2024-01-14",
      status: "open"
    }
  ]

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-slate-900">
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-700 px-4">
            <SidebarTrigger className="text-slate-300 hover:text-white" />
            <div className="flex flex-1 items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-white">Dashboard</h1>
                <p className="text-sm text-slate-400">Welcome back to your trading journal</p>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Trade
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 space-y-6 p-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-200">Total Balance</CardTitle>
                  <DollarSign className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">${stats.totalBalance.toLocaleString()}</div>
                  <p className="text-xs text-slate-400">Across all accounts</p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-200">Total P&L</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${
                    stats.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    ${stats.totalPnL >= 0 ? '+' : ''}${stats.totalPnL.toLocaleString()}
                  </div>
                  <p className="text-xs text-slate-400">This month</p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-200">Win Rate</CardTitle>
                  <BarChart3 className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.winRate}%</div>
                  <p className="text-xs text-slate-400">Last 30 trades</p>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-200">Total Trades</CardTitle>
                  <TrendingUp className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.totalTrades}</div>
                  <p className="text-xs text-slate-400">All time</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Trades */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Trades</CardTitle>
                  <CardDescription className="text-slate-400">
                    Your latest trading activity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentTrades.map((trade) => (
                      <div key={trade.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            trade.status === 'open' ? 'bg-blue-400' : 
                            trade.pnl >= 0 ? 'bg-green-400' : 'bg-red-400'
                          }`} />
                          <div>
                            <p className="text-sm font-medium text-white">{trade.symbol}</p>
                            <p className="text-xs text-slate-400">{trade.type} • {trade.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {trade.status === 'open' ? (
                            <span className="text-sm text-blue-400">Open</span>
                          ) : (
                            <span className={`text-sm font-medium ${
                              trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              ${trade.pnl >= 0 ? '+' : ''}{trade.pnl}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Chart Placeholder */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Performance Overview</CardTitle>
                  <CardDescription className="text-slate-400">
                    Your trading performance this month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-600 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-slate-500 mx-auto mb-2" />
                      <p className="text-slate-500">Performance chart coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}