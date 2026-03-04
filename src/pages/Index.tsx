import { useState } from "react";
import { motion } from "framer-motion";
import { SwapCard } from "@/components/SwapCard";
import { OrderStatus } from "@/components/OrderStatus";

const Index = () => {
  const [order, setOrder] = useState<any>(null);

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent/10 blur-[120px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] rounded-full bg-secondary/8 blur-[100px] animate-pulse-glow" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="p-6">
          <h1 className="text-2xl font-display font-bold gradient-text">Flex Exchange</h1>
        </header>

        {/* Main */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
          {/* Hero */}
          {!order && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-3">
                Swap Crypto <span className="gradient-text">Instantly</span>
              </h2>
              <p className="text-lg text-muted-foreground font-body">
                Secure. Fast. Non-Custodial.
              </p>
            </motion.div>
          )}

          {order ? (
            <OrderStatus order={order} onBack={() => setOrder(null)} />
          ) : (
            <SwapCard onOrderCreated={setOrder} />
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
