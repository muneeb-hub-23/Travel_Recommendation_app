"""
Setup script for ML dependencies
Run this script to install and configure spaCy and scikit-learn
"""
import subprocess
import sys


def run_command(command, description):
    """Run a shell command and print status"""
    print(f"\n{description}...")
    try:
        subprocess.run(command, check=True, shell=True)
        print(f"✓ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ {description} failed: {e}")
        return False


def main():
    print("=" * 60)
    print("Travel Buddy ML Setup Script")
    print("=" * 60)
    
    # Step 1: Install requirements
    if not run_command(
        f"{sys.executable} -m pip install -r requirements.txt",
        "Installing Python dependencies"
    ):
        print("\nFailed to install dependencies. Please check requirements.txt")
        return False
    
    # Step 2: Download spaCy model
    print("\nChoose spaCy model to download:")
    print("1. en_core_web_sm (Small - 11 MB, Fast)")
    print("2. en_core_web_md (Medium - 40 MB, Better accuracy)")
    print("3. en_core_web_lg (Large - 560 MB, Best accuracy)")
    
    choice = input("\nEnter your choice (1-3) [default: 1]: ").strip() or "1"
    
    models = {
        "1": "en_core_web_sm",
        "2": "en_core_web_md",
        "3": "en_core_web_lg"
    }
    
    model_name = models.get(choice, "en_core_web_sm")
    
    if not run_command(
        f"{sys.executable} -m spacy download {model_name}",
        f"Downloading spaCy model: {model_name}"
    ):
        print("\nFailed to download spaCy model.")
        print("You can try manually with:")
        print(f"  python -m spacy download {model_name}")
        return False
    
    # Step 3: Test installation
    print("\nTesting ML setup...")
    try:
        import spacy
        import sklearn
        import numpy
        import pandas
        
        print("✓ All packages imported successfully")
        
        # Test spaCy model
        nlp = spacy.load(model_name)
        doc = nlp("This is a test sentence.")
        print(f"✓ spaCy model '{model_name}' loaded successfully")
        
        print("\n" + "=" * 60)
        print("ML Setup Complete!")
        print("=" * 60)
        print("\nYou can now:")
        print("1. Run the Django server: python manage.py runserver")
        print("2. Use ML-powered recommendations in your API")
        print("\nNew API endpoints available:")
        print("- GET /api/destinations/ml_recommended/")
        print("- GET /api/destinations/{id}/similar/")
        print("- GET /api/destinations/{id}/keywords/")
        print("- GET /api/destinations/{id}/sentiment_analysis/")
        print("\nSee ML_SETUP.md for more details.")
        
        return True
        
    except Exception as e:
        print(f"\n✗ Testing failed: {e}")
        return False


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
