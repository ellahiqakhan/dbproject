from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import time
import json

chrome_options = Options()
chrome_options.add_argument("--headless") 
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

# Utility functions for web scraping
def get_page_source(url):
    """Fetch and return the page source of a URL."""
    driver.get(url)
    time.sleep(3)  
    return BeautifulSoup(driver.page_source, 'html.parser')

def scrape_data(url, outer_tag, inner_tag=None, class_name=None, attribute=None, index=None):
    """Scrape data based on specified tags, classes, and attributes."""
    soup = get_page_source(url)
    
    if class_name:
        outer_elements = soup.find_all(outer_tag, class_=class_name)
    elif attribute:
        attr_key, attr_value = attribute.split('=')
        outer_elements = soup.find_all(outer_tag, {attr_key: attr_value})
    else:
        outer_elements = soup.find_all(outer_tag)

    extracted_data = []
    for element in outer_elements:
        if inner_tag:
            inner_elements = element.find_all(inner_tag)
            extracted_data.extend(inner.get_text(strip=True) for inner in inner_elements)
        else:
            extracted_data.append(element.get_text(strip=True))
    
    if index is not None:
        return extracted_data[index] if 0 <= index < len(extracted_data) else None
    return extracted_data

def scrape_link_by_text(url, tag, link_text):
    """Scrape a specific link by its visible text."""
    soup = get_page_source(url)
    element = soup.find(tag, string=link_text)
    return element.get('href') if element else None

def scrape_fee_policy_link(url, partial_text):
    """Scrape a link containing a specific partial text."""
    soup = get_page_source(url)
    for link in soup.find_all("a"):
        if partial_text in link.text:
            return link.get('href')
    return None

def scrape_phone_number(url):
    """Scrape all phone numbers from a page."""
    soup = get_page_source(url)
    phone_links = soup.find_all("a", href=lambda href: href and href.startswith("tel:"))
    return [link.text.strip() for link in phone_links]

def scrape_emails(url):
    """Scrape all email addresses from a page."""
    soup = get_page_source(url)
    email_links = soup.find_all("a", href=lambda href: href and href.startswith("mailto:"))
    return [link.get('href').replace("mailto:", "").strip() for link in email_links]

def scrape_attribute(url, tag, class_name, attribute):
    """Scrape a specific attribute from an element."""
    soup = get_page_source(url)
    element = soup.find(tag, class_=class_name)
    return element.get(attribute) if element and element.has_attr(attribute) else None

# Scraping data for each university

# Beaconhouse National University (BNU)
bnu_url = "https://www.bnu.edu.pk/"
bnu_data = {
    "Name": scrape_data(bnu_url, "h1", None, "d-none")[0], 
    "Departments": scrape_data("https://www.bnu.edu.pk/bnu-program-finder", "div", "h3", "custom-pf-list-box"),
    "MeritList": scrape_link_by_text("https://www.bnu.edu.pk/admissions-decisions", "a", "Online Admission Portal."),
    "Scholarships": scrape_data("https://www.bnu.edu.pk/scholarships", "div", "h3", "faq_question-text faq-head-second"),
    "FeePolicyLink": scrape_fee_policy_link("https://www.bnu.edu.pk/fees", "Fee Policy of Beaconhouse National University"),
    "PhoneNumbers": scrape_phone_number(bnu_url),
    "Emails": scrape_emails(bnu_url),
}

# University of Central Punjab (UCP)
ucp_url = "https://ucp.edu.pk/"
ucp_data = {
    "Name": scrape_attribute(ucp_url, "a", "logo", "title"),
    "Departments": scrape_data("https://ucp.edu.pk/undergraduate/", "span", "a", None, "data-title=Program"),
    "MeritList": scrape_link_by_text("https://admission.ucp.edu.pk/merit/page", "a", "Merit List"),
    "Scholarships": scrape_data("https://ucp.edu.pk/ucp-scholarships/", "div", "h4", "scholarship-cont"),
    "PhoneNumbers": scrape_data("https://ucp.edu.pk/contact-us/", "div", None, "textwidget"),
    "Emails": scrape_emails(ucp_url),
}

umt_url = "https://admissions.umt.edu.pk/"
umt_data = {
    "Name": scrape_data(umt_url, "a", None, "text-white")[0],
    "Departments": scrape_data("https://admissions.umt.edu.pk/AcadPrograms.aspx", "td", "a", None, None, None),
    #"MeritList": scrape_link_by_text("https://admission.ucp.edu.pk/merit/page", "a", "Merit List"),
    "Scholarships": scrape_data("https://oin.umt.edu.pk/Scholarships-and-Financial-Assistance.aspx","div" ,"a", "card-header", None, None),
    "PhoneNumbers": scrape_data(umt_url, "a", None, "text-white")[5],
    "Emails": scrape_data(umt_url, "a", None, "text-white")[3]
}


# Consolidate scraped data
scraped_data = {
    "Beaconhouse National University": bnu_data,
    "University of Central Punjab": ucp_data,
    "University of Lahore": umt_data
}

# Save the scraped data to a JSON file
with open('scraped_data.json', 'w') as outfile:
    json.dump(scraped_data, outfile, indent=4)

# Print scraped data for verification
print(json.dumps(scraped_data, indent=4))

# Close the WebDriver
driver.quit()
