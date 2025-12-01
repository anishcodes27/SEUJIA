/**
 * Shipping Calculator
 * Calculate shipping charges based on location (state/district) and order value
 */

export interface ShippingRate {
  state: string;
  baseCharge: number;
  codCharge: number; // Additional charge for COD
  freeShippingThreshold?: number; // Order value for free shipping
}

// Define shipping rates by state
export const SHIPPING_RATES: ShippingRate[] = [
  // Local state - lowest charges
  {
    state: 'Assam',
    baseCharge: 40,
    codCharge: 30,
    freeShippingThreshold: 1000,
  },
  
  // Neighboring states - moderate charges
  {
    state: 'West Bengal',
    baseCharge: 60,
    codCharge: 40,
    freeShippingThreshold: 1500,
  },
  {
    state: 'Meghalaya',
    baseCharge: 50,
    codCharge: 35,
    freeShippingThreshold: 1200,
  },
  {
    state: 'Arunachal Pradesh',
    baseCharge: 80,
    codCharge: 50,
    freeShippingThreshold: 1500,
  },
  {
    state: 'Nagaland',
    baseCharge: 70,
    codCharge: 45,
    freeShippingThreshold: 1500,
  },
  {
    state: 'Manipur',
    baseCharge: 75,
    codCharge: 45,
    freeShippingThreshold: 1500,
  },
  {
    state: 'Mizoram',
    baseCharge: 85,
    codCharge: 50,
    freeShippingThreshold: 1500,
  },
  {
    state: 'Tripura',
    baseCharge: 65,
    codCharge: 40,
    freeShippingThreshold: 1200,
  },
  {
    state: 'Sikkim',
    baseCharge: 70,
    codCharge: 45,
    freeShippingThreshold: 1500,
  },
  
  // North Indian states
  {
    state: 'Delhi',
    baseCharge: 80,
    codCharge: 50,
    freeShippingThreshold: 2000,
  },
  {
    state: 'Haryana',
    baseCharge: 80,
    codCharge: 50,
    freeShippingThreshold: 2000,
  },
  {
    state: 'Punjab',
    baseCharge: 85,
    codCharge: 55,
    freeShippingThreshold: 2000,
  },
  {
    state: 'Uttar Pradesh',
    baseCharge: 75,
    codCharge: 50,
    freeShippingThreshold: 1800,
  },
  {
    state: 'Uttarakhand',
    baseCharge: 80,
    codCharge: 50,
    freeShippingThreshold: 1800,
  },
  {
    state: 'Himachal Pradesh',
    baseCharge: 90,
    codCharge: 55,
    freeShippingThreshold: 2000,
  },
  {
    state: 'Jammu and Kashmir',
    baseCharge: 100,
    codCharge: 60,
    freeShippingThreshold: 2000,
  },
  {
    state: 'Rajasthan',
    baseCharge: 85,
    codCharge: 55,
    freeShippingThreshold: 2000,
  },
  
  // East Indian states
  {
    state: 'Bihar',
    baseCharge: 70,
    codCharge: 45,
    freeShippingThreshold: 1500,
  },
  {
    state: 'Jharkhand',
    baseCharge: 75,
    codCharge: 45,
    freeShippingThreshold: 1500,
  },
  {
    state: 'Odisha',
    baseCharge: 80,
    codCharge: 50,
    freeShippingThreshold: 1800,
  },
  
  // West Indian states
  {
    state: 'Maharashtra',
    baseCharge: 90,
    codCharge: 55,
    freeShippingThreshold: 2000,
  },
  {
    state: 'Gujarat',
    baseCharge: 95,
    codCharge: 60,
    freeShippingThreshold: 2000,
  },
  {
    state: 'Goa',
    baseCharge: 100,
    codCharge: 60,
    freeShippingThreshold: 2000,
  },
  {
    state: 'Madhya Pradesh',
    baseCharge: 85,
    codCharge: 55,
    freeShippingThreshold: 1800,
  },
  {
    state: 'Chhattisgarh',
    baseCharge: 80,
    codCharge: 50,
    freeShippingThreshold: 1800,
  },
  
  // South Indian states
  {
    state: 'Karnataka',
    baseCharge: 100,
    codCharge: 60,
    freeShippingThreshold: 2500,
  },
  {
    state: 'Tamil Nadu',
    baseCharge: 105,
    codCharge: 65,
    freeShippingThreshold: 2500,
  },
  {
    state: 'Kerala',
    baseCharge: 110,
    codCharge: 65,
    freeShippingThreshold: 2500,
  },
  {
    state: 'Andhra Pradesh',
    baseCharge: 100,
    codCharge: 60,
    freeShippingThreshold: 2500,
  },
  {
    state: 'Telangana',
    baseCharge: 100,
    codCharge: 60,
    freeShippingThreshold: 2500,
  },
  {
    state: 'Puducherry',
    baseCharge: 110,
    codCharge: 65,
    freeShippingThreshold: 2500,
  },
];

