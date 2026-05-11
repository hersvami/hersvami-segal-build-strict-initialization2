// src/components/LivePriceChecker.tsx
import React from 'react';
import { getBunningsSearchUrl, categoryToSearchTerm } from '../utils/services/bunningsApi';
import { ExternalLink, RefreshCw, DollarSign } from 'lucide-react';

interface LivePriceCheckerProps {
  categoryName: string;
  itemName?: string;
  currentPrice?: number;
  onPriceUpdate?: (newPrice: number) => void;
}

export const LivePriceChecker: React.FC<LivePriceCheckerProps> = ({ 
  categoryName, 
  itemName,
  currentPrice,
  onPriceUpdate 
}) => {
  const searchTerm = itemName || categoryToSearchTerm[categoryName] || categoryName;
  const searchUrl = getBunningsSearchUrl(searchTerm);

  const handleCheckPrice = () => {
    window.open(searchUrl, '_blank');
    // In a future version with a backend proxy, we would fetch the price here
    // and then call onPriceUpdate(newPrice)
  };

  return (
    <div className="flex items-center gap-2 mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
      <button
        onClick={handleCheckPrice}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-700 bg-white border border-blue-300 rounded hover:bg-blue-100 transition-colors"
        title={`Check live price for ${searchTerm} at Bunnings`}
      >
        <ExternalLink size={14} />
        <span>Check Live Price at Bunnings</span>
      </button>
      
      {currentPrice && (
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <DollarSign size={12} />
          Current Quote: ${currentPrice.toFixed(2)}
        </span>
      )}
      
      <span className="text-xs text-gray-400 italic ml-auto">
        Opens Bunnings search for "{searchTerm}"
      </span>
    </div>
  );
};