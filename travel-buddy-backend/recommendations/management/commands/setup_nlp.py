"""
Management command to download and setup NLP models
"""
from django.core.management.base import BaseCommand
import subprocess
import sys


class Command(BaseCommand):
    help = 'Download and setup NLP models (spaCy)'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('=== Setting up NLP Models ===\n'))
        
        # Download spaCy English model
        self.stdout.write('Downloading spaCy English model (en_core_web_sm)...')
        try:
            subprocess.check_call([
                sys.executable, '-m', 'spacy', 'download', 'en_core_web_sm'
            ])
            self.stdout.write(self.style.SUCCESS('✓ spaCy model downloaded successfully!\n'))
        except subprocess.CalledProcessError as e:
            self.stdout.write(self.style.ERROR(f'✗ Failed to download spaCy model: {e}\n'))
            self.stdout.write(self.style.WARNING('Please run manually: python -m spacy download en_core_web_sm\n'))
            return
        
        # Test if model loads
        self.stdout.write('Testing NLP model...')
        try:
            import spacy
            nlp = spacy.load("en_core_web_sm")
            self.stdout.write(self.style.SUCCESS('✓ NLP model loaded successfully!\n'))
            
            # Test with a sample query
            test_query = "show me lakes"
            doc = nlp(test_query)
            self.stdout.write(f'\nTest query: "{test_query}"')
            self.stdout.write(f'Extracted tokens: {[token.text for token in doc]}')
            self.stdout.write(f'Nouns: {[token.text for token in doc if token.pos_ == "NOUN"]}\n')
            
            self.stdout.write(self.style.SUCCESS('\n=== NLP Setup Complete! ==='))
            self.stdout.write('The smart search is now enhanced with:')
            self.stdout.write('  ✓ spaCy for natural language understanding')
            self.stdout.write('  ✓ Part-of-speech tagging')
            self.stdout.write('  ✓ Lemmatization for better keyword matching')
            self.stdout.write('\nYou can now use queries like:')
            self.stdout.write('  - "show me lakes"')
            self.stdout.write('  - "find cultural places"')
            self.stdout.write('  - "I want to see mountains"')
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'✗ Error testing model: {e}'))
