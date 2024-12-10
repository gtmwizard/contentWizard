-- First update NULL metadata values to empty JSON object
UPDATE "Profile" SET metadata = '{}' WHERE metadata IS NULL;

-- Then make the column required with a default value
ALTER TABLE "Profile" ALTER COLUMN "metadata" SET NOT NULL,
                      ALTER COLUMN "metadata" SET DEFAULT '{}'; 