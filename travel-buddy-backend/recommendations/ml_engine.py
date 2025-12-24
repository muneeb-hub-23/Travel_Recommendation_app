"""
Machine Learning Engine for Travel Recommendations
Uses spaCy for NLP tasks and scikit-learn for recommendation algorithms
"""
import logging
from typing import List, Dict, Any, Optional
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler
import spacy

logger = logging.getLogger(__name__)

# Global variables to store loaded models
nlp_model = None
tfidf_vectorizer = None
scaler = None


def initialize_ml_models():
    """
    Initialize spaCy and scikit-learn models
    This is called when Django app starts
    """
    global nlp_model, tfidf_vectorizer, scaler
    
    try:
        # Initialize spaCy with large English model
        # Note: You'll need to run: python -m spacy download en_core_web_lg
        logger.info("Loading spaCy model...")
        nlp_model = spacy.load('en_core_web_lg')
        logger.info("spaCy model loaded successfully")
    except Exception as e:
        logger.warning(f"Could not load spaCy model: {e}")
        logger.warning("Please run: python -m spacy download en_core_web_lg")
        # Initialize blank English model as fallback
        nlp_model = spacy.blank('en')
    
    # Initialize TF-IDF Vectorizer for text similarity
    tfidf_vectorizer = TfidfVectorizer(
        max_features=1000,
        stop_words='english',
        ngram_range=(1, 2)
    )
    logger.info("TF-IDF Vectorizer initialized")
    
    # Initialize StandardScaler for feature normalization
    scaler = StandardScaler()
    logger.info("StandardScaler initialized")
    
    return True


def get_nlp_model():
    """Get the loaded spaCy model"""
    global nlp_model
    if nlp_model is None:
        initialize_ml_models()
    return nlp_model


def extract_keywords(text: str, top_n: int = 10) -> List[str]:
    """
    Extract important keywords from text using spaCy
    
    Args:
        text: Input text to process
        top_n: Number of top keywords to return
        
    Returns:
        List of extracted keywords
    """
    nlp = get_nlp_model()
    doc = nlp(text)
    
    # Extract nouns, proper nouns, and adjectives
    keywords = []
    for token in doc:
        if token.pos_ in ['NOUN', 'PROPN', 'ADJ'] and not token.is_stop:
            keywords.append(token.lemma_.lower())
    
    # Return unique keywords
    return list(set(keywords))[:top_n]


def extract_entities(text: str) -> Dict[str, List[str]]:
    """
    Extract named entities from text using spaCy
    
    Args:
        text: Input text to process
        
    Returns:
        Dictionary mapping entity types to lists of entities
    """
    nlp = get_nlp_model()
    doc = nlp(text)
    
    entities = {}
    for ent in doc.ents:
        entity_type = ent.label_
        entity_text = ent.text
        
        if entity_type not in entities:
            entities[entity_type] = []
        entities[entity_type].append(entity_text)
    
    return entities


def analyze_sentiment(text: str) -> Dict[str, Any]:
    """
    Analyze sentiment of text
    Note: Basic implementation - can be enhanced with specialized models
    
    Args:
        text: Input text to analyze
        
    Returns:
        Dictionary with sentiment analysis results
    """
    nlp = get_nlp_model()
    doc = nlp(text)
    
    # Basic sentiment based on adjectives
    positive_words = ['good', 'great', 'excellent', 'amazing', 'wonderful', 
                     'beautiful', 'fantastic', 'lovely', 'perfect', 'best']
    negative_words = ['bad', 'terrible', 'awful', 'horrible', 'poor', 
                     'worst', 'disappointing', 'dirty', 'expensive']
    
    positive_count = 0
    negative_count = 0
    
    for token in doc:
        if token.lemma_.lower() in positive_words:
            positive_count += 1
        elif token.lemma_.lower() in negative_words:
            negative_count += 1
    
    total = positive_count + negative_count
    if total == 0:
        return {'sentiment': 'neutral', 'score': 0.5}
    
    sentiment_score = positive_count / total
    
    if sentiment_score > 0.6:
        sentiment = 'positive'
    elif sentiment_score < 0.4:
        sentiment = 'negative'
    else:
        sentiment = 'neutral'
    
    return {
        'sentiment': sentiment,
        'score': sentiment_score,
        'positive_count': positive_count,
        'negative_count': negative_count
    }


def calculate_text_similarity(text1: str, text2: str) -> float:
    """
    Calculate similarity between two texts using spaCy
    
    Args:
        text1: First text
        text2: Second text
        
    Returns:
        Similarity score between 0 and 1
    """
    nlp = get_nlp_model()
    doc1 = nlp(text1)
    doc2 = nlp(text2)
    
    return doc1.similarity(doc2)


def compute_tfidf_similarity(documents: List[str], query: Optional[str] = None) -> np.ndarray:
    """
    Compute TF-IDF similarity between documents
    
    Args:
        documents: List of text documents
        query: Optional query text to compare against documents
        
    Returns:
        Similarity matrix or similarity scores
    """
    global tfidf_vectorizer
    
    if len(documents) == 0:
        return np.array([])
    
    # Fit and transform the documents
    tfidf_matrix = tfidf_vectorizer.fit_transform(documents)
    
    if query:
        # Transform query and compute similarity with documents
        query_vector = tfidf_vectorizer.transform([query])
        similarities = cosine_similarity(query_vector, tfidf_matrix)[0]
        return similarities
    else:
        # Compute pairwise similarities between all documents
        similarity_matrix = cosine_similarity(tfidf_matrix, tfidf_matrix)
        return similarity_matrix


def get_content_based_recommendations(
    destination_descriptions: List[str],
    user_preferences_text: str,
    top_n: int = 10
) -> List[int]:
    """
    Get content-based recommendations using TF-IDF and cosine similarity
    
    Args:
        destination_descriptions: List of destination descriptions
        user_preferences_text: User's preference description
        top_n: Number of recommendations to return
        
    Returns:
        List of indices of recommended destinations
    """
    if not destination_descriptions:
        return []
    
    # Compute similarity between user preferences and destinations
    similarities = compute_tfidf_similarity(
        destination_descriptions, 
        user_preferences_text
    )
    
    # Get top N most similar destinations
    top_indices = np.argsort(similarities)[::-1][:top_n]
    
    return top_indices.tolist()


def normalize_features(features: np.ndarray) -> np.ndarray:
    """
    Normalize feature matrix using StandardScaler
    
    Args:
        features: Feature matrix to normalize
        
    Returns:
        Normalized feature matrix
    """
    global scaler
    return scaler.fit_transform(features)


def process_review_text(review_text: str) -> Dict[str, Any]:
    """
    Process review text to extract useful information
    
    Args:
        review_text: Review text to process
        
    Returns:
        Dictionary with extracted information
    """
    keywords = extract_keywords(review_text)
    entities = extract_entities(review_text)
    sentiment = analyze_sentiment(review_text)
    
    return {
        'keywords': keywords,
        'entities': entities,
        'sentiment': sentiment
    }