// Default shipping rate for states not in the list
const DEFAULT_SHIPPING_RATE: ShippingRate = {
  state: 'Other',
  baseCharge: 100,
  codCharge: 60,
  freeShippingThreshold: 2000,
};

interface CalculateShippingParams {
  state: string;
  orderValue: number;
  isCOD: boolean;
}

interface ShippingCalculation {
  baseCharge: number;
  codCharge: number;
  totalCharge: number;
  isFreeShipping: boolean;
  freeShippingThreshold?: number;
  savedAmount?: number;
}

/**
 * Calculate shipping charges based on location and payment method
 */
export function calculateShipping({
  state,
  orderValue,
  isCOD,
}: CalculateShippingParams): ShippingCalculation {
  // Find shipping rate for the state
  const shippingRate = SHIPPING_RATES.find(
    (rate) => rate.state.toLowerCase() === state.toLowerCase()
  ) || DEFAULT_SHIPPING_RATE;

  // Check if eligible for free shipping
  const isFreeShipping = 
    !isCOD && 
    shippingRate.freeShippingThreshold !== undefined && 
    orderValue >= shippingRate.freeShippingThreshold;

  if (isFreeShipping) {
    return {
      baseCharge: 0,
      codCharge: 0,
      totalCharge: 0,
      isFreeShipping: true,
      freeShippingThreshold: shippingRate.freeShippingThreshold,
      savedAmount: shippingRate.baseCharge,
    };
  }

  const baseCharge = shippingRate.baseCharge;
  const codCharge = isCOD ? shippingRate.codCharge : 0;
  const totalCharge = baseCharge + codCharge;

  return {
    baseCharge,
    codCharge,
    totalCharge,
    isFreeShipping: false,
    freeShippingThreshold: shippingRate.freeShippingThreshold,
  };
}

/**
 * Get shipping rate for a specific state
 */
export function getShippingRateByState(state: string): ShippingRate {
  return (
    SHIPPING_RATES.find(
      (rate) => rate.state.toLowerCase() === state.toLowerCase()
    ) || DEFAULT_SHIPPING_RATE
  );
}

/**
 * Check if order is eligible for free shipping
 */
export function isEligibleForFreeShipping(
  state: string,
  orderValue: number,
  isCOD: boolean
): boolean {
  if (isCOD) return false;
  
  const shippingRate = getShippingRateByState(state);
  return (
    shippingRate.freeShippingThreshold !== undefined &&
    orderValue >= shippingRate.freeShippingThreshold
  );
}

/**
 * Get amount needed for free shipping
 */
export function getAmountForFreeShipping(
  state: string,
  orderValue: number
): number | null {
  const shippingRate = getShippingRateByState(state);
  
  if (!shippingRate.freeShippingThreshold) return null;
  
  const needed = shippingRate.freeShippingThreshold - orderValue;
  return needed > 0 ? needed : 0;
}
