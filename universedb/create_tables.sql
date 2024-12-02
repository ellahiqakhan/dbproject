-- create_tables.sql
CREATE DATABASE IF NOT EXISTS UniVerseDB;

USE UniVerseDB;

CREATE TABLE University (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255) UNIQUE NOT NULL
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
    AdmissionDetailsURL VARCHAR(500),
    FOREIGN KEY (UniversityID) REFERENCES University(ID)
);

CREATE TABLE MeritList (
    #Year INT PRIMARY KEY,
    MeritListURL VARCHAR(500),
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
    FeeStructureURL VARCHAR(255),
    FOREIGN KEY (UniversityID) REFERENCES University(ID)
);

CREATE TABLE AlumniGroup (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    UniversityID INT,
    QuestionID INT,  -- Link each question to a thread
    QuestionText TEXT,
    AnswerID INT,    -- Link replies to the question
    AnswerText TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (UniversityID) REFERENCES University(ID),
    FOREIGN KEY (QuestionID) REFERENCES AlumniGroup(ID),  -- Self-referencing for Q&A thread
    FOREIGN KEY (AnswerID) REFERENCES AlumniGroup(ID)     -- Self-referencing for replies
);


CREATE TABLE Contact (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    UniversityID INT,
    Phone VARCHAR(255),  -- Increase length to 25 or higher, based on your needs
    Email VARCHAR(255),
    FOREIGN KEY (UniversityID) REFERENCES University(ID)
);
