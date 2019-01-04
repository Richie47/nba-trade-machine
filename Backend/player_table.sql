/*
Uncomment the things below to create a new table
*/

-- Create a new table called 'NBA_TEAM' in schema 'dbo'
-- Drop the table if it already exists
IF OBJECT_ID('dbo.NBA_TEAM', 'U') IS NOT NULL
DROP TABLE NBA_TEAM
GO

CREATE TABLE dbo.NBA_TEAM
 (  ID [NVARCHAR](500) PRIMARY KEY,
    Team [NVARCHAR](500),
   Age [NVARCHAR](500),
  Name [NVARCHAR](500),
   Picture [NVARCHAR](500),
   Salary  [NVARCHAR](500),
   PPG   [NVARCHAR](500),
  RPG [NVARCHAR](500),
  APG [NVARCHAR](500),
  PER [NVARCHAR](500)
)


/*
Uncomment the things below to create a new table
*/

-- Create a new table called 'NBA_TEAM' in schema 'dbo'
-- Drop the table if it already exists

--Just run the table
SELECT * FROM dbo.NBA_TEAM
GO
