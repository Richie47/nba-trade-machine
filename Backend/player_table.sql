/*
Uncomment the things below to create a new table
*/

-- Create a new table called 'NBA_TEAM' in schema 'dbo'
-- Drop the table if it already exists
--IF OBJECT_ID('dbo.NBA_TEAM', 'U') IS NOT NULL
--DROP TABLE dbo.NBA_TEAM
--GO
-- Create the table in the specified schema
--CREATE TABLE dbo.NBA_TEAM
--TODO: CREATE A PRIMARY KEY
--(
--   Name      [NVARCHAR](50)   NOT NULL ,
--   Age      [NVARCHAR](50)  NOT NULL,
--   Salary   [NVARCHAR](50)  NOT NULL
--);

--Just run the table
SELECT * FROM NBA_TEAM
GO
