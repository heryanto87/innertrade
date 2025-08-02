"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Plus, BarChart3, Edit, Trash2, TrendingUp, Target } from "lucide-react"

export default function StrategiesPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newStrategy, setNewStrategy] = useState({
    name: '',
    description: ''
  })

  // Mock data - in real app this would come from tRPC
  const strategies = [
    {
      id: 1,
      name: "Breakout Strategy",
      description: "Trading breakouts from key support and resistance levels with momentum confirmation",
      tradesCount: 45,
      winRate: 72.5,
      avgReturn: 2.3,
      createdAt: "2024-01-01"
    },
    {
      id: 2,
      name: "Scalping EUR/USD",
      description: "Quick scalping trades on EUR/USD during London session using 5-minute charts",
      tradesCount: 128,
      winRate: 65.8,
      avgReturn: 0.8,
      createdAt: "2024-01-10"
    },
    {
      id: 3,
      name: "Swing Trading",
      description: "Medium-term swing trades based on daily chart patterns and trend analysis",
      tradesCount: 23,
      winRate: 78.3,
      avgReturn: 4.2,
      createdAt: "2024-01-15"
    }
  ]

  const handleAddStrategy = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement with tRPC
    console.log('Adding strategy:', newStrategy)
    setNewStrategy({ name: '', description: '' })
    setShowAddForm(false)
  }

  const handleDeleteStrategy = (id: number) => {
    // TODO: Implement with tRPC
    console.log('Deleting strategy:', id)
  }

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
                <h1 className="text-xl font-semibold text-white">Strategies</h1>
                <p className="text-sm text-slate-400">Manage your trading strategies</p>
              </div>
              <Button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Strategy
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 space-y-6 p-6">
            {/* Add Strategy Form */}
            {showAddForm && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Add New Strategy</CardTitle>
                  <CardDescription className="text-slate-400">
                    Create a new trading strategy to categorize your trades
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddStrategy} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-200">Strategy Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Breakout Strategy"
                        value={newStrategy.name}
                        onChange={(e) => setNewStrategy({...newStrategy, name: e.target.value})}
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-400"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-slate-200">Description</Label>
                      <textarea
                        id="description"
                        placeholder="Describe your trading strategy, entry/exit rules, timeframes, etc."
                        value={newStrategy.description}
                        onChange={(e) => setNewStrategy({...newStrategy, description: e.target.value})}
                        className="w-full h-24 px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder:text-slate-400 focus:border-purple-400 focus:outline-none resize-none"
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
                        Create Strategy
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowAddForm(false)}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Strategies Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {strategies.map((strategy) => (
                <Card key={strategy.id} className="bg-slate-800 border-slate-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-purple-400" />
                      <CardTitle className="text-lg text-white">{strategy.name}</CardTitle>
                    </div>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0 text-slate-400 hover:text-red-400"
                        onClick={() => handleDeleteStrategy(strategy.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-slate-300 line-clamp-3">
                        {strategy.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1">
                            <Target className="h-3 w-3 text-slate-400" />
                            <span className="text-xs text-slate-400">Trades</span>
                          </div>
                          <span className="text-lg font-semibold text-white">
                            {strategy.tradesCount}
                          </span>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="h-3 w-3 text-green-400" />
                            <span className="text-xs text-slate-400">Win Rate</span>
                          </div>
                          <span className="text-lg font-semibold text-green-400">
                            {strategy.winRate}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">Avg Return</span>
                        <span className={`text-sm font-medium ${
                          strategy.avgReturn >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {strategy.avgReturn >= 0 ? '+' : ''}{strategy.avgReturn}%
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">Created</span>
                        <span className="text-sm text-white">
                          {new Date(strategy.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        View Trades
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {strategies.length === 0 && (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BarChart3 className="h-12 w-12 text-slate-500 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No strategies yet</h3>
                  <p className="text-slate-400 text-center mb-4">
                    Create your first trading strategy to organize and analyze your trades
                  </p>
                  <Button 
                    onClick={() => setShowAddForm(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Strategy
                  </Button>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}