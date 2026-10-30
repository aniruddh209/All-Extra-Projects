
-- ============================================================
-- FIX: Replace global UNIQUE on DepartmentName with a
--      per-user composite unique (DepartmentName, UserID)
--      so multiple users can each have e.g. "Finance".
--      Run this block ONCE against your MOM_PROJECT database.
-- ============================================================

-- Step 1: Drop the old global unique constraint on DepartmentName
DECLARE @dropSql NVARCHAR(500);
SELECT TOP 1 @dropSql = 'ALTER TABLE MOM_Department DROP CONSTRAINT ' + kc.name
FROM sys.key_constraints kc
INNER JOIN sys.index_columns ic
    ON ic.object_id = kc.parent_object_id AND ic.index_id = kc.unique_index_id
INNER JOIN sys.columns c
    ON c.object_id = ic.object_id AND c.column_id = ic.column_id
WHERE kc.type = 'UQ'
  AND kc.parent_object_id = OBJECT_ID('MOM_Department')
  AND c.name = 'DepartmentName';
IF @dropSql IS NOT NULL EXEC(@dropSql);
GO

-- Step 2: Add composite unique (DepartmentName, UserID)
--         Now each user can have their own "Finance", "IT", etc.
IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE name = 'UQ_Department_Name_User'
      AND object_id = OBJECT_ID('MOM_Department')
)
    ALTER TABLE MOM_Department
    ADD CONSTRAINT UQ_Department_Name_User UNIQUE (DepartmentName, UserID);
GO

-- ============================================================

-- Create MOM_User table (only if not exists)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'MOM_User')
BEGIN
    CREATE TABLE MOM_User
    (
        UserID       INT IDENTITY(1,1) PRIMARY KEY,
        Username     NVARCHAR(50)  NOT NULL UNIQUE,
        Password     NVARCHAR(100) NOT NULL,
        Role         NVARCHAR(20)  NOT NULL DEFAULT 'Member',
        Created      DATETIME      NOT NULL DEFAULT GETDATE(),
        Modified     DATETIME      NOT NULL DEFAULT GETDATE()
    );
END
GO

IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('MOM_User') AND name = 'ProfilePhoto')
    ALTER TABLE MOM_User ADD ProfilePhoto NVARCHAR(255) NULL;
GO

-- Add UserID column to MOM_Meetings (only if not exists)
IF NOT EXISTS (
    SELECT * FROM sys.columns
    WHERE object_id = OBJECT_ID('MOM_Meetings') AND name = 'UserID'
)
BEGIN
    ALTER TABLE MOM_Meetings ADD UserID INT NULL;
END
GO

-- Add UserID / DepartmentLogo columns to master tables (only if not exists)
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('MOM_Department') AND name = 'UserID')
    ALTER TABLE MOM_Department ADD UserID INT NULL;
GO
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('MOM_Department') AND name = 'DepartmentLogo')
    ALTER TABLE MOM_Department ADD DepartmentLogo NVARCHAR(255) NULL;
GO
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('MOM_Staff') AND name = 'UserID')
    ALTER TABLE MOM_Staff ADD UserID INT NULL;
GO
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('MOM_MeetingType') AND name = 'UserID')
    ALTER TABLE MOM_MeetingType ADD UserID INT NULL;
GO
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('MOM_MeetingVenue') AND name = 'UserID')
    ALTER TABLE MOM_MeetingVenue ADD UserID INT NULL;
GO

-- STORED PROCEDURES: MOM_User (Auth)


-- Register a new user
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

-- Login (check username + password)
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

-- Update user profile photo
CREATE OR ALTER PROCEDURE PR_MST_User_UpdateProfile
    @UserID INT,
    @ProfilePhoto NVARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE MOM_User
    SET ProfilePhoto = @ProfilePhoto,
        Modified = GETDATE()
    WHERE UserID = @UserID;
END
GO

-- 1. MOM_MeetingType

CREATE OR ALTER PROCEDURE PR_MOM_MeetingType_SelectAll
    @UserID INT = NULL,
    @SearchText VARCHAR(255) = NULL
AS
BEGIN
    SELECT MeetingTypeID, MeetingTypeName, Remarks
    FROM MOM_MeetingType
    WHERE (@UserID IS NULL OR UserID = @UserID)
      AND (@SearchText IS NULL OR MeetingTypeName LIKE '%' + @SearchText + '%')
    ORDER BY MeetingTypeName
END
GO

