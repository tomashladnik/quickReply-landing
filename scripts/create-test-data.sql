-- SQL script to create test data for Parent Portal
-- Run this in pgAdmin or psql

-- Create test schools
INSERT INTO school (id, name, district, "createdAt", "updatedAt")
VALUES 
  ('test-school-1', 'Parkview Elementary School', 'Sample School District', NOW(), NOW()),
  ('test-school-2', 'Westview Middle School', 'Sample School District', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Create school codes
INSERT INTO school_code (id, code, "schoolId", "isActive", "createdAt")
VALUES 
  ('test-code-1', 'PS123-DSCAN', 'test-school-1', true, NOW()),
  ('test-code-2', 'WESTVIEW-SCAN', 'test-school-2', true, NOW())
ON CONFLICT (code) DO NOTHING;

-- Verify the data
SELECT s.name as school_name, sc.code as school_code, sc."isActive"
FROM school s
JOIN school_code sc ON s.id = sc."schoolId"
WHERE sc.code IN ('PS123-DSCAN', 'WESTVIEW-SCAN');

