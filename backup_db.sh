#!/bin/bash

# Get the current date for the backup file name
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups"
BACKUP_FILE="$BACKUP_DIR/db_backup_$DATE.sqlite3"

# Create backups directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Copy the database file
cp db.sqlite3 "$BACKUP_FILE"

# Keep only the last 5 backups
ls -t $BACKUP_DIR/db_backup_* | tail -n +6 | xargs -r rm

echo "Database backup created at $BACKUP_FILE" 