CREATE OR ALTER PROCEDURE PR_MOM_MeetingType_SelectByPK
    @MeetingTypeID INT
AS
BEGIN
    SELECT MeetingTypeID, MeetingTypeName, Remarks
    FROM MOM_MeetingType
    WHERE MeetingTypeID = @MeetingTypeID
END
GO

CREATE OR ALTER PROCEDURE PR_MOM_MeetingType_Insert
    @MeetingTypeName NVARCHAR(100),
    @Remarks NVARCHAR(100),
    @UserID INT = NULL
AS
BEGIN
    INSERT INTO MOM_MeetingType (MeetingTypeName, Remarks, UserID, Created, Modified)
    VALUES (@MeetingTypeName, @Remarks, @UserID, GETDATE(), GETDATE())
END
GO

CREATE OR ALTER PROCEDURE PR_MOM_MeetingType_UpdateByPK
    @MeetingTypeID INT,
    @MeetingTypeName NVARCHAR(100),
    @Remarks NVARCHAR(100)
AS
BEGIN
    UPDATE MOM_MeetingType
    SET MeetingTypeName = @MeetingTypeName,
        Remarks = @Remarks,
        Modified = GETDATE()
    WHERE MeetingTypeID = @MeetingTypeID
END
GO

CREATE OR ALTER PROCEDURE PR_MOM_MeetingType_DeleteByPK
    @MeetingTypeID INT
AS
BEGIN
    DELETE FROM MOM_MeetingType
    WHERE MeetingTypeID = @MeetingTypeID
END
GO

-- 2. MOM_Department


CREATE OR ALTER PROCEDURE PR_MOM_Department_SelectAll
    @UserID INT = NULL,
    @SearchText VARCHAR(255) = NULL
AS
BEGIN
    SELECT DepartmentID, DepartmentName, DepartmentLogo
    FROM MOM_Department
    WHERE (@UserID IS NULL OR UserID = @UserID)
      AND (@SearchText IS NULL OR DepartmentName LIKE '%' + @SearchText + '%')
    ORDER BY DepartmentName
END
GO

CREATE OR ALTER PROCEDURE PR_MOM_Department_SelectByPK
    @DepartmentID INT
AS
BEGIN
    SELECT DepartmentID, DepartmentName, DepartmentLogo, Created, Modified
    FROM MOM_Department
    WHERE DepartmentID = @DepartmentID
END
GO

CREATE OR ALTER PROCEDURE PR_MOM_Department_Insert
    @DepartmentName NVARCHAR(100),
    @DepartmentLogo NVARCHAR(255) = NULL,
    @UserID INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Check for duplicate department name for this specific user
    IF EXISTS (
        SELECT 1 FROM MOM_Department
        WHERE DepartmentName = @DepartmentName
          AND ((@UserID IS NULL AND UserID IS NULL) OR UserID = @UserID)
    )
    BEGIN
        RAISERROR('A department with this name already exists. Please use a different name.', 16, 1);
        RETURN;
    END

    INSERT INTO MOM_Department (DepartmentName, DepartmentLogo, UserID, Created, Modified)
    VALUES (@DepartmentName, @DepartmentLogo, @UserID, GETDATE(), GETDATE())
END
GO

CREATE OR ALTER PROCEDURE PR_MOM_Department_UpdateByPK
    @DepartmentID INT,
    @DepartmentName NVARCHAR(100),
    @DepartmentLogo NVARCHAR(255) = NULL
AS
BEGIN
    UPDATE MOM_Department
    SET DepartmentName = @DepartmentName,
        DepartmentLogo = @DepartmentLogo,
        Modified = GETDATE()
    WHERE DepartmentID = @DepartmentID
END
GO

CREATE OR ALTER PROCEDURE PR_MOM_Department_DeleteByPK
    @DepartmentID INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Block delete if staff are assigned to this department
    IF EXISTS (SELECT 1 FROM MOM_Staff WHERE DepartmentID = @DepartmentID)
    BEGIN
        RAISERROR('Cannot delete this department because staff members are assigned to it. Please reassign or remove the staff first.', 16, 1);
        RETURN;
    END

    -- Block delete if meetings are linked to this department
    IF EXISTS (SELECT 1 FROM MOM_Meetings WHERE DepartmentID = @DepartmentID)
    BEGIN
        RAISERROR('Cannot delete this department because meetings are associated with it. Please remove the meetings first.', 16, 1);
        RETURN;
    END

    DELETE FROM MOM_Department
    WHERE DepartmentID = @DepartmentID
