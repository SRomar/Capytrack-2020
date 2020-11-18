-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema capytrack
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `capytrack` ;

-- -----------------------------------------------------
-- Schema capytrack
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `capytrack` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `capytrack` ;

-- -----------------------------------------------------
-- Table `capytrack`.`clientes`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `capytrack`.`clientes` ;

CREATE TABLE IF NOT EXISTS `capytrack`.`clientes` (
  `idCliente` INT NOT NULL AUTO_INCREMENT,
  `session_id` VARCHAR(128) NOT NULL,
  PRIMARY KEY (`idCliente`))
ENGINE = InnoDB
AUTO_INCREMENT = 29
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `capytrack`.`listas`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `capytrack`.`listas` ;

CREATE TABLE IF NOT EXISTS `capytrack`.`listas` (
  `nombre` VARCHAR(60) NOT NULL,
  `idCliente` INT NOT NULL,
  PRIMARY KEY (`nombre`),
  INDEX `Foreign_Key_Clientes_idx` (`idCliente` ASC) VISIBLE,
  CONSTRAINT `Foreign_Key_Clientes`
    FOREIGN KEY (`idCliente`)
    REFERENCES `capytrack`.`clientes` (`idCliente`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `capytrack`.`productos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `capytrack`.`productos` ;

CREATE TABLE IF NOT EXISTS `capytrack`.`productos` (
  `idProducto` INT NOT NULL AUTO_INCREMENT,
  `id` VARCHAR(20) NOT NULL,
  `nombre` VARCHAR(60) NULL DEFAULT NULL,
  `url` VARCHAR(200) NULL DEFAULT NULL,
  `activo` TINYINT NULL DEFAULT NULL,
  `precio` FLOAT NULL DEFAULT NULL,
  `nombre_lista` VARCHAR(60) NULL DEFAULT NULL,
  `idCliente` INT NOT NULL,
  PRIMARY KEY (`idProducto`),
  UNIQUE INDEX `idProducto_UNIQUE` (`idProducto` ASC) VISIBLE,
  INDEX `idCliente` (`idCliente` ASC) VISIBLE,
  INDEX `nombre_lista` (`nombre_lista` ASC) VISIBLE,
  CONSTRAINT `productos_ibfk_1`
    FOREIGN KEY (`idCliente`)
    REFERENCES `capytrack`.`clientes` (`idCliente`),
  CONSTRAINT `productos_ibfk_2`
    FOREIGN KEY (`nombre_lista`)
    REFERENCES `capytrack`.`listas` (`nombre`))
ENGINE = InnoDB
AUTO_INCREMENT = 8
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `capytrack`.`sessions`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `capytrack`.`sessions` ;

CREATE TABLE IF NOT EXISTS `capytrack`.`sessions` (
  `session_id` VARCHAR(128) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_bin' NOT NULL,
  `expires` INT UNSIGNED NULL DEFAULT NULL,
  `data` MEDIUMTEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_bin' NULL DEFAULT NULL,
  PRIMARY KEY (`session_id`),
  UNIQUE INDEX `session_id_UNIQUE` (`session_id` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `capytrack`.`usuarios`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `capytrack`.`usuarios` ;

CREATE TABLE IF NOT EXISTS `capytrack`.`usuarios` (
  `usuario` VARCHAR(45) NOT NULL,
  `contrasena` VARCHAR(45) NOT NULL,
  `idCliente` INT NOT NULL,
  PRIMARY KEY (`usuario`),
  INDEX `Foreign_Key_Clientes_idx` (`idCliente` ASC) VISIBLE,
  CONSTRAINT `FK_Clientes_Usuarios`
    FOREIGN KEY (`idCliente`)
    REFERENCES `capytrack`.`clientes` (`idCliente`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
