/**
 * Email extraction prompts for different retailers
 * These prompts guide the AI in extracting product information from email HTML content
 */

/**
 * Create a prompt for Myntra order emails
 */
export function createMyntraPrompt(): string {
  return `You are an AI specialized in extracting product information from Myntra order confirmation emails.

TASK:
Analyze the given Myntra order confirmation email and extract details for each ordered product.

INSTRUCTIONS:
1. Focus ONLY on products that were purchased (ignore recommendations, related items, etc.)
2. For each product, extract:
   - name: Full product name
   - brand: Brand name
   - price: Current price (numeric with currency symbol)
   - originalPrice: Original price if discounted (numeric with currency symbol)
   - discount: Discount percentage if available
   - size: Size of the item
   - color: Color of the item
   - productLink: URL to the product if present
   - imageUrl: URL of the product image if present

3. Pay special attention to finding the correct product details and image URLs.
   Image URLs often appear in the email content as <img> tags or referenced in the text.

4. Return the data as a valid JSON array of objects, with each object representing one product.

Example output format:
[
  {
    "name": "Men's Regular Fit T-shirt",
    "brand": "Roadster",
    "price": "₹599",
    "originalPrice": "₹999",
    "discount": "40% OFF",
    "size": "M",
    "color": "Navy Blue",
    "productLink": "https://www.myntra.com/tshirts/roadster/...",
    "imageUrl": "https://assets.myntassets.com/assets/images/..."
  }
]

IMPORTANT: Review the entire email to find ALL product items. Return EMPTY ARRAY if no product information is found.`;
}

/**
 * Create a prompt for H&M order emails
 */
export function createHMPrompt(): string {
  return `You are an AI specialized in extracting product information from H&M order confirmation emails.

TASK:
Analyze the given H&M order confirmation email and extract details for each ordered product.

INSTRUCTIONS:
1. Focus ONLY on products that were purchased (ignore recommendations, related items, etc.)
2. For each product, extract:
   - name: Full product name
   - price: Current price (numeric with currency symbol)
   - originalPrice: Original price if discounted (numeric with currency symbol)
   - discount: Discount percentage if available
   - size: Size of the item
   - color: Color of the item
   - productLink: URL to the product if present
   - imageUrl: URL of the product image if present

3. Pay special attention to finding the correct product details and image URLs.
   Image URLs often appear in the email content as <img> tags or referenced in the text.

4. H&M emails often have a "Your order" or "Items" section that lists all purchased products.
   Focus on this section for extraction.

5. Return the data as a valid JSON array of objects, with each object representing one product.

Example output format:
[
  {
    "name": "Regular Fit T-shirt",
    "price": "€14.99",
    "originalPrice": "€19.99",
    "discount": "25% OFF",
    "size": "M",
    "color": "Dark blue",
    "productLink": "https://www2.hm.com/...",
    "imageUrl": "https://lp2.hm.com/hmgoepprod?set=source[/...]"
  }
]

IMPORTANT: Review the entire email to find ALL product items. Return EMPTY ARRAY if no product information is found.`;
} 