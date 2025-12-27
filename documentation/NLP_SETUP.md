# Enhanced NLP Search Setup

The AI search has been upgraded with **spaCy** and **scikit-learn** for better natural language understanding!

## 🎯 What's New

### Advanced Query Understanding
Now handles complex natural language queries:
- ✅ "show me lakes" → Understands "lakes"
- ✅ "find cultural places" → Extracts "cultural"
- ✅ "I want to see mountains" → Extracts "mountains"
- ✅ "give me snowy destinations" → Understands "snowy"
- ✅ "looking for beaches" → Extracts "beaches"

### Features
- **Part-of-Speech Tagging**: Identifies nouns, adjectives
- **Lemmatization**: "lakes" → "lake", "mountains" → "mountain"
- **Stop Word Removal**: Filters out "show", "me", "find", "want", etc.
- **Named Entity Recognition**: Extracts locations and places
- **Fallback Mode**: Works even without spaCy (basic keyword extraction)

## 📦 Installation Steps

### Step 1: Install Python Packages

The packages are already in `requirements.txt`. Install them:

```powershell
cd e:\Projects\Travel_Recommendation_app\travel-buddy-backend
pip install -r requirements.txt
```

This installs:
- `spacy>=3.7.0`
- `scikit-learn>=1.3.0`
- `numpy>=1.24.0`

### Step 2: Download spaCy Language Model

Run the setup command:

```powershell
python manage.py setup_nlp
```

**OR** manually download:

```powershell
python -m spacy download en_core_web_sm
```

### Step 3: Verify Installation

Test if NLP is working:

```powershell
python manage.py shell
```

```python
from recommendations.nlp_processor import NLPProcessor

# Test query
result = NLPProcessor.process_query("show me lakes")
print(result)
# Should show: {'raw_keywords': ['lake'], 'destination_types': ['lake'], ...}

# Check if spaCy is available
print(f"spaCy available: {NLPProcessor.is_spacy_available()}")
```

### Step 4: Restart Backend

```powershell
python manage.py runserver
```

## 🧪 Testing

### Test Queries

Try these in your frontend search bar:

**Natural Language:**
```
✓ "show me lakes"
✓ "find cultural places"
✓ "I want to see mountains"
✓ "give me beach destinations"
✓ "looking for snowy places"
✓ "tell me about historical sites"
```

**Simple Keywords:**
```
✓ "lakes"
✓ "cultural"
✓ "mountains"
✓ "beaches"
```

**Complex:**
```
✓ "show me trending mountain lakes"
✓ "find popular cultural places with snow"
✓ "I need cold weather destinations"
```

## 🔍 How It Works

### Query Processing Pipeline

1. **Input**: "show me lakes"
2. **Stop Word Removal**: Remove "show", "me"
3. **Extraction**: Keep "lakes"
4. **Lemmatization**: "lakes" → "lake"
5. **Mapping**: "lake" → destination_type: "lake"
6. **Database Query**: Search for "lake" in name/description
7. **Results**: All lake destinations

### Supported Destination Types

The NLP recognizes these destination types:
- **lake**: lake, lakes, waterbody, reservoir
- **mountain**: mountain, mountains, peak, peaks, hill, hills
- **beach**: beach, beaches, coast, coastal, seaside
- **valley**: valley, valleys, glen, gorge
- **river**: river, rivers, stream, waterfall
- **desert**: desert, deserts, dune, dunes
- **forest**: forest, forests, jungle, woods
- **city**: city, cities, town, urban
- **fort**: fort, forts, fortress, castle, palace
- **temple**: temple, temples, shrine, mosque

### Weather Terms

- **snow**: snow, snowy, snowfall, winter
- **rain**: rain, rainy, rainfall, monsoon
- **cloud**: cloud, cloudy, overcast
- **sun**: sun, sunny, sunshine, clear
- **cold**: cold, chilly, freezing, cool
- **hot**: hot, warm, heat

## 📊 Search Summary

The search results now show which NLP method was used:

- `🧠 SPACY` - Advanced spaCy processing
- `🧠 BASIC` - Fallback basic processing (if spaCy not available)

## 🐛 Troubleshooting

### Error: "No module named 'spacy'"

```powershell
pip install spacy
```

### Error: "Can't find model 'en_core_web_sm'"

```powershell
python -m spacy download en_core_web_sm
```

### Error: Microsoft Visual C++ required (Windows)

Download and install: [Visual C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)

Then retry installation.

### Search Still Not Working

The system will fallback to basic mode if spaCy is not available. Check logs:

```python
from recommendations.nlp_processor import NLPProcessor
print(f"spaCy available: {NLPProcessor.is_spacy_available()}")
```

## 💡 Examples

### Before (without NLP):
```
Query: "show me lakes"
Result: No results (searches for exact "show me lakes")
```

### After (with NLP):
```
Query: "show me lakes"
Extracted: "lake"
Result: All destinations with "lake" in name/description ✅
```

### Smart Understanding:
```
Query: "I want to visit cultural places with snow"
Extracted: ["cultural", "snow"]
Filters: category=cultural, weather=snow
Result: Cultural destinations in snowy regions ✅
```

## 🚀 Benefits

1. **Natural Conversation**: Type how you speak
2. **Smart Extraction**: Understands intent, not just keywords
3. **Better Results**: More relevant matches
4. **Fallback Safe**: Works even without spaCy
5. **Language Processing**: Handles plural, tenses, etc.

## 📝 Next Steps

After setup, users can:
- Use voice input with natural language
- Type conversational queries
- Get more accurate results
- See which NLP method was used

Happy searching! 🎉
