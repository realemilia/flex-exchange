import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownUp, Loader2, AlertTriangle } from "lucide-react";
import { callFixedFloat, SUPPORTED_COINS, type Coin } from "@/lib/api";
import { CoinSelector } from "./CoinSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface SwapCardProps {
  onOrderCreated: (order: any) => void;
}

export function SwapCard({ onOrderCreated }: SwapCardProps) {
  const [fromCoin, setFromCoin] = useState<Coin>(SUPPORTED_COINS[0]);
  const [toCoin, setToCoin] = useState<Coin>(SUPPORTED_COINS[1]);
  const [amount, setAmount] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [estimatedReceive, setEstimatedReceive] = useState<string | null>(null);
  const [minAmount, setMinAmount] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rateLoading, setRateLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRate = useCallback(async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setEstimatedReceive(null);
      setMinAmount(null);
      return;
    }
    setRateLoading(true);
    setError(null);
    try {
      const result = await callFixedFloat('price', {
        fromCcy: fromCoin.code,
        toCcy: toCoin.code,
        amount: parseFloat(amount),
        direction: 'from',
        type: 'float'
      });
      if (result?.data) {
        setEstimatedReceive(result.data.to?.amount?.toString() || null);
        setMinAmount(result.data.from?.min?.toString() || null);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setRateLoading(false);
    }
  }, [amount, fromCoin.code, toCoin.code]);

  useEffect(() => {
    const timer = setTimeout(fetchRate, 800);
    return () => clearTimeout(timer);
  }, [fetchRate]);

  const handleSwapDirection = () => {
    setFromCoin(toCoin);
    setToCoin(fromCoin);
    setEstimatedReceive(null);
  };

  const handleCreateOrder = async () => {
    if (!amount || !toAddress) {
      toast.error("Please fill in amount and destination address");
      return;
    }
    if (minAmount && parseFloat(amount) < parseFloat(minAmount)) {
      toast.error(`Minimum amount is ${minAmount} ${fromCoin.code}`);
      return;
    }
    setLoading(true);
    try {
      const result = await callFixedFloat('create', {
        fromCcy: fromCoin.code,
        toCcy: toCoin.code,
        toAddress,
        amount: parseFloat(amount),
        direction: 'from',
        type: 'float'
      });
      if (result?.data) {
        onOrderCreated(result.data);
        toast.success("Order created successfully!");
      } else {
        throw new Error(result?.msg || 'Failed to create order');
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="glass glow w-full max-w-md mx-auto p-6 space-y-5 bg-[#05000f] border-0">
      
      <h2 className="text-xl font-display font-semibold text-foreground text-center">
        Swap Crypto
      </h2>

      {/* From */}
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">You Send</label>
        <div className="flex gap-3">
          <CoinSelector selected={fromCoin} onSelect={setFromCoin} exclude={toCoin.code} />
          <Input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 bg-muted/50 border-glass-border text-foreground text-lg font-display" />
          
        </div>
        {minAmount &&
        <p className="text-xs text-muted-foreground flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-accent" />
            Min: {minAmount} {fromCoin.code}
          </p>
        }
      </div>

      {/* Swap Direction */}
      <div className="flex justify-center">
        <motion.button
          whileHover={{ rotate: 180, scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.3 }}
          onClick={handleSwapDirection}
          className="p-2 rounded-full bg-muted/50 border border-glass-border hover:border-primary/50 transition-colors">
          
          <ArrowDownUp className="w-5 h-5 text-primary" />
        </motion.button>
      </div>

      {/* To */}
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">You Receive</label>
        <div className="flex gap-3">
          <CoinSelector selected={toCoin} onSelect={setToCoin} exclude={fromCoin.code} />
          <div className="flex-1 bg-muted/50 border border-glass-border rounded-lg px-4 py-2 flex items-center text-lg font-display text-foreground">
            {rateLoading ?
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /> :

            estimatedReceive || <span className="text-muted-foreground">—</span>
            }
          </div>
        </div>
      </div>

      {/* Destination Address */}
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">
          {toCoin.name} Address ({toCoin.network})
        </label>
        <Input
          placeholder={`Enter ${toCoin.name} address`}
          value={toAddress}
          onChange={(e) => setToAddress(e.target.value)}
          className="bg-muted/50 border-glass-border text-foreground text-sm" />
        
      </div>

      {error &&
      <p className="text-sm text-destructive text-center">{error}</p>
      }

      {/* Create Order */}
      <Button
        onClick={handleCreateOrder}
        disabled={loading || !amount || !toAddress}
        className="w-full gradient-btn text-primary-foreground font-display font-semibold text-base h-12 hover:opacity-90 transition-opacity disabled:opacity-40">
        
        {loading ?
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> :
        null}
        {loading ? "Creating Order..." : "Create Swap"}
      </Button>
    </motion.div>);

}