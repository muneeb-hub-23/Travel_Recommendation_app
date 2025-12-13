from django.core.management.base import BaseCommand
from django.db.models import Count
from recommendations.models import Destination


class Command(BaseCommand):
    help = 'Remove duplicate destinations based on name, keeping the first occurrence'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be deleted without actually deleting'
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']

        if dry_run:
            self.stdout.write(self.style.WARNING('=== DRY RUN MODE - No changes will be made ===\n'))

        # Find all destination names that have duplicates
        duplicates = (
            Destination.objects.values('name')
            .annotate(count=Count('id'))
            .filter(count__gt=1)
        )

        if not duplicates:
            self.stdout.write(self.style.SUCCESS('✓ No duplicate destinations found!'))
            return

        self.stdout.write(f'Found {len(duplicates)} destination names with duplicates:\n')

        total_deleted = 0
        total_kept = 0

        for duplicate in duplicates:
            name = duplicate['name']
            count = duplicate['count']
            
            # Get all destinations with this name
            destinations = Destination.objects.filter(name=name).order_by('id')
            
            # Keep the first one, delete the rest
            first = destinations.first()
            to_delete = destinations.exclude(id=first.id)
            delete_count = to_delete.count()
            
            self.stdout.write(f'  • "{name}" - Found {count} occurrences')
            self.stdout.write(f'    Keeping: ID {first.id} (Category: {first.category}, Season: {first.best_season})')
            
            if dry_run:
                self.stdout.write(f'    Would delete: {delete_count} duplicates')
                for dest in to_delete:
                    self.stdout.write(f'      - ID {dest.id} (Category: {dest.category}, Season: {dest.best_season})')
            else:
                deleted_ids = list(to_delete.values_list('id', flat=True))
                to_delete.delete()
                self.stdout.write(self.style.WARNING(f'    Deleted: {delete_count} duplicates (IDs: {deleted_ids})'))
                total_deleted += delete_count
                total_kept += 1
            
            self.stdout.write('')  # Empty line for readability

        # Summary
        self.stdout.write(self.style.SUCCESS('\n=== Summary ==='))
        if dry_run:
            self.stdout.write(f'Would keep: {len(duplicates)} unique destinations')
            self.stdout.write(f'Would delete: {sum(d["count"] - 1 for d in duplicates)} duplicates')
            self.stdout.write(self.style.WARNING('\nRun without --dry-run to actually delete duplicates'))
        else:
            self.stdout.write(self.style.SUCCESS(f'✓ Kept: {len(duplicates)} unique destinations'))
            self.stdout.write(self.style.SUCCESS(f'✓ Deleted: {total_deleted} duplicates'))
            self.stdout.write(self.style.SUCCESS(f'Total destinations in database: {Destination.objects.count()}'))
