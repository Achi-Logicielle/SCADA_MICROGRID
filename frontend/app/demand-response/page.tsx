'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { toast } from 'sonner';

export default function DemandResponsePage() {
  const [loading, setLoading] = useState(false);
  const [buyAmount, setBuyAmount] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [gridStatus, setGridStatus] = useState<any>(null);

  const handleBuyFromGrid = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/grid/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(buyAmount),
          price: parseFloat(buyPrice),
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error buying power from grid');
    } finally {
      setLoading(false);
    }
  };

  const handleSellToGrid = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/grid/sell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(sellAmount),
          price: parseFloat(sellPrice),
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error selling power to grid');
    } finally {
      setLoading(false);
    }
  };

  const handleGetGridStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/grid/status');
      const data = await response.json();
      if (data.success) {
        setGridStatus(data);
        toast.success('Grid status updated');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error getting grid status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Demand Response Control</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Buy from Grid Card */}
        <Card>
          <CardHeader>
            <CardTitle>Buy from Grid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="buyAmount">Amount (kWh)</Label>
                <Input
                  id="buyAmount"
                  type="number"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(e.target.value)}
                  placeholder="Enter amount in kWh"
                />
              </div>
              <div>
                <Label htmlFor="buyPrice">Price ($/kWh)</Label>
                <Input
                  id="buyPrice"
                  type="number"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                  placeholder="Enter price per kWh"
                />
              </div>
              <Button 
                onClick={handleBuyFromGrid} 
                disabled={loading || !buyAmount || !buyPrice}
                className="w-full"
              >
                {loading ? 'Processing...' : 'Buy from Grid'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sell to Grid Card */}
        <Card>
          <CardHeader>
            <CardTitle>Sell to Grid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="sellAmount">Amount (kWh)</Label>
                <Input
                  id="sellAmount"
                  type="number"
                  value={sellAmount}
                  onChange={(e) => setSellAmount(e.target.value)}
                  placeholder="Enter amount in kWh"
                />
              </div>
              <div>
                <Label htmlFor="sellPrice">Price ($/kWh)</Label>
                <Input
                  id="sellPrice"
                  type="number"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(e.target.value)}
                  placeholder="Enter price per kWh"
                />
              </div>
              <Button 
                onClick={handleSellToGrid} 
                disabled={loading || !sellAmount || !sellPrice}
                className="w-full"
              >
                {loading ? 'Processing...' : 'Sell to Grid'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid Status Card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Grid Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={handleGetGridStatus} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Loading...' : 'Get Grid Status'}
            </Button>
            {gridStatus && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <pre className="text-sm">
                  {JSON.stringify(gridStatus, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 