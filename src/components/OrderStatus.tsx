import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, CheckCircle2, Clock, ArrowLeftRight, XCircle, Loader2, ArrowLeft } from "lucide-react";
import { callFixedFloat } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface OrderStatusProps {
  order: any;
  onBack: () => void;
}

const STATUS_MAP: Record<string, { label: string; icon: any; color: string }> = {
  NEW: { label: "Waiting for Deposit", icon: Clock, color: "text-secondary" },
  PENDING: { label: "Confirming", icon: Loader2, color: "text-secondary" },
  EXCHANGE: { label: "Exchanging", icon: ArrowLeftRight, color: "text-primary" },
  WITHDRAW: { label: "Sending", icon: Loader2, color: "text-primary" },
  DONE: { label: "Completed", icon: CheckCircle2, color: "text-green-400" },
  EXPIRED: { label: "Expired", icon: XCircle, color: "text-destructive" },
  EMERGENCY: { label: "Failed", icon: XCircle, color: "text-destructive" },
};

export function OrderStatus({ order: initialOrder, onBack }: OrderStatusProps) {
  const [order, setOrder] = useState(initialOrder);
  const [polling, setPolling] = useState(true);

  useEffect(() => {
    if (!polling) return;
    const interval = setInterval(async () => {
      try {
        const result = await callFixedFloat('order', {
          id: order.id,
          token: order.token,
        });
        if (result?.data) {
          setOrder(result.data);
          const status = result.data.status;
          if (status === 'DONE' || status === 'EXPIRED' || status === 'EMERGENCY') {
            setPolling(false);
          }
        }
      } catch (err) {
        console.error('Poll error:', err);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [order.id, order.token, polling]);

  const status = STATUS_MAP[order.status] || STATUS_MAP.NEW;
  const StatusIcon = status.icon;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass glow w-full max-w-md mx-auto p-6 space-y-5"
    >
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> New Swap
      </button>

      <h2 className="text-xl font-display font-semibold text-foreground text-center">
        Order Status
      </h2>

      {/* Status Badge */}
      <div className="flex justify-center">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-glass-border ${status.color}`}>
          <StatusIcon className={`w-5 h-5 ${order.status === 'PENDING' || order.status === 'WITHDRAW' ? 'animate-spin' : ''}`} />
          <span className="font-display font-medium">{status.label}</span>
        </div>
      </div>

      {/* Order ID */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">Order ID</p>
        <p className="text-sm font-display text-foreground">{order.id}</p>
      </div>

      {/* Deposit Info */}
      {order.from?.address && (
        <div className="space-y-2 p-4 rounded-xl bg-muted/30 border border-glass-border">
          <p className="text-sm text-muted-foreground">Send exactly:</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-display font-semibold text-foreground">
              {order.from.amount} {order.from.code}
            </span>
            <button onClick={() => copyToClipboard(order.from.amount)} className="text-muted-foreground hover:text-foreground">
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">To address:</p>
          <div className="flex items-center gap-2">
            <p className="text-xs font-mono text-foreground break-all flex-1">{order.from.address}</p>
            <button onClick={() => copyToClipboard(order.from.address)} className="text-muted-foreground hover:text-foreground shrink-0">
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Receive Info */}
      <div className="p-4 rounded-xl bg-muted/30 border border-glass-border">
        <p className="text-sm text-muted-foreground">You will receive:</p>
        <p className="text-lg font-display font-semibold text-foreground">
          ~{order.to?.amount} {order.to?.code}
        </p>
      </div>

      {polling && (
        <p className="text-xs text-center text-muted-foreground animate-pulse">
          Auto-refreshing every 10 seconds...
        </p>
      )}
    </motion.div>
  );
}
