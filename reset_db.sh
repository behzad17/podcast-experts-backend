#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting database reset process...${NC}"

# Step 1: Run migrations
echo -e "${YELLOW}Running migrations...${NC}"
python3 manage.py migrate

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Migrations failed${NC}"
    exit 1
fi

# Step 2: Load fixture data
echo -e "${YELLOW}Loading fixture data...${NC}"
python3 manage.py loaddata fixtures/initial_data.json

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Loading fixture data failed${NC}"
    exit 1
fi

# Step 3: Verify data was loaded
echo -e "${YELLOW}Verifying data...${NC}"
python3 manage.py shell -c "
from podcasts.models import Podcast
from experts.models import ExpertProfile
print('Total Podcasts:', Podcast.objects.count())
print('Total Experts:', ExpertProfile.objects.count())
"

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Data verification failed${NC}"
    exit 1
fi

echo -e "${GREEN}Database reset completed successfully!${NC}" 