END
GO

-- 3. MOM_MeetingVenue

CREATE OR ALTER PROCEDURE PR_MOM_MeetingVenue_SelectAll
    @UserID INT = NULL,
    @SearchText VARCHAR(255) = NULL
AS
BEGIN
    SELECT MeetingVenueID, MeetingVenueName, Created
    FROM MOM_MeetingVenue
    WHERE (@UserID IS NULL OR UserID = @UserID)
      AND (@SearchText IS NULL OR MeetingVenueName LIKE '%' + @SearchText + '%')
    ORDER BY MeetingVenueName
END
GO

CREATE OR ALTER PROCEDURE PR_MOM_MeetingVenue_SelectByPK
    @MeetingVenueID INT
AS
BEGIN
    SELECT MeetingVenueID, MeetingVenueName
    FROM MOM_MeetingVenue
    WHERE MeetingVenueID = @MeetingVenueID
END
GO

CREATE OR ALTER PROCEDURE PR_MOM_MeetingVenue_Insert
    @MeetingVenueName NVARCHAR(100),
    @UserID INT = NULL
AS
BEGIN
    INSERT INTO MOM_MeetingVenue (MeetingVenueName, UserID, Created, Modified)
    VALUES (@MeetingVenueName, @UserID, GETDATE(), GETDATE())
END
GO

CREATE OR ALTER PROCEDURE PR_MOM_MeetingVenue_UpdateByPK
    @MeetingVenueID INT,
    @MeetingVenueName NVARCHAR(100)
AS
BEGIN
    UPDATE MOM_MeetingVenue
    SET MeetingVenueName = @MeetingVenueName,
        Modified = GETDATE()
    WHERE MeetingVenueID = @MeetingVenueID
END
GO

CREATE OR ALTER PROCEDURE PR_MOM_MeetingVenue_DeleteByPK
    @MeetingVenueID INT
AS
BEGIN
    DELETE FROM MOM_MeetingVenue
    WHERE MeetingVenueID = @MeetingVenueID
END
GO

-- 4. MOM_Staff

CREATE OR ALTER PROCEDURE PR_MOM_Staff_SelectAll
    @UserID INT = NULL,
    @SearchText VARCHAR(255) = NULL
AS
BEGIN
    SELECT S.StaffID, S.StaffName, S.MobileNo, S.EmailAddress, D.DepartmentName, S.Remarks
    FROM MOM_Staff S
    INNER JOIN MOM_Department D ON S.DepartmentID = D.DepartmentID
    WHERE (@UserID IS NULL OR S.UserID = @UserID)
      AND (@SearchText IS NULL OR S.StaffName LIKE '%' + @SearchText + '%')
    ORDER BY S.StaffName
END
GO

CREATE OR ALTER PROCEDURE PR_MOM_Staff_SelectByPK
    @StaffID INT
AS
BEGIN
    SELECT StaffID, DepartmentID, StaffName, MobileNo, EmailAddress, Remarks
    FROM MOM_Staff
    WHERE StaffID = @StaffID
END
GO

CREATE OR ALTER PROCEDURE PR_MOM_Staff_Insert
    @DepartmentID INT,
    @StaffName NVARCHAR(50),
    @MobileNo NVARCHAR(20),
    @EmailAddress NVARCHAR(50),
    @Remarks NVARCHAR(250),
    @UserID INT = NULL
AS
BEGIN
    INSERT INTO MOM_Staff (DepartmentID, StaffName, MobileNo, EmailAddress, Remarks, UserID, Created, Modified)
    VALUES (@DepartmentID, @StaffName, @MobileNo, @EmailAddress, @Remarks, @UserID, GETDATE(), GETDATE())
END
GO

CREATE OR ALTER PROCEDURE PR_MOM_Staff_UpdateByPK
    @StaffID INT,
    @DepartmentID INT,
    @StaffName NVARCHAR(50),
    @MobileNo NVARCHAR(20),
    @EmailAddress NVARCHAR(50),
    @Remarks NVARCHAR(250)
AS
BEGIN
    UPDATE MOM_Staff
    SET DepartmentID = @DepartmentID,
        StaffName = @StaffName,
        MobileNo = @MobileNo,
        EmailAddress = @EmailAddress,
        Remarks = @Remarks,
        Modified = GETDATE()
    WHERE StaffID = @StaffID
END
GO

CREATE OR ALTER PROCEDURE PR_MOM_Staff_DeleteByPK
    @StaffID INT
