import { supabase } from "@/integrations/supabase/client";

export async function callFixedFloat(method: string, data?: Record<string, unknown>) {
  const { data: result, error } = await supabase.functions.invoke('fixedfloat-proxy', {
    body: { method, data },
  });

  if (error) throw new Error(error.message || 'API call failed');
  if (result?.code && result.code !== 0) {
    throw new Error(result.msg || 'FixedFloat API error');
  }
  return result;
}

export const SUPPORTED_COINS = [
  { code: 'BTC', name: 'Bitcoin', network: 'BTC', icon: '₿', color: '#F7931A' },
  { code: 'ETH', name: 'Ethereum', network: 'ETH', icon: 'Ξ', color: '#627EEA' },
  { code: 'USDT', name: 'USDT', network: 'ERC20', icon: '₮', color: '#53AE94' },
  { code: 'USDTTRC', name: 'USDT', network: 'TRC20', icon: '₮', color: '#53AE94' },
  { code: 'LTC', name: 'Litecoin', network: 'LTC', icon: 'Ł', color: '#497ED1' },
  { code: 'SOL', name: 'Solana', network: 'SOL', icon: '◎', color: '#A364FC' },
];

export type Coin = typeof SUPPORTED_COINS[number];
