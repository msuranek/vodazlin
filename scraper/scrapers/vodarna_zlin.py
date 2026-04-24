"""
Scraper pro data z Vodárny Zlín
Získává aktuální rozbory vody, ceny a další informace
"""

import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime
from typing import Dict, Optional, List
import logging

# Nastavení loggingu
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class VodarnaZlinScraper:
    """Scraper pro Vodárnu Zlín"""
    
    BASE_URL = "https://www.vodarnazlin.cz"
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    def scrape_water_quality(self) -> Optional[Dict]:
        """
        Získá data o kvalitě vody
        
        Returns:
            Dict s parametry kvality vody nebo None při chybě
        """
        try:
            # URL pro rozbory vody (bude třeba upravit podle skutečné struktury webu)
            url = f"{self.BASE_URL}/kvalita-vody"
            
            logger.info(f"Stahuji data z {url}")
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'lxml')
            
            # POZNÁMKA: Toto je šablona - bude třeba upravit podle skutečné HTML struktury
            # Příklad parsování:
            data = {
                'timestamp': datetime.now().isoformat(),
                'location': 'Zlín - centrální rozvod',
                'parameters': self._parse_parameters(soup),
                'bacteriological': self._parse_bacteriological(soup),
            }
            
            logger.info("Data úspěšně získána")
            return data
            
        except requests.RequestException as e:
            logger.error(f"Chyba při stahování dat: {e}")
            return None
        except Exception as e:
            logger.error(f"Neočekávaná chyba: {e}")
            return None
    
    def _parse_parameters(self, soup: BeautifulSoup) -> Dict[str, float]:
        """
        Parsuje chemické parametry vody
        
        Args:
            soup: BeautifulSoup objekt
            
        Returns:
            Dict s parametry
        """
        # ŠABLONA - upravit podle skutečné struktury HTML
        parameters = {
            'hardness': 0.0,  # °dH
            'pH': 0.0,
            'nitrates': 0.0,  # mg/l
            'iron': 0.0,  # mg/l
            'manganese': 0.0,  # mg/l
            'calcium': 0.0,  # mg/l
            'magnesium': 0.0,  # mg/l
            'chlorides': 0.0,  # mg/l
            'sulfates': 0.0,  # mg/l
        }
        
        # Příklad parsování z tabulky:
        # table = soup.find('table', class_='water-parameters')
        # if table:
        #     for row in table.find_all('tr'):
        #         cols = row.find_all('td')
        #         if len(cols) >= 2:
        #             param_name = cols[0].text.strip()
        #             param_value = float(cols[1].text.strip())
        #             # Mapování na naše klíče...
        
        return parameters
    
    def _parse_bacteriological(self, soup: BeautifulSoup) -> Dict[str, int]:
        """
        Parsuje bakteriologické parametry
        
        Args:
            soup: BeautifulSoup objekt
            
        Returns:
            Dict s bakteriologickými parametry
        """
        return {
            'ecoli': 0,  # KTJ/100ml
            'enterococci': 0,  # KTJ/100ml
            'coliformBacteria': 0,  # KTJ/100ml
        }
    
    def scrape_pricing(self) -> Optional[Dict]:
        """
        Získá aktuální ceny vodného a stočného
        
        Returns:
            Dict s cenami nebo None při chybě
        """
        try:
            url = f"{self.BASE_URL}/ceny"
            
            logger.info(f"Stahuji cenová data z {url}")
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'lxml')
            
            # ŠABLONA - upravit podle skutečné struktury
            pricing = {
                'lastUpdate': datetime.now().strftime('%Y-%m-%d'),
                'prices': {
                    'water': {
                        'price': 28.50,  # Kč/m³
                        'vat': 10,  # %
                        'priceWithVat': 31.35,  # Kč/m³
                    },
                    'sewage': {
                        'price': 32.80,  # Kč/m³
                        'vat': 10,  # %
                        'priceWithVat': 36.08,  # Kč/m³
                    },
                },
            }
            
            # Výpočet celkové ceny
            pricing['prices']['total'] = {
                'price': pricing['prices']['water']['price'] + pricing['prices']['sewage']['price'],
                'priceWithVat': pricing['prices']['water']['priceWithVat'] + pricing['prices']['sewage']['priceWithVat'],
            }
            
            logger.info("Cenová data úspěšně získána")
            return pricing
            
        except Exception as e:
            logger.error(f"Chyba při získávání cen: {e}")
            return None
    
    def save_data(self, data: Dict, filename: str):
        """
        Uloží data do JSON souboru
        
        Args:
            data: Data k uložení
            filename: Název souboru
        """
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            logger.info(f"Data uložena do {filename}")
        except Exception as e:
            logger.error(f"Chyba při ukládání dat: {e}")


def main():
    """Hlavní funkce pro testování scraperu"""
    scraper = VodarnaZlinScraper()
    
    # Získání kvality vody
    water_quality = scraper.scrape_water_quality()
    if water_quality:
        scraper.save_data(water_quality, 'water_quality.json')
    
    # Získání cen
    pricing = scraper.scrape_pricing()
    if pricing:
        scraper.save_data(pricing, 'pricing.json')
    
    logger.info("Scraping dokončen")


if __name__ == "__main__":
    main()
