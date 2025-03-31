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

/**
 * Create a prompt for Zara order emails
 */
export function createZaraPrompt(): string {
  return `You are an AI specialized in extracting product information from Zara order confirmation emails.

TASK:
Analyze the given Zara order confirmation email and extract details for each ordered product.

INSTRUCTIONS:
1. Focus ONLY on products that were purchased (ignore recommendations, related items, etc.)
2. For each product, extract:
   - name: Full product name (always in ALL CAPS)
   - brand: Always "Zara"
   - price: Current price in INR format (e.g., "₹ 3,330.00")
   - originalPrice: Original price if discounted
   - discount: Discount percentage if available
   - size: Size of the item (may be letter sizes like "L" or EU sizes like "EU 42 (UK 32)")
   - color: Color of the item (appears before the reference code)
   - productLink: URL to the product if present
   - imageUrl: URL of the product image if present
   - reference: Product reference code in format "0/XXXX/XXX/XXX/XX" (e.g., "0/8574/400/707/04")

3. Look for these patterns in the HTML:
   - Product containers are in tables with class "rd-product"
   - Product names are in ALL CAPS in the first div after the product image
   - Colors and reference codes are in a div with color #666666, typically in format "COLOR REFERENCE"
   - Prices are in a format like "₹ 3,330.00" and appear in a div containing "unit"
   - Image URLs contain "static.zara.net/photos" and follow a pattern with product reference code

4. Pay special attention to the HTML structure:
   - Each product is contained in a table with class "rd-product"
   - Product image is in an <img> tag with class "rd-product-img"
   - Product name is in a div with uppercase text
   - Color and reference code are in a div with color #666666
   - Price and quantity information are in a div containing "unit"
   - Size information is in a final div

5. Return the data as a valid JSON array of objects, with each object representing one product.

Example output format:
[
  {
    "name": "OVERSHIRT WITH POCKETS",
    "brand": "Zara",
    "price": "₹ 3,330.00",
    "size": "L",
    "color": "Camel",
    "imageUrl": "https://static.zara.net/photos//2024/I/0/2/p/8574/400/707/2/8574400707_1_1_1.jpg?ts=1724398713635",
    "reference": "0/8574/400/707/04"
  },
  {
    "name": "STRAIGHT-LEG JEANS",
    "brand": "Zara",
    "price": "₹ 3,550.00",
    "size": "EU 42 (UK 32)",
    "color": "Mid-Blue",
    "imageUrl": "https://static.zara.net/photos//2024/I/0/2/p/4048/310/427/2/4048310427_1_1_1.jpg?ts=1727436117024",
    "reference": "0/4048/310/427/42"
  }
]

IMPORTANT: Review the entire email to find ALL product items. Return EMPTY ARRAY if no product information is found.`;
} 