AS
BEGIN
    DELETE FROM MOM_Staff
    WHERE StaffID = @StaffID
END
GO

-- 5. MOM_Meetings

CREATE OR ALTER PROCEDURE PR_MOM_Meetings_SelectAll
    @UserID INT = NULL,
    @SearchText VARCHAR(255) = NULL
AS
BEGIN
    SELECT M.MeetingID, M.MeetingDate, V.MeetingVenueName,
           T.MeetingTypeName, D.DepartmentName, M.MeetingDescription,
           M.CancellationReason, M.CancellationDateTime, M.DocumentPath, M.IsCancelled
    FROM MOM_Meetings M
    INNER JOIN MOM_MeetingVenue V ON M.MeetingVenueID = V.MeetingVenueID
    INNER JOIN MOM_MeetingType  T ON M.MeetingTypeID  = T.MeetingTypeID
    INNER JOIN MOM_Department   D ON M.DepartmentID   = D.DepartmentID
    WHERE (@UserID IS NULL OR M.UserID = @UserID)
      AND (@SearchText IS NULL OR M.MeetingDescription LIKE '%' + @SearchText + '%')
    ORDER BY M.MeetingDate DESC
END
GO

CREATE OR ALTER PROCEDURE PR_MOM_Meetings_SelectByPK
    @MeetingID INT
AS
BEGIN
    SELECT M.MeetingID, M.MeetingDate, M.MeetingDescription,
           M.MeetingVenueID, V.MeetingVenueName,
           M.MeetingTypeID,  T.MeetingTypeName,
           M.DepartmentID,   D.DepartmentName,
           M.CancellationReason, M.CancellationDateTime, M.DocumentPath, M.IsCancelled
    FROM MOM_Meetings M
    INNER JOIN MOM_MeetingVenue V ON M.MeetingVenueID = V.MeetingVenueID
    INNER JOIN MOM_MeetingType  T ON M.MeetingTypeID  = T.MeetingTypeID
    INNER JOIN MOM_Department   D ON M.DepartmentID   = D.DepartmentID
    WHERE M.MeetingID = @MeetingID
END
GO

