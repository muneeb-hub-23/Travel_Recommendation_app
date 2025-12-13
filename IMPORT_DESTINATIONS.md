# Import Destinations from CSV

This guide explains how to bulk import the 500 destinations from the CSV file into your database.

## Prerequisites

1. Make sure your Django backend server is **stopped** before running the import
2. The CSV file should be in the project root: `Pakistan_Tourist_Destinations_500.csv`

## Import Command

Open a terminal/PowerShell in the backend directory and run:

```powershell
cd e:\Projects\Travel_Recommendation_app\travel-buddy-backend
python manage.py import_destinations
```

## Command Options

### Basic Import
Imports all destinations from the CSV file:
```powershell
python manage.py import_destinations
```

### Clear and Import
**WARNING**: This deletes all existing destinations before importing:
```powershell
python manage.py import_destinations --clear
```

### Custom CSV File
Import from a different CSV file:
```powershell
python manage.py import_destinations --file "path/to/your/file.csv"
```

## What Gets Imported

From the CSV:
- ✓ Destination Name
- ✓ Country
- ✓ Description
- ✓ Category (beach, mountain, city, historical, adventure, cultural)
- ✓ Best Season
- ✓ Travel Options (as a list: bus, car, bike, plane, train)

Default values (you can edit these later via frontend):
- Price Range: "moderate"
- Latitude/Longitude: null (add via map in frontend)
- Image: null (add via frontend edit)
- Weather Info: empty (fetch via frontend)
- Activities: empty
- Accommodation: empty

## After Import

1. Start your Django server:
   ```powershell
   python manage.py runserver
   ```

2. Go to Admin Dashboard → Destinations tab

3. You'll see all 500 destinations listed

4. Click **Edit** on any destination to:
   - Upload an image
   - Add latitude/longitude using the map
   - Fetch weather information
   - Update price range
   - Add activities and accommodation info

## Expected Output

```
Importing from: E:\Projects\Travel_Recommendation_app\Pakistan_Tourist_Destinations_500.csv
Imported 50 destinations...
Imported 100 destinations...
Imported 150 destinations...
...
Imported 500 destinations...

=== Import Summary ===
✓ Successfully imported: 500
Total in database: 500
```

## Troubleshooting

### Error: "File not found"
- Make sure the CSV file is in the correct location
- Check the file name is exactly: `Pakistan_Tourist_Destinations_500.csv`

### Error: "No module named 'recommendations.management'"
- Make sure you created the directory structure correctly
- Restart your terminal/IDE

### Duplicate Destinations
- The import doesn't check for duplicates
- Use `--clear` flag to remove all existing destinations first
- Or manually delete destinations from the admin dashboard before importing

## Database Backup (Recommended)

Before running with `--clear` flag, backup your database:
```powershell
# SQLite backup (if using SQLite)
copy db.sqlite3 db.sqlite3.backup
```
