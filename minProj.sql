-- MySQL dump 10.13  Distrib 8.0.22, for Linux (x86_64)
--
-- Host: localhost    Database: minProj
-- ------------------------------------------------------
-- Server version	8.0.22

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Category`
--

DROP TABLE IF EXISTS `Category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Category` (
  `categoryID` int NOT NULL,
  `categoryName` varchar(50) NOT NULL,
  PRIMARY KEY (`categoryID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Category`
--

LOCK TABLES `Category` WRITE;
/*!40000 ALTER TABLE `Category` DISABLE KEYS */;
INSERT INTO `Category` VALUES (1,'Mobiles'),(2,'Televisions'),(3,'Laptops'),(4,'Earphones'),(5,'Cameras'),(6,'Fridges'),(7,'Washing machines'),(8,'Microwaves');
/*!40000 ALTER TABLE `Category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Customers`
--

DROP TABLE IF EXISTS `Customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Customers` (
  `custID` varchar(20) NOT NULL,
  `firstname` varchar(20) NOT NULL,
  `lastname` varchar(20) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(20) DEFAULT NULL,
  `state` varchar(20) DEFAULT NULL,
  `pinCode` varchar(6) DEFAULT NULL,
  `pno` varchar(10) NOT NULL,
  `email` varchar(40) NOT NULL,
  `pwd` varchar(14) NOT NULL,
  `joinDate` date NOT NULL,
  `paymentID` int DEFAULT NULL,
  PRIMARY KEY (`custID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Customers`
--

LOCK TABLES `Customers` WRITE;
/*!40000 ALTER TABLE `Customers` DISABLE KEYS */;
INSERT INTO `Customers` VALUES ('C-7731996','Monica','Paliwal',NULL,NULL,NULL,NULL,'8145612354','monicapaliwal17@gmail.com','Monica@123','2020-11-15',NULL),('C-8283317','Saksham','Yadav',NULL,NULL,NULL,NULL,'9145774142','sakshamyadavpune@gmail.com','Saksham@123','2020-11-15',NULL),('C-9723854','Ashutosh','Muley',NULL,NULL,NULL,NULL,'9096080085','muleyashutosh@gmail.com','Ashu@12345','2020-11-15',NULL);
/*!40000 ALTER TABLE `Customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Products`
--

DROP TABLE IF EXISTS `Products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Products` (
  `prodID` int NOT NULL,
  `prodName` varchar(50) NOT NULL,
  `prodDesc` varchar(255) NOT NULL,
  `minPrice` int NOT NULL,
  `unitStock` int NOT NULL,
  `prodAvail` tinyint(1) NOT NULL,
  `img` varchar(255) NOT NULL,
  `rating` int DEFAULT NULL,
  `Note` varchar(255) DEFAULT NULL,
  `categoryID` int DEFAULT NULL,
  PRIMARY KEY (`prodID`),
  KEY `categoryID` (`categoryID`),
  CONSTRAINT `Products_ibfk_1` FOREIGN KEY (`categoryID`) REFERENCES `Category` (`categoryID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Products`
--

LOCK TABLES `Products` WRITE;
/*!40000 ALTER TABLE `Products` DISABLE KEYS */;
INSERT INTO `Products` VALUES (91457,'iPhone','Bhott mehnga',50000,45,1,'asdasd',5,NULL,NULL);
/*!40000 ALTER TABLE `Products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SupplierDet`
--

DROP TABLE IF EXISTS `SupplierDet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SupplierDet` (
  `supplierID` varchar(20) NOT NULL,
  `prodID` int NOT NULL,
  `sellprice` int NOT NULL,
  PRIMARY KEY (`supplierID`,`prodID`),
  KEY `prodID` (`prodID`),
  CONSTRAINT `SupplierDet_ibfk_1` FOREIGN KEY (`supplierID`) REFERENCES `Suppliers` (`supplierID`),
  CONSTRAINT `SupplierDet_ibfk_2` FOREIGN KEY (`prodID`) REFERENCES `Products` (`prodID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SupplierDet`
--

LOCK TABLES `SupplierDet` WRITE;
/*!40000 ALTER TABLE `SupplierDet` DISABLE KEYS */;
INSERT INTO `SupplierDet` VALUES ('S-5709556',91457,60000),('S-8703969',91457,50000);
/*!40000 ALTER TABLE `SupplierDet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Suppliers`
--

DROP TABLE IF EXISTS `Suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Suppliers` (
  `supplierID` varchar(20) NOT NULL,
  `orgname` varchar(50) NOT NULL,
  `firstname` varchar(20) NOT NULL,
  `lastname` varchar(20) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(20) DEFAULT NULL,
  `state` varchar(20) DEFAULT NULL,
  `pinCode` varchar(6) DEFAULT NULL,
  `pno` varchar(10) NOT NULL,
  `email` varchar(40) NOT NULL,
  `pwd` varchar(14) NOT NULL,
  `joinDate` date NOT NULL,
  `paymentID` int DEFAULT NULL,
  PRIMARY KEY (`supplierID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Suppliers`
--

LOCK TABLES `Suppliers` WRITE;
/*!40000 ALTER TABLE `Suppliers` DISABLE KEYS */;
INSERT INTO `Suppliers` VALUES ('S-5709556','Yadav Enterprises','Saksham','Yadav',NULL,NULL,NULL,NULL,'9145774142','sakshamyadavpune@gmail.com','Saksham@123','2020-11-15',NULL),('S-8703969','Paliwal Enterprises','Monica','Paliwal',NULL,NULL,NULL,NULL,'8456123456','monicapaliwal17@gmail.com','Monica@123','2020-11-17',NULL);
/*!40000 ALTER TABLE `Suppliers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-11-17 17:34:51
