-- ============================================================
--  ADMIN SETUP FIX SCRIPT
--  Run this in SSMS on your MOM_PROJECT database
--  This ensures the admin user exists with correct credentials
-- ============================================================

-- Step 1: Make sure MOM_User table exists
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'MOM_User')
BEGIN
    CREATE TABLE MOM_User (
        UserID   INT IDENTITY(1,1) PRIMARY KEY,
        Username NVARCHAR(50)  NOT NULL UNIQUE,
        Password NVARCHAR(100) NOT NULL,
        Role     NVARCHAR(20)  NOT NULL DEFAULT 'Member',
        Created  DATETIME      NOT NULL DEFAULT GETDATE(),
        Modified DATETIME      NOT NULL DEFAULT GETDATE()
    );
END
GO

-- Step 2: Add ProfilePhoto column if missing
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('MOM_User') AND name = 'ProfilePhoto')
    ALTER TABLE MOM_User ADD ProfilePhoto NVARCHAR(255) NULL;
GO

-- Step 3: Update Login stored procedure (ensures ProfilePhoto is returned)
CREATE OR ALTER PROCEDURE PR_MST_User_Login
    @Username NVARCHAR(50),
    @Password NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT UserID, Username, Role, ProfilePhoto
    FROM MOM_User
    WHERE Username = @Username AND Password = @Password;
END
GO

-- Step 4: Update Register stored procedure
CREATE OR ALTER PROCEDURE PR_MST_User_Register
    @Username NVARCHAR(50),
    @Password NVARCHAR(100),
    @Role     NVARCHAR(20) = 'Member'
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM MOM_User WHERE Username = @Username)
    BEGIN
        RAISERROR('Username already exists. Please choose a different username.', 16, 1);
        RETURN;
    END

    INSERT INTO MOM_User (Username, Password, Role, Created, Modified)
    VALUES (@Username, @Password, @Role, GETDATE(), GETDATE());

    SELECT UserID, Username, Role, ProfilePhoto
    FROM MOM_User
    WHERE UserID = SCOPE_IDENTITY();
END
GO

-- Step 5: Remove any existing admin user cleanly and re-create
DELETE FROM MOM_User WHERE Role = 'Admin';
GO

INSERT INTO MOM_User (Username, Password, Role, Created, Modified)
VALUES ('admin', 'admin123', 'Admin', GETDATE(), GETDATE());
GO

-- Step 6: Verify
SELECT UserID, Username, Role FROM MOM_User WHERE Role = 'Admin';
GO

-- ============================================================
--  After running this script:
--  Admin Login URL : /Admin/AdminLogin
--  Username        : admin
--  Password        : admin123
-- ============================================================
