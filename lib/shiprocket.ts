/**
 * Shiprocket Integration
 * API documentation: https://apidocs.shiprocket.in/
 */

interface ShiprocketAuthResponse {
  token: string;
  company_id: number;
  email: string;
  id: number;
}

interface ShiprocketServiceability {
  available_courier_companies: Array<{
    courier_company_id: number;
    courier_name: string;
    freight_charge: number;
    cod_charges: number;
    min_weight: number;
    etd: string;
  }>;
}

interface ShiprocketOrder {
  order_id: string;
  order_date: string;
  pickup_location: string;
  channel_id: string;
  billing_customer_name: string;
  billing_last_name: string;
  billing_address: string;
  billing_city: string;
  billing_pincode: string;
  billing_state: string;
  billing_country: string;
  billing_email: string;
  billing_phone: string;
  shipping_is_billing: boolean;
  order_items: Array<{
    name: string;
    sku: string;
    units: number;
    selling_price: number;
  }>;
  payment_method: 'COD' | 'Prepaid';
  sub_total: number;
  length: number;
  breadth: number;
  height: number;
  weight: number;
}

interface ShiprocketTrackingResponse {
  tracking_data: {
    shipment_status: string;
    shipment_track: Array<{
      id: number;
      awb_code: string;
      courier_company_id: number;
      shipment_id: number;
      order_id: number;
      pickup_date: string;
      delivered_date: string | null;
      weight: string;
      packages: number;
      current_status: string;
      delivered_to: string | null;
      destination: string;
      consignee_name: string;
      origin: string;
      courier_name: string;
      edd: string | null;
    }>;
    shipment_track_activities: Array<{
      date: string;
      status: string;
      activity: string;
      location: string;
      'sr-status': string;
      'sr-status-label': string;
    }>;
  };
}

class ShiprocketAPI {
  private baseURL = 'https://apiv2.shiprocket.in/v1/external';
  private token: string | null = null;
  private tokenExpiry: number | null = null;

  /**
   * Authenticate with Shiprocket API
   */
  async authenticate(): Promise<string> {
    // Return cached token if still valid
    if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.token;
    }

    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD,
      }),
    });

    if (!response.ok) {
      throw new Error('Shiprocket authentication failed');
    }

    const data: ShiprocketAuthResponse = await response.json();
    this.token = data.token;
    // Token expires in 10 days, refresh after 9 days
    this.tokenExpiry = Date.now() + (9 * 24 * 60 * 60 * 1000);

    return this.token;
  }

  /**
   * Check serviceability and get shipping rates
   */
  async checkServiceability(params: {
    pickup_postcode: string;
    delivery_postcode: string;
    weight: number; // in kg
    cod: boolean;
  }): Promise<ShiprocketServiceability> {
    const token = await this.authenticate();

    const response = await fetch(
      `${this.baseURL}/courier/serviceability/?pickup_postcode=${params.pickup_postcode}&delivery_postcode=${params.delivery_postcode}&weight=${params.weight}&cod=${params.cod ? 1 : 0}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to check serviceability');
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * Get cheapest shipping rate from available couriers
   */
  async getCheapestRate(params: {
    pickup_postcode: string;
    delivery_postcode: string;
    weight: number;
    cod: boolean;
  }): Promise<{
    freight_charge: number;
    cod_charges: number;
    total_charge: number;
    courier_name: string;
    etd: string;
  }> {
    const serviceability = await this.checkServiceability(params);

    if (!serviceability.available_courier_companies || serviceability.available_courier_companies.length === 0) {
      throw new Error('No courier services available for this location');
    }

    // Find the cheapest option
    const cheapest = serviceability.available_courier_companies.reduce((min, courier) => {
      const total = courier.freight_charge + (params.cod ? courier.cod_charges : 0);
      const minTotal = min.freight_charge + (params.cod ? min.cod_charges : 0);
      return total < minTotal ? courier : min;
    });

    return {
      freight_charge: cheapest.freight_charge,
      cod_charges: params.cod ? cheapest.cod_charges : 0,
      total_charge: cheapest.freight_charge + (params.cod ? cheapest.cod_charges : 0),
      courier_name: cheapest.courier_name,
      etd: cheapest.etd,
    };
  }

  /**
   * Create order in Shiprocket
   */
  async createOrder(orderData: ShiprocketOrder): Promise<{
    order_id: number;
    shipment_id: number;
    awb_code: string;
    courier_company_id: number;
    courier_name: string;
  }> {
    const token = await this.authenticate();

    const response = await fetch(`${this.baseURL}/orders/create/adhoc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create Shiprocket order');
    }

    const data = await response.json();
    return data;
  }

  /**
   * Track shipment
   */
  async trackShipment(shipment_id: number): Promise<ShiprocketTrackingResponse> {
    const token = await this.authenticate();

    const response = await fetch(
      `${this.baseURL}/courier/track/shipment/${shipment_id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to track shipment');
    }

    return await response.json();
  }

  /**
   * Track shipment by AWB code
   */
  async trackByAWB(awb_code: string): Promise<ShiprocketTrackingResponse> {
    const token = await this.authenticate();

    const response = await fetch(
      `${this.baseURL}/courier/track/awb/${awb_code}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to track shipment');
    }

    return await response.json();
  }

  /**
   * Generate AWB for shipment
   */
  async generateAWB(shipment_id: number, courier_id: number): Promise<{
    awb_assign_status: number;
    awb_code: string;
    response: {
      data: {
        awb_code: string;
        courier_company_id: number;
        courier_name: string;
      };
    };
  }> {
    const token = await this.authenticate();

    const response = await fetch(`${this.baseURL}/courier/assign/awb`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        shipment_id,
        courier_id,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate AWB');
    }

    return await response.json();
  }

  /**
   * Request pickup
   */
  async requestPickup(shipment_id: number): Promise<{
    pickup_status: number;
    response: {
      pickup_scheduled_date: string;
      pickup_token_number: string;
    };
  }> {
    const token = await this.authenticate();

    const response = await fetch(`${this.baseURL}/courier/generate/pickup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        shipment_id: [shipment_id],
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to request pickup');
    }

    return await response.json();
  }

  /**
   * Cancel shipment
   */
  async cancelShipment(awb_codes: string[]): Promise<any> {
    const token = await this.authenticate();

    const response = await fetch(`${this.baseURL}/orders/cancel/shipment/awbs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        awbs: awb_codes,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to cancel shipment');
    }

    return await response.json();
  }
}

// Export singleton instance
export const shiprocket = new ShiprocketAPI();

// Helper function to calculate package weight from cart
export function calculatePackageWeight(cart: Array<{ quantity: number; product: any }>): number {
  // Honey bottle weight calculation
  // Average honey bottle: 250g product + 150g bottle = 0.4kg
  const AVERAGE_PRODUCT_WEIGHT = 0.4; // kg per honey bottle
  const PACKAGING_WEIGHT = 0.1; // kg for packaging
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalWeight = (totalItems * AVERAGE_PRODUCT_WEIGHT) + PACKAGING_WEIGHT;
  
  // Minimum weight for Shiprocket is 0.5kg
  return Math.max(totalWeight, 0.5);
}

// Helper function to get default pickup pincode
export function getPickupPincode(): string {
  return process.env.SHIPROCKET_PICKUP_PINCODE || '781001'; // Default to Guwahati, Assam
}
