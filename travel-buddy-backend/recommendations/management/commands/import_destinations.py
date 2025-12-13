import csv
import os
from django.core.management.base import BaseCommand
from recommendations.models import Destination


class Command(BaseCommand):
    help = 'Import destinations from CSV file'

    def add_arguments(self, parser):
        parser.add_argument(
            '--file',
            type=str,
            default='Pakistan_Tourist_Destinations_500.csv',
            help='Path to the CSV file (default: Pakistan_Tourist_Destinations_500.csv in project root)'
        )
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing destinations before import'
        )

    def handle(self, *args, **options):
        csv_file = options['file']
        clear_existing = options['clear']

        # If file path is not absolute, look in project root
        if not os.path.isabs(csv_file):
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
            csv_file = os.path.join(base_dir, '..', csv_file)
            csv_file = os.path.abspath(csv_file)

        if not os.path.exists(csv_file):
            self.stdout.write(self.style.ERROR(f'File not found: {csv_file}'))
            return

        # Clear existing destinations if requested
        if clear_existing:
            count = Destination.objects.count()
            Destination.objects.all().delete()
            self.stdout.write(self.style.WARNING(f'Deleted {count} existing destinations'))

        self.stdout.write(self.style.SUCCESS(f'Importing from: {csv_file}'))

        imported = 0
        skipped = 0
        errors = 0

        try:
            with open(csv_file, 'r', encoding='utf-8') as file:
                csv_reader = csv.DictReader(file)
                
                for row_num, row in enumerate(csv_reader, start=2):  # start=2 because row 1 is header
                    try:
                        # Parse travel options as a list for JSONField
                        travel_options = row.get('Travel Options', '')
                        travel_options_list = []
                        if travel_options:
                            # Remove quotes and split by comma
                            travel_options = travel_options.strip('"').replace('"', '')
                            travel_options_list = [opt.strip() for opt in travel_options.split(',')]

                        # Create destination
                        destination = Destination(
                            name=row['Destination Name'].strip(),
                            country=row['Country'].strip(),
                            description=row['Description'].strip(),
                            category=row['Category'].strip().lower(),
                            best_season=row['Best Season'].strip(),
                            travel_options=travel_options_list,  # Save as list for JSONField
                            # Set default values for fields not in CSV
                            latitude=None,  # Will be set to null
                            longitude=None,  # Will be set to null
                            price_range='moderate',
                            general_weather='',
                            weather_area=''
                        )
                        destination.save()
                        imported += 1

                        if imported % 50 == 0:
                            self.stdout.write(f'Imported {imported} destinations...')

                    except Exception as e:
                        errors += 1
                        self.stdout.write(
                            self.style.WARNING(f'Error on row {row_num}: {str(e)}')
                        )
                        continue

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Failed to read CSV file: {str(e)}'))
            return

        # Summary
        self.stdout.write(self.style.SUCCESS(f'\n=== Import Summary ==='))
        self.stdout.write(self.style.SUCCESS(f'✓ Successfully imported: {imported}'))
        if skipped > 0:
            self.stdout.write(self.style.WARNING(f'⚠ Skipped: {skipped}'))
        if errors > 0:
            self.stdout.write(self.style.ERROR(f'✗ Errors: {errors}'))
        self.stdout.write(self.style.SUCCESS(f'Total in database: {Destination.objects.count()}'))
