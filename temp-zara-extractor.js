const { JSDOM } = require('jsdom');

function cleanText(text) {
  return text.trim().replace(/\s+/g, ' ');
}

function parseHtml(html) {
  try {
    const dom = new JSDOM(html);
    return dom.window.document;
  } catch (e) {
    console.error('Error parsing HTML:', e);
    return null;
  }
}

function extractZaraProductsFromHtml(html) {
  const products = [];
  const doc = parseHtml(html);
  if (!doc) return [];

  // Find all product tables directly
  const productTables = doc.querySelectorAll('table.rd-product');
  
  if (!productTables || productTables.length === 0) {
    return products;
  }
  
  productTables.forEach(table => {
    const product = { name: '' };
    
    const productImg = table.querySelector('img.rd-product-img');
    if (productImg && productImg.getAttribute('src')) {
      const imageUrl = productImg.getAttribute('src');
      product.images = [imageUrl];
    }
    
    const productDivs = table.querySelectorAll('div');
    if (!productDivs || productDivs.length === 0) return;

    productDivs.forEach((div, index) => {
      const textContent = cleanText(div.textContent || '');
      if (!textContent) return;

      const style = div.getAttribute('style') || '';

      if (!product.name && textContent === textContent.toUpperCase()) {
        product.name = textContent;
        return;
      }

      if (style.includes('#666666') || style.includes('color: #666666')) {
        const colorRefParts = textContent.split(/\s+(?=\d+\/)/);
        if (colorRefParts.length >= 2) {
          product.color = colorRefParts[0].trim();
          product.reference = colorRefParts[1].trim();
        }
        return;
      }

      if (textContent.toLowerCase().includes('unit')) {
        const priceMatch = textContent.match(/₹\s*([\d,]+\.?\d*)/);
        if (priceMatch) {
          product.price = '₹ ' + priceMatch[1];
        }
        
        const quantityMatch = textContent.match(/(\d+)\s*unit/i);
        if (quantityMatch) {
          product.quantity = parseInt(quantityMatch[1], 10);
        }
        return;
      }

      if (!product.size && textContent.length <= 20) {
        product.size = textContent;
      }
    });

    if (product.name) {
      product.brand = 'Zara';
      products.push(product);
    }
  });

  return products;
}

