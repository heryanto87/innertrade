"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Plus, Wallet, Edit, Trash2, DollarSign } from "lucide-react"

export default function AccountsPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAccount, setNewAccount] = useState({
    name: '',
    balance: '',
    positionUnit: 'USD'
  })

  // Mock data - in real app this would come from tRPC
  const accounts = [
    {
      id: 1,
      name: "Main Trading Account",
      balance: 15420.50,
      positionUnit: "USD",
      createdAt: "2024-01-01",
      tradesCount: 89
    },
    {
      id: 2,
      name: "Demo Account",
      balance: 10000.00,
      positionUnit: "USD",
      createdAt: "2024-01-15",
      tradesCount: 58
    }
  ]

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement with tRPC
    console.log('Adding account:', newAccount)
    setNewAccount({ name: '', balance: '', positionUnit: 'USD' })
    setShowAddForm(false)
  }

  const handleDeleteAccount = (id: number) => {
    // TODO: Implement with tRPC
    console.log('Deleting account:', id)
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
                <h1 className="text-xl font-semibold text-white">Accounts</h1>
                <p className="text-sm text-slate-400">Manage your trading accounts</p>
              </div>
              <Button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Account
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 space-y-6 p-6">
            {/* Add Account Form */}
            {showAddForm && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Add New Account</CardTitle>
                  <CardDescription className="text-slate-400">
                    Create a new trading account to track your trades
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddAccount} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-slate-200">Account Name</Label>
                        <Input
                          id="name"
                          placeholder="e.g., Main Trading Account"
                          value={newAccount.name}
                          onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
                          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-400"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="balance" className="text-slate-200">Initial Balance</Label>
                        <Input
                          id="balance"
                          type="number"
                          step="0.01"
                          placeholder="10000.00"
                          value={newAccount.balance}
                          onChange={(e) => setNewAccount({...newAccount, balance: e.target.value})}
                          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-400"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="positionUnit" className="text-slate-200">Position Unit</Label>
                      <select
                        id="positionUnit"
                        value={newAccount.positionUnit}
                        onChange={(e) => setNewAccount({...newAccount, positionUnit: e.target.value})}
                        className="w-full h-9 px-3 py-1 bg-slate-700 border border-slate-600 rounded-md text-white focus:border-purple-400 focus:outline-none"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="JPY">JPY</option>
                        <option value="lots">Lots</option>
                        <option value="units">Units</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
                        Create Account
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

            {/* Accounts Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {accounts.map((account) => (
                <Card key={account.id} className="bg-slate-800 border-slate-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center space-x-2">
                      <Wallet className="h-5 w-5 text-purple-400" />
                      <CardTitle className="text-lg text-white">{account.name}</CardTitle>
                    </div>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0 text-slate-400 hover:text-red-400"
                        onClick={() => handleDeleteAccount(account.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">Balance</span>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4 text-green-400" />
                          <span className="text-lg font-semibold text-white">
                            {account.balance.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">Position Unit</span>
                        <span className="text-sm text-white">{account.positionUnit}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">Total Trades</span>
                        <span className="text-sm text-white">{account.tradesCount}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">Created</span>
                        <span className="text-sm text-white">
                          {new Date(account.createdAt).toLocaleDateString()}
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
            {accounts.length === 0 && (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Wallet className="h-12 w-12 text-slate-500 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No accounts yet</h3>
                  <p className="text-slate-400 text-center mb-4">
                    Create your first trading account to start tracking your trades
                  </p>
                  <Button 
                    onClick={() => setShowAddForm(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Account
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