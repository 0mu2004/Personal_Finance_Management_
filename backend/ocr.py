import pytesseract
from PIL import Image
from pdf2image import convert_from_bytes
import re
from datetime import datetime
from typing import Optional, Dict, Any
import io

class BillAnalyzer:
    """Analyze bill/receipt images using OCR to extract transaction data."""

    # Regex patterns for common bill elements
    AMOUNT_PATTERN = r'(?:total|amount|due|subtotal|paid|price|cost|charges)[\s:]*\$?(\d+\.?\d{0,2})'
    DATE_PATTERN = r'(?:date|on|issued)[\s:]*(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})'
    VENDOR_PATTERN = r'^([A-Z][A-Za-z\s&]*(?:Inc|Ltd|LLC|Co|Corp)?)'

    # Category keywords mapping
    CATEGORY_KEYWORDS = {
        'food': ['restaurant', 'cafe', 'pizza', 'burger', 'grocery', 'supermarket', 'bakery', 'diner', 'food', 'lunch', 'dinner', 'breakfast'],
        'transport': ['uber', 'taxi', 'gas', 'petrol', 'parking', 'transit', 'train', 'bus', 'airline', 'flight', 'car'],
        'utilities': ['electric', 'water', 'gas', 'internet', 'phone', 'utility', 'power', 'telecom'],
        'entertainment': ['cinema', 'movie', 'game', 'music', 'spotify', 'netflix', 'entertainment', 'ticket', 'concert'],
        'shopping': ['store', 'mall', 'amazon', 'shop', 'retail', 'clothing', 'fashion', 'apparel', 'department'],
        'other': []
    }

    @staticmethod
    async def analyze_bill(file_bytes: bytes, filename: str) -> Dict[str, Any]:
        """
        Analyze a bill/receipt image or PDF and extract transaction data.
        
        Args:
            file_bytes: The file content as bytes
            filename: Original filename to determine file type
            
        Returns:
            Dictionary with extracted amount, description, date, and category
        """
        try:
            # Extract text based on file type
            if filename.lower().endswith('.pdf'):
                extracted_text = BillAnalyzer._extract_text_from_pdf(file_bytes)
            else:
                extracted_text = BillAnalyzer._extract_text_from_image(file_bytes)

            if not extracted_text:
                return {
                    "amount": None,
                    "description": None,
                    "date": None,
                    "category": "other",
                    "confidence": 0,
                    "raw_text": ""
                }

            # Parse extracted text
            result = BillAnalyzer._parse_bill_text(extracted_text)
            result["raw_text"] = extracted_text[:500]  # Store first 500 chars for debugging

            return result

        except Exception as e:
            return {
                "amount": None,
                "description": None,
                "date": None,
                "category": "other",
                "confidence": 0,
                "error": str(e),
                "raw_text": ""
            }

    @staticmethod
    def _extract_text_from_image(file_bytes: bytes) -> str:
        """Extract text from image file using Tesseract OCR."""
        try:
            image = Image.open(io.BytesIO(file_bytes))
            # Improve image quality before OCR
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            text = pytesseract.image_to_string(image)
            return text
        except Exception as e:
            raise Exception(f"Failed to extract text from image: {str(e)}")

    @staticmethod
    def _extract_text_from_pdf(file_bytes: bytes) -> str:
        """Extract text from PDF file using pdf2image and Tesseract OCR."""
        try:
            pages = convert_from_bytes(file_bytes)
            text = ""
            
            # Process first 3 pages (most relevant info usually on first page)
            for page in pages[:3]:
                page_text = pytesseract.image_to_string(page)
                text += page_text + "\n"
            
            return text
        except Exception as e:
            raise Exception(f"Failed to extract text from PDF: {str(e)}")

    @staticmethod
    def _parse_bill_text(text: str) -> Dict[str, Any]:
        """Parse extracted text to find transaction details."""
        text_lower = text.lower()

        # Extract amount
        amount = BillAnalyzer._extract_amount(text_lower)
        
        # Extract date
        date = BillAnalyzer._extract_date(text)
        
        # Extract vendor/description
        description = BillAnalyzer._extract_vendor(text)
        
        # Determine category
        category = BillAnalyzer._determine_category(text_lower, description)
        
        # Calculate confidence score
        confidence = BillAnalyzer._calculate_confidence(amount, date, description)

        return {
            "amount": amount,
            "description": description,
            "date": date,
            "category": category,
            "confidence": confidence
        }

    @staticmethod
    def _extract_amount(text_lower: str) -> Optional[float]:
        """Extract transaction amount from text."""
        # Try common patterns first
        patterns = [
            r'(?:total|amount due|total amount|balance due)[\s:]*\$?(\d+\.?\d{0,2})',
            r'(?:subtotal)[\s:]*\$?(\d+\.?\d{0,2})',
            r'(?:grand total|total)[\s:]*\$?(\d+\.?\d{0,2})',
            r'\$(\d+\.?\d{0,2})',  # Any dollar amount
        ]

        for pattern in patterns:
            matches = re.findall(pattern, text_lower)
            if matches:
                # Take the largest amount (likely the total)
                amounts = [float(m) for m in matches if float(m) > 0]
                if amounts:
                    return max(amounts)

        return None

    @staticmethod
    def _extract_date(text: str) -> Optional[str]:
        """Extract date from bill text and convert to ISO format."""
        # Try various date formats
        date_patterns = [
            r'(?:date|on|issued)[\s:]*(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})',
            r'(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})',  # Any date format
            r'(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2}[,\s]+\d{4}',
        ]

        for pattern in date_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                try:
                    date_str = matches[0]
                    # Try parsing with common formats
                    for fmt in ['%m/%d/%Y', '%m-%d-%Y', '%d/%m/%Y', '%d-%m-%Y', '%Y/%m/%d', '%Y-%m-%d']:
                        try:
                            parsed_date = datetime.strptime(date_str, fmt)
                            return parsed_date.strftime('%Y-%m-%d')
                        except ValueError:
                            continue
                except Exception:
                    pass

        # Return today's date if no date found
        return datetime.now().strftime('%Y-%m-%d')

    @staticmethod
    def _extract_vendor(text: str) -> str:
        """Extract vendor/store name from bill text."""
        lines = text.split('\n')
        
        # First line is often the vendor name
        for line in lines[:10]:
            line = line.strip()
            if len(line) > 3 and len(line) < 100:
                # Look for business indicators
                if any(keyword in line.lower() for keyword in ['store', 'restaurant', 'cafe', 'shop', 'hotel', 'inn', 'inc', 'corp']):
                    return line
        
        # Fallback: use first non-empty line
        for line in lines:
            line = line.strip()
            if line and len(line) > 3:
                return line[:50]  # Limit length
        
        return "Bill"

    @staticmethod
    def _determine_category(text_lower: str, vendor: str) -> str:
        """Determine transaction category based on text content."""
        combined_text = text_lower + " " + vendor.lower()

        for category, keywords in BillAnalyzer.CATEGORY_KEYWORDS.items():
            if category != 'other':
                if any(keyword in combined_text for keyword in keywords):
                    return category

        return "other"

    @staticmethod
    def _calculate_confidence(amount: Optional[float], date: Optional[str], description: str) -> float:
        """Calculate confidence score for OCR results (0-100)."""
        confidence = 0.0
        
        # Check for amount
        if amount and amount > 0:
            confidence += 40
        
        # Check for date
        if date and date != datetime.now().strftime('%Y-%m-%d'):
            confidence += 30
        elif date:
            confidence += 15
        
        # Check for description
        if description and len(description) > 3:
            confidence += 30

        return min(100, int(confidence))
