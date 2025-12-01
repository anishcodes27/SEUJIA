# Location-Based Shipping System

## Overview

Your website now has a **dynamic shipping calculator** that calculates delivery charges based on:
- 📍 **Customer's State** (automatically detected from pincode)
- 💳 **Payment Method** (COD has additional charges)
- 💰 **Order Value** (free shipping threshold varies by state)

## How It Works

### 1. **Pincode Detection**
- Customer enters 6-digit pincode
- System automatically fetches state and district
- Shipping rates are calculated based on the state

### 2. **Shipping Rate Components**
Each state has:
- **Base Charge**: Basic delivery cost for that location
- **COD Charge**: Additional fee if paying cash on delivery
- **Free Shipping Threshold**: Minimum order value for free shipping (online payments only)

### 3. **Examples**

#### Assam (Local State)
- Base Charge: ₹40
- COD Charge: ₹30
- Free Shipping: Orders ≥ ₹1,000 (online payment)
- **Total for COD**: ₹70
- **Total for Online**: ₹40 (or FREE if order ≥ ₹1,000)

#### Delhi
- Base Charge: ₹80
- COD Charge: ₹50
- Free Shipping: Orders ≥ ₹2,000 (online payment)
- **Total for COD**: ₹130
- **Total for Online**: ₹80 (or FREE if order ≥ ₹2,000)

#### Kerala
- Base Charge: ₹110
- COD Charge: ₹65
- Free Shipping: Orders ≥ ₹2,500 (online payment)
- **Total for COD**: ₹175
- **Total for Online**: ₹110 (or FREE if order ≥ ₹2,500)

## State-wise Shipping Rates

### Northeast India (Lowest Rates)
| State | Base | COD | Free Shipping Threshold |
|-------|------|-----|------------------------|
| **Assam** | ₹40 | ₹30 | ₹1,000 |
| Meghalaya | ₹50 | ₹35 | ₹1,200 |
| West Bengal | ₹60 | ₹40 | ₹1,500 |
| Tripura | ₹65 | ₹40 | ₹1,200 |
| Sikkim | ₹70 | ₹45 | ₹1,500 |
| Nagaland | ₹70 | ₹45 | ₹1,500 |
| Manipur | ₹75 | ₹45 | ₹1,500 |
| Arunachal Pradesh | ₹80 | ₹50 | ₹1,500 |
| Mizoram | ₹85 | ₹50 | ₹1,500 |

### North India
| State | Base | COD | Free Shipping Threshold |
|-------|------|-----|------------------------|
| Uttar Pradesh | ₹75 | ₹50 | ₹1,800 |
| Delhi | ₹80 | ₹50 | ₹2,000 |
| Haryana | ₹80 | ₹50 | ₹2,000 |
| Uttarakhand | ₹80 | ₹50 | ₹1,800 |
| Punjab | ₹85 | ₹55 | ₹2,000 |
| Rajasthan | ₹85 | ₹55 | ₹2,000 |
| Himachal Pradesh | ₹90 | ₹55 | ₹2,000 |
| Jammu and Kashmir | ₹100 | ₹60 | ₹2,000 |

### East India
| State | Base | COD | Free Shipping Threshold |
|-------|------|-----|------------------------|
| Bihar | ₹70 | ₹45 | ₹1,500 |
| Jharkhand | ₹75 | ₹45 | ₹1,500 |
| Odisha | ₹80 | ₹50 | ₹1,800 |

### Central India
| State | Base | COD | Free Shipping Threshold |
|-------|------|-----|------------------------|
| Chhattisgarh | ₹80 | ₹50 | ₹1,800 |
| Madhya Pradesh | ₹85 | ₹55 | ₹1,800 |

### West India
| State | Base | COD | Free Shipping Threshold |
|-------|------|-----|------------------------|
| Maharashtra | ₹90 | ₹55 | ₹2,000 |
| Gujarat | ₹95 | ₹60 | ₹2,000 |
| Goa | ₹100 | ₹60 | ₹2,000 |

### South India (Highest Rates)
| State | Base | COD | Free Shipping Threshold |
|-------|------|-----|------------------------|
| Andhra Pradesh | ₹100 | ₹60 | ₹2,500 |
| Telangana | ₹100 | ₹60 | ₹2,500 |
| Karnataka | ₹100 | ₹60 | ₹2,500 |
| Tamil Nadu | ₹105 | ₹65 | ₹2,500 |
| Kerala | ₹110 | ₹65 | ₹2,500 |
| Puducherry | ₹110 | ₹65 | ₹2,500 |

### Default (Other States/UTs)
- Base: ₹100
- COD: ₹60
- Free Shipping: ₹2,000

## Features

### ✅ What Customers See

1. **Pincode Auto-Detection**
   - Enter pincode → state/district auto-filled
   - Shipping charges calculated instantly

2. **Payment Method Impact**
   - **COD**: Base + COD charges
   - **Online Payment**: Base charge only (or FREE if threshold met)

3. **Free Shipping Alert**
   - Shows "Add ₹X more for FREE delivery!"
   - Encourages customers to increase cart value

4. **Transparent Pricing**
   - Clear breakdown: Base + COD = Total
   - Shows savings with free shipping

### 📊 Order Summary Display

```
Subtotal:           ₹850
Base Shipping (Assam): ₹40
COD Charges:        ₹30
─────────────────────────
Total Delivery:     ₹70
─────────────────────────
Total:              ₹920
```

Or with free shipping:
```
Subtotal:           ₹1,200
Delivery Charges:   FREE ✓
                    Saved ₹40
─────────────────────────
Total:              ₹1,200
```

## Customization

### To Change Shipping Rates

Edit `/lib/shipping-calculator.ts`:

```typescript
{
  state: 'YourState',
  baseCharge: 50,        // Base delivery cost
  codCharge: 30,         // Additional COD fee
  freeShippingThreshold: 1500, // Free shipping above this amount
}
```

### To Add New State

Add to the `SHIPPING_RATES` array:

```typescript
{
  state: 'New State Name',
  baseCharge: 80,
  codCharge: 50,
  freeShippingThreshold: 2000,
}
```

### To Change Default Rates

Edit `DEFAULT_SHIPPING_RATE` in the file.

## Benefits

✅ **Fair Pricing** - Customers pay based on actual delivery distance
✅ **Encourage Online Payments** - Lower charges + free shipping eligibility
✅ **Transparent** - Clear breakdown of all charges
✅ **Flexible** - Easy to adjust rates per state
✅ **Smart** - Auto-calculates based on location and order value

## Technical Details

**File**: `/lib/shipping-calculator.ts`
**Functions**:
- `calculateShipping()` - Main calculator
- `getShippingRateByState()` - Get rates for a state
- `isEligibleForFreeShipping()` - Check free shipping eligibility
- `getAmountForFreeShipping()` - Calculate amount needed for free shipping

**Integration**: Checkout page automatically uses this system when customer enters pincode.
