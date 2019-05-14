/*
Uncomment the things below to create a new table
*/

-- Create a new table called 'NBA_TEAM' in schema 'dbo'
-- Drop the table if it already exists
/* uncomment multiline to create table
IF OBJECT_ID('dbo.NBA_TEAM', 'U') IS NOT NULL
DROP TABLE dbo.NBA_TEAM
GO
-- Create the table in the specified schema
CREATE TABLE dbo.NBA_TEAM
--TODO: CREATE A PRIMARY KEY
(
   ID [NVARCHAR](50),
   Name [NVARCHAR](50),
   Team [NVARCHAR](50),
   Picture  [NVARCHAR](100),
   Age      [NVARCHAR](50),
   Salary   [NVARCHAR](50),
   YearsLeft [NVARCHAR](10),
   Position [NVARCHAR](10),
   PPG [NVARCHAR](10),
   RPG [NVARCHAR](10),
   APG [NVARCHAR](10),
   PER [NVARCHAR](10),
   PRIMARY KEY (ID)
);
*/
--Just run the table 
SELECT * FROM dbo.NBA_TEAM
GO
