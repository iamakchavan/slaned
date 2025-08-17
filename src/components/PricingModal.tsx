import React, { useState, useEffect } from 'react';
import { X, Check, Crown } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from '../contexts/ThemeContext';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [isYearly, setIsYearly] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-[60] flex items-center justify-center p-4 transition-all duration-300 ease-out ${
        isVisible ? 'bg-black/30 backdrop-blur-md' : 'bg-black/0'
      }`}
      onClick={handleClose}
    >
      <div 
        className={`w-full max-w-4xl bg-white dark:bg-[#2c2c2e] rounded-sm shadow-lg transition-all duration-300 ease-out overflow-y-auto max-h-[90vh] ${
          isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200/60 dark:border-[#3a3a3c]">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white">Choose your plan</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="w-8 h-8 hover:bg-gray-100/60 dark:hover:bg-[#3a3a3c] rounded-sm"
          >
            <X className="w-4 h-4 text-gray-400 dark:text-[#a1a1a6]" />
          </Button>
        </div>

        {/* Pricing Toggle */}
        <div className="p-4 md:p-6 pb-4">
          <div className="flex items-center justify-center">
            <div className="bg-gray-100/60 dark:bg-[#1c1c1e] rounded-sm p-1 flex">
              <button
                onClick={() => setIsYearly(false)}
                className={`px-4 py-2 text-sm font-medium rounded-sm transition-all ${
                  !isYearly 
                    ? 'bg-black dark:bg-white text-white dark:text-gray-900 shadow-sm' 
                    : 'text-gray-600 dark:text-[#a1a1a6] hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`px-4 py-2 text-sm font-medium rounded-sm transition-all ${
                  isYearly 
                    ? 'bg-black dark:bg-white text-white dark:text-gray-900 shadow-sm' 
                    : 'text-gray-600 dark:text-[#a1a1a6] hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Yearly
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="p-4 md:p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Free Plan */}
            <div className="border border-gray-200/60 dark:border-[#3a3a3c] rounded-sm p-4 md:p-6">
                              <div className="text-center mb-4 md:mb-6">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">Free</h3>
                  <p className="text-sm text-gray-600 dark:text-[#a1a1a6] mb-3 md:mb-4">For the focused.</p>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    $0<span className="text-base md:text-lg font-normal text-gray-600 dark:text-[#a1a1a6]">/month</span>
                  </div>
                </div>

              <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                <div className="flex items-center gap-2 md:gap-3">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-[#a1a1a6]">Upto 100 tasks</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-[#a1a1a6]">Offline access</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-[#a1a1a6]">PWA support</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-[#a1a1a6]">Updates & support</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-[#a1a1a6]">Limited AI assistance</span>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full border-gray-200/60 dark:border-[#3a3a3c] text-gray-900 dark:text-white hover:bg-gray-50/60 dark:hover:bg-[#3a3a3c] rounded-sm"
              >
                Get Started
              </Button>
              
              <p className="text-xs text-gray-500 dark:text-[#6d6d70] text-center mt-3">
                → No card. No noise. Just start.
              </p>
            </div>

            {/* PRO Plan */}
            <div className="border border-gray-200/60 dark:border-[#3a3a3c] rounded-sm p-4 md:p-6 relative">
              {isYearly && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 dark:bg-blue-500 text-white text-xs px-3 py-1 rounded-sm font-medium">
                    Save 30%
                  </span>
                </div>
              )}
              
              <div className="text-center mb-4 md:mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">PRO</h3>
                <p className="text-sm text-gray-600 dark:text-[#a1a1a6] mb-3 md:mb-4">For those who build with intent.</p>
                {isYearly && (
                  <p className="text-xs text-gray-600 dark:text-[#a1a1a6] mb-2">Or $126/year — save 30%</p>
                )}
                <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  ${isYearly ? '10.50' : '15'}<span className="text-base md:text-lg font-normal text-gray-600 dark:text-[#a1a1a6]">/month</span>
                </div>
              </div>

              <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                <div className="flex items-center gap-2 md:gap-3">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-[#a1a1a6]">Unlimited tasks</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-[#a1a1a6]">Offline access</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-[#a1a1a6]">Power features (shortcuts, filters)</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-[#a1a1a6]">Full AI task assist</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-[#a1a1a6]">Priority updates & support</span>
                </div>
              </div>

              <Button 
                className="w-full bg-black dark:bg-white text-white dark:text-gray-900 hover:bg-gray-900 dark:hover:bg-gray-200 rounded-sm"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Pro
              </Button>
              
              <p className="text-xs text-gray-500 dark:text-[#6d6d70] text-center mt-3">
                → One plan. One price. All in.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 