import { extractZaraProductsFromHtml } from './email-content-parser';

// Sample email HTML content
const sampleHtml = `
<!DOCTYPE html>
<html>
<body>
<table>
<tbody>
<tr class="rd-product-row">
  <td class="rd-product-col">
    <table class="rd-product">
      <tr>
        <td>
          <img class="rd-product-img" src="https://static.zara.net/photos//2024/I/0/1/p/4201/570/800/2/4201570800_1_1_1.jpg">
          <div>TEXTURED STRETCH SHIRT</div>
          <div style="color: #666666">Black 0/4201/570/800/03</div>
          <div>1 unit / ₹ 2,130.00</div>
          <div>M</div>
        </td>
      </tr>
    </table>
  </td>
</tr>
<tr class="rd-product-row">
  <td class="rd-product-col">
    <table class="rd-product">
      <tr>
        <td>
          <img class="rd-product-img" src="https://static.zara.net/photos//2024/I/0/2/p/8281/347/806/2/8281347806_1_1_1.jpg">
          <div>FAUX SUEDE OVERSHIRT</div>
          <div style="color: #666666">Stone 0/8281/347/806/04</div>
          <div>1 unit / ₹ 3,570.00</div>
          <div>L</div>
        </td>
      </tr>
    </table>
  </td>
</tr>
</tbody>
</table>
</body>
</html>
`;

// Test the extraction
const products = extractZaraProductsFromHtml(sampleHtml);

// Log results
console.log('Extracted Products:', JSON.stringify(products, null, 2)); 