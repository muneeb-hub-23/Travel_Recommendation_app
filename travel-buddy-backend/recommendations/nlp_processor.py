"""
Enhanced NLP processor using spaCy for natural language understanding
Extracts meaningful entities and keywords from user queries
"""
import re
try:
    import spacy
    from sklearn.feature_extraction.text import TfidfVectorizer
    SPACY_AVAILABLE = True
    try:
        nlp = spacy.load("en_core_web_sm")
    except OSError:
        # Model not downloaded yet
        SPACY_AVAILABLE = False
        nlp = None
except ImportError:
    SPACY_AVAILABLE = False
    nlp = None


class NLPProcessor:
    """Advanced NLP processor for understanding natural language queries"""
    
    # Common stop words to remove
    STOP_WORDS = {
        'show', 'me', 'find', 'search', 'looking', 'for', 'want', 'need', 'see',
        'display', 'list', 'give', 'get', 'i', 'to', 'a', 'an', 'the', 'in', 'at', 'on',
        'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
        'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might',
        'area', 'areas', 'place', 'places', 'destination', 'destinations', 'spot', 'spots',
        'location', 'locations', 'site', 'sites', 'plan', 'trip', 'with', 'hotel', 'price',
        'under', 'budget', 'accommodation', 'between', 'from'
    }
    
    # Room type mappings
    ROOM_TYPES = {
        'single': ['single', 'solo', 'alone', 'one person', 'just me', 'myself'],
        'couple': [
            'couple', 'couples', 'two', 'double', 'romantic', 'honeymoon', 'partner',
            'me and my wife', 'me and my husband', 'me and my partner', 'me and my friend',
            'my wife and i', 'my husband and i', 'my partner and i', 'my friend and i',
            'wife and i', 'husband and i', 'partner and i', 'friend and i',
            'me and wife', 'me and husband', 'with my wife', 'with my husband', 
            'with my partner', 'with my friend', 'two people', 'two persons'
        ],
        'executive': ['executive', 'business', 'professional', 'premium'],
        'family': ['family', 'families', 'kids', 'children', 'group', 'with kids', 'with children']
    }
    
    # Number words mapping
    NUMBER_WORDS = {
        'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
        'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10
    }
    
    # Common Pakistani cities and areas
    LOCATIONS = [
        'islamabad', 'karachi', 'lahore', 'peshawar', 'quetta', 'multan', 'faisalabad',
        'rawalpindi', 'gujranwala', 'sialkot', 'murree', 'naran', 'kaghan', 'hunza',
        'skardu', 'gilgit', 'swat', 'chitral', 'abbottabad', 'mansehra', 'muzaffarabad',
        'kashmir', 'azad kashmir', 'northern areas', 'punjab', 'sindh', 'kpk', 
        'khyber pakhtunkhwa', 'balochistan', 'gilgit-baltistan'
    ]
    
    # Location abbreviations mapping
    LOCATION_ABBREVIATIONS = {
        'isb': 'islamabad',
        'khi': 'karachi',
        'lhr': 'lahore',
        'lhe': 'lahore',
        'pesh': 'peshawar',
        'rwp': 'rawalpindi',
        'pindi': 'rawalpindi',
        'mul': 'multan',
        'fsd': 'faisalabad',
        'skd': 'skardu',
        'gil': 'gilgit',
        'abbt': 'abbottabad',
        'abbota': 'abbottabad',
        'muz': 'muzaffarabad',
        'azk': 'azad kashmir',
        'ak': 'azad kashmir'
    }
    
    # Destination type synonyms
    DESTINATION_TYPES = {
        'lake': ['lake', 'lakes', 'waterbody', 'reservoir'],
        'mountain': ['mountain', 'mountains', 'peak', 'peaks', 'hill', 'hills', 'highland', 'highlands'],
        'beach': ['beach', 'beaches', 'coast', 'coastal', 'seaside', 'seashore', 'shore'],
        'valley': ['valley', 'valleys', 'glen', 'gorge'],
        'river': ['river', 'rivers', 'stream', 'waterfall', 'waterfalls'],
        'desert': ['desert', 'deserts', 'dune', 'dunes', 'arid'],
        'forest': ['forest', 'forests', 'jungle', 'woods', 'woodland'],
        'city': ['city', 'cities', 'town', 'towns', 'urban', 'metropolitan'],
        'village': ['village', 'villages', 'rural'],
        'fort': ['fort', 'forts', 'fortress', 'castle', 'palace'],
        'temple': ['temple', 'temples', 'shrine', 'mosque', 'church'],
        'park': ['park', 'parks', 'garden', 'gardens'],
    }
    
    # Weather-related terms
    WEATHER_TERMS = {
        'snow': ['snow', 'snowy', 'snowfall', 'snowing', 'winter', 'icy', 'ice'],
        'rain': ['rain', 'rainy', 'rainfall', 'monsoon', 'wet', 'drizzle'],
        'cloud': ['cloud', 'cloudy', 'overcast', 'foggy', 'fog', 'mist', 'misty'],
        'sun': ['sun', 'sunny', 'sunshine', 'clear', 'bright'],
        'cold': ['cold', 'chilly', 'freezing', 'cool', 'frosty'],
        'hot': ['hot', 'warm', 'heat', 'tropical'],
    }
    
    # Season terms
    SEASON_TERMS = {
        'spring': ['spring'],
        'summer': ['summer'],
        'autumn': ['autumn', 'fall'],
        'winter': ['winter'],
    }
    
    @staticmethod
    def is_spacy_available():
        """Check if spaCy is available"""
        return SPACY_AVAILABLE and nlp is not None
    
    @staticmethod
    def extract_keywords_basic(query):
        """Basic keyword extraction without spaCy"""
        query = query.lower().strip()
        words = re.findall(r'\b\w+\b', query)
        
        # Remove stop words
        keywords = [w for w in words if w not in NLPProcessor.STOP_WORDS and len(w) > 2]
        
        return keywords
    
    @staticmethod
    def extract_keywords_spacy(query):
        """Advanced keyword extraction using spaCy"""
        if not NLPProcessor.is_spacy_available():
            return NLPProcessor.extract_keywords_basic(query)
        
        doc = nlp(query.lower())
        keywords = []
        
        # Extract nouns, proper nouns, and adjectives
        for token in doc:
            # Skip stop words and short words
            if token.text in NLPProcessor.STOP_WORDS or len(token.text) <= 2:
                continue
            
            # Extract nouns (NN, NNS, NNP, NNPS)
            if token.pos_ in ['NOUN', 'PROPN']:
                keywords.append(token.lemma_)  # Use lemma for normalized form
            
            # Extract adjectives that might describe destinations
            elif token.pos_ == 'ADJ':
                keywords.append(token.text)
        
        # Extract named entities
        for ent in doc.ents:
            if ent.label_ in ['GPE', 'LOC', 'FAC']:  # Geographic, Location, Facility
                keywords.append(ent.text.lower())
        
        # Remove duplicates while preserving order
        seen = set()
        unique_keywords = []
        for k in keywords:
            if k not in seen:
                seen.add(k)
                unique_keywords.append(k)
        
        return unique_keywords
    
    @staticmethod
    def map_to_destination_types(keywords):
        """Map extracted keywords to destination types"""
        matched_types = []
        
        for keyword in keywords:
            # Check each destination type
            for dest_type, synonyms in NLPProcessor.DESTINATION_TYPES.items():
                if keyword in synonyms:
                    matched_types.append(dest_type)
                    break
        
        return list(set(matched_types))  # Remove duplicates
    
    @staticmethod
    def map_to_weather(keywords):
        """Map keywords to weather conditions"""
        matched_weather = []
        
        for keyword in keywords:
            for weather, terms in NLPProcessor.WEATHER_TERMS.items():
                if keyword in terms:
                    matched_weather.append(weather)
                    break
        
        return list(set(matched_weather))
    
    @staticmethod
    def map_to_seasons(keywords):
        """Map keywords to seasons"""
        matched_seasons = []
        
        for keyword in keywords:
            for season, terms in NLPProcessor.SEASON_TERMS.items():
                if keyword in terms:
                    matched_seasons.append(season.title())
                    break
        
        return list(set(matched_seasons))
    
    @staticmethod
    def process_query(query):
        """
        Main processing function
        Returns extracted information from natural language query
        """
        # Extract keywords
        if NLPProcessor.is_spacy_available():
            keywords = NLPProcessor.extract_keywords_spacy(query)
        else:
            keywords = NLPProcessor.extract_keywords_basic(query)
        
        # Map to categories
        destination_types = NLPProcessor.map_to_destination_types(keywords)
        weather_conditions = NLPProcessor.map_to_weather(keywords)
        seasons = NLPProcessor.map_to_seasons(keywords)
        
        # Check for trending keywords
        is_trending = any(word in query.lower() for word in ['trending', 'popular', 'famous', 'top', 'best'])
        
        # Extract room type - check longer phrases first for better matching
        room_type = None
        query_lower = query.lower()
        
        # Sort terms by length (longest first) to match "me and my wife" before "two"
        for room, terms in NLPProcessor.ROOM_TYPES.items():
            sorted_terms = sorted(terms, key=len, reverse=True)
            for term in sorted_terms:
                if term in query_lower:
                    room_type = room
                    break
            if room_type:
                break
        
        # Extract budget/price (supports ranges and single values)
        budget_min = None
        budget_max = None
        import re
        
        # Check for budget range: "between X to/and Y", "in budget X to Y", "budget between X to Y"
        range_match = re.search(r'(?:between|from|budget(?:\s+between)?|in\s+budget(?:\s+between)?)\s*(\d+)\s*(?:to|and|-)\s*(\d+)', query_lower)
        if range_match:
            budget_min = int(range_match.group(1))
            budget_max = int(range_match.group(2))
        else:
            # Check for maximum budget: "under X", "below X", "less than X"
            max_match = re.search(r'(?:under|below|less than|max|maximum)\s*(\d+)', query_lower)
            if max_match:
                budget_max = int(max_match.group(1))
            
            # Check for minimum budget: "above X", "more than X", "minimum X"
            min_match = re.search(r'(?:above|more than|minimum|min)\s*(\d+)', query_lower)
            if min_match:
                budget_min = int(min_match.group(1))
        
        # Extract number of days
        days = None
        days_match = re.search(r'(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s*days?', query_lower)
        if days_match:
            day_text = days_match.group(1)
            days = NLPProcessor.NUMBER_WORDS.get(day_text.lower(), None)
            if days is None:
                try:
                    days = int(day_text)
                except:
                    pass
        
        # Extract location/city
        location = None
        
        # First check for abbreviations
        query_words = query_lower.split()
        for word in query_words:
            # Remove common prefixes/suffixes
            clean_word = word.strip('.,!?;:')
            if clean_word in NLPProcessor.LOCATION_ABBREVIATIONS:
                location = NLPProcessor.LOCATION_ABBREVIATIONS[clean_word]
                break
        
        # If no abbreviation found, check for full location names
        if not location:
            for loc in NLPProcessor.LOCATIONS:
                # Check for exact match or with "area" suffix
                if loc in query_lower or f'{loc} area' in query_lower:
                    location = loc
                    break
        
        return {
            'keywords': keywords,
            'destination_types': destination_types,
            'weather': weather_conditions,
            'seasons': seasons,
            'is_trending': is_trending,
            'room_type': room_type,
            'budget_min': budget_min,
            'budget_max': budget_max,
            'days': days,
            'location': location
        }
