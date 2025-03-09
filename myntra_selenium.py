from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import json
import time
import csv

def setup_driver():
    chrome_options = Options()
    chrome_options.add_argument('--headless')  # Run in headless mode
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36')
    
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    return driver

def extract_product_data(driver, url):
    try:
        driver.get(url)
        time.sleep(3)  # Wait for dynamic content to load
        
        # Execute JavaScript to get product data
        script = """
        return {
            brand: document.querySelector('.pdp-title .pdp-name')?.textContent,
            name: document.querySelector('.pdp-title .pdp-name + h1')?.textContent,
            price: document.querySelector('.pdp-price strong')?.textContent,
            mrp: document.querySelector('.pdp-mrp s')?.textContent,
            discount: document.querySelector('.pdp-discount')?.textContent,
            rating: document.querySelector('.index-overallRating')?.textContent,
            sizes: Array.from(document.querySelectorAll('.size-buttons-size-button')).map(el => el.textContent),
            images: Array.from(document.querySelectorAll('.image-grid-imageContainer img')).map(el => el.src),
            description: document.querySelector('.pdp-product-description-content')?.textContent,
            seller: document.querySelector('.pdp-seller-name')?.textContent
        }
        """
        
        product_data = driver.execute_script(script)
        product_data['url'] = url
        return product_data
    except Exception as e:
        print(f"Error extracting data from {url}: {str(e)}")
        return None

def scrape_category(category_url, num_products=10):
    driver = setup_driver()
    products = []
    
    try:
        driver.get(category_url)
        time.sleep(3)  # Wait for products to load
        
        # Get product URLs
        product_links = driver.find_elements(By.CSS_SELECTOR, '.product-base a')
        product_urls = [link.get_attribute('href') for link in product_links[:num_products]]
        
        # Extract data for each product
        for url in product_urls:
            product_data = extract_product_data(driver, url)
            if product_data:
                products.append(product_data)
                print(f"Scraped product: {product_data['brand']} - {product_data['name']}")
    
    except Exception as e:
        print(f"Error scraping category: {str(e)}")
    
    finally:
        driver.quit()
    
    return products

def save_to_csv(products, filename):
    if not products:
        print("No products to save")
        return
    
    # Get all possible keys from all products
    fieldnames = set()
    for product in products:
        fieldnames.update(product.keys())
    
    with open(filename, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=list(fieldnames))
        writer.writeheader()
        for product in products:
            # Convert lists to strings for CSV
            row = {k: ','.join(v) if isinstance(v, list) else v for k, v in product.items()}
            writer.writerow(row)

if __name__ == '__main__':
    category_url = 'https://www.myntra.com/shirts'
    products = scrape_category(category_url, num_products=5)  # Start with 5 products for testing
    save_to_csv(products, 'myntra_shirts.csv')
    print(f"Successfully scraped {len(products)} products") 