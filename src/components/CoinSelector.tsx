import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SUPPORTED_COINS, type Coin } from "@/lib/api";

interface CoinSelectorProps {
  selected: Coin;
  onSelect: (coin: Coin) => void;
  exclude: string;
}

export function CoinSelector({ selected, onSelect, exclude }: CoinSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-glass-border hover:border-primary/50 transition-colors min-w-[130px]"
      >
        <span className="text-lg" style={{ color: selected.color }}>{selected.icon}</span>
        <div className="text-left">
          <div className="text-sm font-display font-medium text-foreground">{selected.name}</div>
          <div className="text-xs text-muted-foreground">{selected.network}</div>
        </div>
        <ChevronDown className="w-4 h-4 text-muted-foreground ml-auto" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 top-full mt-1 w-48 glass-strong p-1 shadow-xl"
          >
            {SUPPORTED_COINS.filter(c => c.code !== exclude).map(coin => (
              <button
                key={coin.code}
                onClick={() => { onSelect(coin); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                  coin.code === selected.code ? 'bg-primary/20' : 'hover:bg-muted/50'
                }`}
              >
                <span className="text-lg" style={{ color: coin.color }}>{coin.icon}</span>
                <div>
                  <div className="text-sm font-display font-medium text-foreground">{coin.name}</div>
                  <div className="text-xs text-muted-foreground">{coin.network}</div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