// Test with the email HTML
const emailHtml = `<!doctype html><html lang="und" dir="auto" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" style="direction: ltr;"><head><title>ZARA</title><!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]--><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style type="text/css">#outlook a { padding:0; }
      body { margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }
      table, td { border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }
      img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }
      p { display:block;margin:13px 0; }</style><!--[if mso]>
    <noscript>
    <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
    </xml>
    </noscript>
    <![endif]--><style type="text/css">@media only screen and (min-width:480px) {
        .mj-column-per-100 { width:100% !important; max-width: 100%; }
      }</style><style media="screen and (min-width:480px)">.moz-text-html .mj-column-per-100 { width:100% !important; max-width: 100%; }</style><style type="text/css">@media only screen and (max-width:479px) {
      table.mj-full-width-mobile { width: 100% !important; }
      td.mj-full-width-mobile { width: auto !important; }
    }</style></head><body><div><!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" role="presentation" style="width:535px;" width="535" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]--><div style="margin:0px auto;max-width:535px"><table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;" width="100%"><tbody><tr><td style="direction:ltr;font-size:0px;padding:0 5px;text-align:center;" align="center"><!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:525px;" ><![endif]--><div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"><table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%"><tbody><tr><td style="font-size:0px;padding:0;word-break:break-word;"><table cellpadding="0" cellspacing="0" width="100%" border="0" style="color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;table-layout:auto;width:100%;border:none;"><tr class="rd-product-row"><td class="rd-product-col"><table class="rd-product" width="85%" style="width:85%;max-width:230px"><tr><td width="100%" style="width:100%;max-width:230px;padding:0" class="rd-subsection-text"><table><tr><td width="100%" style="width:100%;max-width:230px;padding:0 0 8px"><img padding="0" class="rd-product-img" width="225" src="https://static.zara.net/photos//2024/I/0/2/p/8574/400/707/2/8574400707_1_1_1.jpg?ts=1724398713635" style="max-width:230px;width:100%;height:auto" height="auto"></td></tr></table><div style="text-transform:uppercase;letter-spacing:0.8px;font-size:13px;line-height:18px">OVERSHIRT WITH POCKETS</div><div style="text-transform:uppercase;letter-spacing:0.8px;color:#666666;font-size:13px;line-height:18px">camel 0/8574/400/707/04</div><div style="text-transform:uppercase;letter-spacing:0.8px;padding-top:16px;font-size:13px;line-height:18px">1 unit / ₹ 3,330.00</div><div style="text-transform:uppercase;letter-spacing:0.8px;font-size:13px;line-height:18px">L</div></td></tr></table></td><td class="rd-product-col"><table class="rd-product" width="85%" style="width:85%;max-width:230px"><tr><td width="100%" style="width:100%;max-width:230px;padding:0" class="rd-subsection-text"><table><tr><td width="100%" style="width:100%;max-width:230px;padding:0 0 8px"><img padding="0" class="rd-product-img" width="225" src="https://static.zara.net/photos//2024/I/0/2/p/4048/310/427/2/4048310427_1_1_1.jpg?ts=1727436117024" style="max-width:230px;width:100%;height:auto" height="auto"></td></tr></table><div style="text-transform:uppercase;letter-spacing:0.8px;font-size:13px;line-height:18px">STRAIGHT-LEG JEANS</div><div style="text-transform:uppercase;letter-spacing:0.8px;color:#666666;font-size:13px;line-height:18px">Mid-blue 0/4048/310/427/42</div><div style="text-transform:uppercase;letter-spacing:0.8px;padding-top:16px;font-size:13px;line-height:18px">1 unit / ₹ 3,550.00</div><div style="text-transform:uppercase;letter-spacing:0.8px;font-size:13px;line-height:18px">EU 42 (UK 32)</div></td></tr></table></td></tr><tr class="rd-product-row"><td class="rd-product-col"><table class="rd-product" width="85%" style="width:85%;max-width:230px"><tr><td width="100%" style="width:100%;max-width:230px;padding:0" class="rd-subsection-text"><table><tr><td width="100%" style="width:100%;max-width:230px;padding:0 0 8px"><img padding="0" class="rd-product-img" width="225" src="https://static.zara.net/photos//2024/I/0/2/p/3918/707/501/2/3918707501_1_1_1.jpg?ts=1729075221439" style="max-width:230px;width:100%;height:auto" height="auto"></td></tr></table><div style="text-transform:uppercase;letter-spacing:0.8px;font-size:13px;line-height:18px">COMFORT PADDED OVERSHIRT</div><div style="text-transform:uppercase;letter-spacing:0.8px;color:#666666;font-size:13px;line-height:18px">Bottle green 0/3918/707/501/04</div><div style="text-transform:uppercase;letter-spacing:0.8px;padding-top:16px;font-size:13px;line-height:18px">1 unit / ₹ 3,570.00</div><div style="text-transform:uppercase;letter-spacing:0.8px;font-size:13px;line-height:18px">L</div></td></tr></table></td><td class="rd-product-col"><table class="rd-product" width="85%" style="width:85%;max-width:230px"><tr><td width="100%" style="width:100%;max-width:230px;padding:0" class="rd-subsection-text"><table><tr><td width="100%" style="width:100%;max-width:230px;padding:0 0 8px"><img padding="0" class="rd-product-img" width="225" src="https://static.zara.net/photos//2024/I/0/1/p/4201/570/800/2/4201570800_1_1_1.jpg?ts=1715328802790" style="max-width:230px;width:100%;height:auto" height="auto"></td></tr></table><div style="text-transform:uppercase;letter-spacing:0.8px;font-size:13px;line-height:18px">TEXTURED STRETCH SHIRT</div><div style="text-transform:uppercase;letter-spacing:0.8px;color:#666666;font-size:13px;line-height:18px">Black 0/4201/570/800/03</div><div style="text-transform:uppercase;letter-spacing:0.8px;padding-top:16px;font-size:13px;line-height:18px">1 unit / ₹ 2,130.00</div><div style="text-transform:uppercase;letter-spacing:0.8px;font-size:13px;line-height:18px">M</div></td></tr></table></td></tr><tr class="rd-product-row"><td class="rd-product-col"><table class="rd-product" width="85%" style="width:85%;max-width:230px"><tr><td width="100%" style="width:100%;max-width:230px;padding:0" class="rd-subsection-text"><table><tr><td width="100%" style="width:100%;max-width:230px;padding:0 0 8px"><img padding="0" class="rd-product-img" width="225" src="https://static.zara.net/photos//2024/I/0/1/p/3284/330/517/2/3284330517_1_1_1.jpg?ts=1727193661764" style="max-width:230px;width:100%;height:auto" height="auto"></td></tr></table><div style="text-transform:uppercase;letter-spacing:0.8px;font-size:13px;line-height:18px">PURL KNIT SWEATER</div><div style="text-transform:uppercase;letter-spacing:0.8px;color:#666666;font-size:13px;line-height:18px">olive green 0/3284/330/517/04</div><div style="text-transform:uppercase;letter-spacing:0.8px;padding-top:16px;font-size:13px;line-height:18px">1 unit / ₹ 2,130.00</div><div style="text-transform:uppercase;letter-spacing:0.8px;font-size:13px;line-height:18px">L</div></td></tr></table></td><td class="rd-product-col"><table class="rd-product" width="85%" style="width:85%;max-width:230px"><tr><td width="100%" style="width:100%;max-width:230px;padding:0" class="rd-subsection-text"><table><tr><td width="100%" style="width:100%;max-width:230px;padding:0 0 8px"><img padding="0" class="rd-product-img" width="225" src="https://static.zara.net/photos//2024/I/0/2/p/0706/025/712/2/0706025712_1_1_1.jpg?ts=1723796653773" style="max-width:230px;width:100%;height:auto" height="auto"></td></tr></table><div style="text-transform:uppercase;letter-spacing:0.8px;font-size:13px;line-height:18px">BOXY FIT OVERSHIRT</div><div style="text-transform:uppercase;letter-spacing:0.8px;color:#666666;font-size:13px;line-height:18px">Ecru 0/0706/025/712/04</div><div style="text-transform:uppercase;letter-spacing:0.8px;padding-top:16px;font-size:13px;line-height:18px">1 unit / ₹ 3,570.00</div><div style="text-transform:uppercase;letter-spacing:0.8px;font-size:13px;line-height:18px">L</div></td></tr></table></td></tr><tr class="rd-product-row"><td class="rd-product-col"><table class="rd-product" width="85%" style="width:85%;max-width:230px"><tr><td width="100%" style="width:100%;max-width:230px;padding:0" class="rd-subsection-text"><table><tr><td width="100%" style="width:100%;max-width:230px;padding:0 0 8px"><img padding="0" class="rd-product-img" width="225" src="https://static.zara.net/photos//2024/I/0/2/p/6917/309/806/2/6917309806_1_1_1.jpg?ts=1723130934367" style="max-width:230px;width:100%;height:auto" height="auto"></td></tr></table><div style="text-transform:uppercase;letter-spacing:0.8px;font-size:13px;line-height:18px">CROPPED DENIM OVERSHIRT</div><div style="text-transform:uppercase;letter-spacing:0.8px;color:#666666;font-size:13px;line-height:18px">Stone 0/6917/309/806/04</div><div style="text-transform:uppercase;letter-spacing:0.8px;padding-top:16px;font-size:13px;line-height:18px">1 unit / ₹ 2,970.00</div><div style="text-transform:uppercase;letter-spacing:0.8px;font-size:13px;line-height:18px">L</div></td></tr></table></td></tr></table></td></tr></tbody></table></div></td></tr></tbody></table></div></div></body></html>`;

const products = extractZaraProductsFromHtml(emailHtml);
console.log(JSON.stringify(products, null, 2)); 