CREATE OR ALTER PROCEDURE PR_MOM_Meetings_Insert
(
    @MeetingDate        DATETIME,
    @MeetingVenueID     INT,
    @MeetingTypeID      INT,
    @DepartmentID       INT,
    @MeetingDescription NVARCHAR(250),
    @DocumentPath       NVARCHAR(500) = NULL,
    @UserID             INT = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO MOM_Meetings
    (
        MeetingDate,
        MeetingVenueID,
        MeetingTypeID,
        DepartmentID,
        MeetingDescription,
        DocumentPath,
        IsCancelled,
        CancellationDateTime,
        CancellationReason,
        UserID,
        Created,
        Modified
    )
    VALUES
    (
        @MeetingDate,
        @MeetingVenueID,
        @MeetingTypeID,
        @DepartmentID,
        @MeetingDescription,
        @DocumentPath,
        0,
        NULL,
        NULL,
        @UserID,
        GETDATE(),
        GETDATE()
    );
END
GO

CREATE OR ALTER PROCEDURE PR_MOM_Meetings_UpdateByPK
(
    @MeetingID           INT,
    @MeetingDate         DATETIME,
    @MeetingVenueID      INT,
    @MeetingTypeID       INT,
    @DepartmentID        INT,
    @MeetingDescription  NVARCHAR(250),
    @DocumentPath        NVARCHAR(500) = NULL,
    @IsCancelled         BIT = 0,
    @CancellationDateTime DATETIME = NULL,
    @CancellationReason  NVARCHAR(250) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE MOM_Meetings
    SET
        MeetingDate          = @MeetingDate,
        MeetingVenueID       = @MeetingVenueID,
        MeetingTypeID        = @MeetingTypeID,
        DepartmentID         = @DepartmentID,
        MeetingDescription   = @MeetingDescription,
        DocumentPath         = @DocumentPath,
        IsCancelled          = @IsCancelled,
        CancellationDateTime = @CancellationDateTime,
        CancellationReason   = @CancellationReason,
        Modified             = GETDATE()
    WHERE MeetingID = @MeetingID;
END
GO

CREATE OR ALTER PROCEDURE PR_MOM_Meetings_DeleteByPK
    @MeetingID INT
AS
BEGIN
    DELETE FROM MOM_Meetings
    WHERE MeetingID = @MeetingID
END
GO

-- 6. MOM_MeetingMember

CREATE OR ALTER PROCEDURE PR_MOM_MeetingMember_SelectByMeetingID
    @MeetingID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        MM.MeetingMemberID,
        MM.MeetingID,
        MM.StaffID,
        S.StaffName,
        D.DepartmentName,
        MM.IsPresent,
        MM.Remarks
    FROM MOM_MeetingMember MM
    INNER JOIN MOM_Staff      S ON MM.StaffID = S.StaffID
    INNER JOIN MOM_Department D ON S.DepartmentID = D.DepartmentID
    WHERE MM.MeetingID = @MeetingID
    ORDER BY S.StaffName;
END
GO

CREATE OR ALTER PROCEDURE PR_MOM_MeetingMember_SelectByPK
    @MeetingMemberID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        MM.MeetingMemberID,
        MM.MeetingID,
        MM.StaffID,
        S.StaffName,
        D.DepartmentName,
        MM.IsPresent,
        MM.Remarks
    FROM MOM_MeetingMember MM
    INNER JOIN MOM_Staff      S ON MM.StaffID = S.StaffID
    INNER JOIN MOM_Department D ON S.DepartmentID = D.DepartmentID
    WHERE MM.MeetingMemberID = @MeetingMemberID;
END
GO

CREATE OR ALTER PROCEDURE PR_MOM_MeetingMember_Insert
    @MeetingID INT,
    @StaffID   INT,
    @IsPresent BIT,
    @Remarks   NVARCHAR(250)
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM MOM_MeetingMember
        WHERE MeetingID = @MeetingID
          AND StaffID   = @StaffID
    )
    BEGIN
        RAISERROR('Staff already added to this meeting.', 16, 1);
        RETURN;
    END

    INSERT INTO MOM_MeetingMember
    (
        MeetingID,
        StaffID,
        IsPresent,
        Remarks,
        Created,
        Modified
    )
    VALUES
    (
        @MeetingID,
        @StaffID,
        @IsPresent,
        @Remarks,
        GETDATE(),
        GETDATE()
    );
END
GO

CREATE OR ALTER PROCEDURE PR_MOM_MeetingMember_UpdateByPK
    @MeetingMemberID INT,
    @IsPresent       BIT,
    @Remarks         NVARCHAR(250)
AS
BEGIN
    UPDATE MOM_MeetingMember
    SET IsPresent = @IsPresent,
        Remarks   = @Remarks,
        Modified  = GETDATE()
    WHERE MeetingMemberID = @MeetingMemberID;
END
GO

CREATE OR ALTER PROCEDURE PR_MOM_MeetingMember_DeleteByPK
    @MeetingMemberID INT
AS
BEGIN
    DELETE FROM MOM_MeetingMember
    WHERE MeetingMemberID = @MeetingMemberID;
END
GO

-- 7. Attendance Report

CREATE OR ALTER PROCEDURE PR_MOM_Attendance_Report
    @StartDate DATE,
    @EndDate   DATE,
    @UserID    INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        M.MeetingID,
        M.MeetingDate,
        MT.MeetingTypeName,
        MV.MeetingVenueName,
        D.DepartmentName,
        S.StaffName,
        S.EmailAddress,
        MM.IsPresent,
        MM.Remarks
    FROM MOM_MeetingMember MM
    INNER JOIN MOM_Meetings     M  ON MM.MeetingID    = M.MeetingID
    INNER JOIN MOM_Staff        S  ON MM.StaffID      = S.StaffID
    INNER JOIN MOM_Department   D  ON S.DepartmentID  = D.DepartmentID
    INNER JOIN MOM_MeetingType  MT ON M.MeetingTypeID = MT.MeetingTypeID
    INNER JOIN MOM_MeetingVenue MV ON M.MeetingVenueID = MV.MeetingVenueID
    WHERE M.MeetingDate >= @StartDate
      AND M.MeetingDate <  DATEADD(DAY, 1, @EndDate)
      AND (@UserID IS NULL OR M.UserID = @UserID)
    ORDER BY M.MeetingDate DESC;
END
GO


DELETE FROM MOM_MeetingMember;
DELETE FROM MOM_Meetings;
DELETE FROM MOM_Staff;
DELETE FROM MOM_MeetingVenue;
DELETE FROM MOM_MeetingType;
DELETE FROM MOM_Department;
DELETE FROM MOM_User;

DBCC CHECKIDENT ('MOM_MeetingMember', RESEED, 0);
DBCC CHECKIDENT ('MOM_Meetings',      RESEED, 0);
DBCC CHECKIDENT ('MOM_Staff',         RESEED, 0);
DBCC CHECKIDENT ('MOM_MeetingVenue',  RESEED, 0);
DBCC CHECKIDENT ('MOM_MeetingType',   RESEED, 0);
DBCC CHECKIDENT ('MOM_Department',    RESEED, 0);
DBCC CHECKIDENT ('MOM_User',          RESEED, 0);

-- Default admin user (login: admin / admin123)
INSERT INTO MOM_User (Username, Password, Role, Created, Modified)
VALUES ('admin', 'admin123', 'Admin', GETDATE(), GETDATE());

-- Departments (UserID = 1 = admin)
INSERT INTO MOM_Department (DepartmentName, UserID, Created, Modified)
VALUES
('IT',         1, GETDATE(), GETDATE()),
('HR',         1, GETDATE(), GETDATE()),
('Finance',    1, GETDATE(), GETDATE()),
('Admin',      1, GETDATE(), GETDATE()),
('Operations', 1, GETDATE(), GETDATE());

-- Meeting Types
INSERT INTO MOM_MeetingType (MeetingTypeName, Remarks, UserID, Created, Modified)
VALUES
('Daily Standup',    'Daily team sync',    1, GETDATE(), GETDATE()),
('Review Meeting',   'Monthly review',     1, GETDATE(), GETDATE()),
('Planning Meeting', 'Sprint planning',    1, GETDATE(), GETDATE()),
('Training Session', 'Internal training',  1, GETDATE(), GETDATE());

-- Meeting Venues
INSERT INTO MOM_MeetingVenue (MeetingVenueName, UserID, Created, Modified)
VALUES
('Conference Hall',  1, GETDATE(), GETDATE()),
('Board Room',       1, GETDATE(), GETDATE()),
('Meeting Room A',   1, GETDATE(), GETDATE()),
('Online - MS Teams',1, GETDATE(), GETDATE());

-- Staff
INSERT INTO MOM_Staff (DepartmentID, StaffName, MobileNo, EmailAddress, Remarks, UserID, Created, Modified)
VALUES
(1, 'Aniruddh Parmar', '9313599527', 'aniruddh@company.com', 'IT Lead',         1, GETDATE(), GETDATE()),
(2, 'Rahul Sharma',    '9123456789', 'rahul@company.com',    'HR Executive',     1, GETDATE(), GETDATE()),
(3, 'Neha Patel',      '9876543210', 'neha@company.com',     'Finance Analyst',  1, GETDATE(), GETDATE()),
(1, 'Amit Verma',      '9988776655', 'amit@company.com',     'Developer',        1, GETDATE(), GETDATE());

-- Meetings
INSERT INTO MOM_Meetings
(MeetingDate, MeetingVenueID, MeetingTypeID, DepartmentID, MeetingDescription, DocumentPath, IsCancelled, CancellationDateTime, CancellationReason, UserID, Created, Modified)
VALUES
('2025-02-10 10:00:00', 1, 1, 1, 'IT Daily Standup',  'docs/standup.pdf',   0, NULL,     NULL,                 1, GETDATE(), GETDATE()),
('2025-02-12 11:30:00', 2, 2, 2, 'HR Monthly Review',  'docs/hr_review.pdf', 0, NULL,     NULL,                 1, GETDATE(), GETDATE()),
('2025-02-15 15:00:00', 4, 4, 1, 'Online Training',    'docs/training.pdf',  1, GETDATE(),'Trainer unavailable',1, GETDATE(), GETDATE());

-- Meeting Members
INSERT INTO MOM_MeetingMember (MeetingID, StaffID, IsPresent, Remarks, Created, Modified)
VALUES
(1, 1, 1, 'Attended full meeting',   GETDATE(), GETDATE()),
(1, 4, 1, 'Participated actively',   GETDATE(), GETDATE()),
(2, 2, 1, 'Joined on time',          GETDATE(), GETDATE()),
(3, 3, 0, 'Absent due to leave',     GETDATE(), GETDATE());


SELECT * FROM MOM_User;
SELECT * FROM MOM_Department;
SELECT * FROM MOM_MeetingType;
SELECT * FROM MOM_MeetingVenue;
SELECT * FROM MOM_Staff;
SELECT * FROM MOM_Meetings;
SELECT * FROM MOM_MeetingMember;


EXEC PR_MOM_Attendance_Report
    @StartDate = '2020-01-01',
    @EndDate   = '2030-12-31';