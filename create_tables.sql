-- create_tables.sql
CREATE DATABASE IF NOT EXISTS UniVerseDB;

USE UniVerseDB;

CREATE TABLE University (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255) UNIQUE NOT NULL
   # Type ENUM('Business', 'Medical', 'Engineering') NOT NULL
);

CREATE TABLE Department (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    UniversityID INT,
    FOREIGN KEY (UniversityID) REFERENCES University(ID)
);

CREATE TABLE Admission (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    UniversityID INT,
    StartDate DATE,
    EndDate DATE,
    TestDate DATE,
    MeritListURL VARCHAR(500),
    FOREIGN KEY (UniversityID) REFERENCES University(ID)
);

CREATE TABLE MeritList (
    #Year INT PRIMARY KEY,
    MeritListURL VARCHAR(500),
    #MinMerit FLOAT,
    UniversityID INT,
    FOREIGN KEY (UniversityID) REFERENCES University(ID)
);

CREATE TABLE Scholarship (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    UniversityID INT,
    Details TEXT,
    FOREIGN KEY (UniversityID) REFERENCES University(ID)
);

CREATE TABLE FeeStructure (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    UniversityID INT,
    Program VARCHAR(255),
    EstimatedCost DECIMAL(10, 2),
    FOREIGN KEY (UniversityID) REFERENCES University(ID)
);

CREATE TABLE AlumniGroup (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    UniversityID INT,
    GroupLink VARCHAR(500),
    FOREIGN KEY (UniversityID) REFERENCES University(ID)
);

CREATE TABLE Contact (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    UniversityID INT,
    Phone VARCHAR(255),  -- Increase length to 25 or higher, based on your needs
    Email VARCHAR(255),
    FOREIGN KEY (UniversityID) REFERENCES University(ID)
);

