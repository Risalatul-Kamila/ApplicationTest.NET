-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 11, 2026 at 06:36 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_pelindo`
--

-- --------------------------------------------------------

--
-- Table structure for table `biodatas`
--

CREATE TABLE `biodatas` (
  `Id` int(11) NOT NULL,
  `UserId` int(11) NOT NULL,
  `PosisiYangDilamar` longtext DEFAULT NULL,
  `Nama` longtext DEFAULT NULL,
  `NoKtp` longtext DEFAULT NULL,
  `TempatLahir` longtext DEFAULT NULL,
  `TanggalLahir` longtext DEFAULT NULL,
  `JenisKelamin` longtext DEFAULT NULL,
  `Agama` longtext DEFAULT NULL,
  `GolonganDarah` longtext DEFAULT NULL,
  `Status` longtext DEFAULT NULL,
  `AlamatKtp` longtext DEFAULT NULL,
  `AlamatTinggal` longtext DEFAULT NULL,
  `Email` longtext DEFAULT NULL,
  `NoTelp` longtext DEFAULT NULL,
  `OrangTerdekat` longtext DEFAULT NULL,
  `Skill` longtext DEFAULT NULL,
  `BersediaDitempatkan` tinyint(1) DEFAULT NULL,
  `PenghasilanDiharapkan` longtext DEFAULT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `UpdatedAt` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `biodatas`
--

INSERT INTO `biodatas` (`Id`, `UserId`, `PosisiYangDilamar`, `Nama`, `NoKtp`, `TempatLahir`, `TanggalLahir`, `JenisKelamin`, `Agama`, `GolonganDarah`, `Status`, `AlamatKtp`, `AlamatTinggal`, `Email`, `NoTelp`, `OrangTerdekat`, `Skill`, `BersediaDitempatkan`, `PenghasilanDiharapkan`, `CreatedAt`, `UpdatedAt`) VALUES
(1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-06-10 08:40:51.511618', '2026-06-10 08:40:51.511619'),
(2, 2, 'Programmer', 'Risalatul Kamila', '8379274308493284098', 'Pekalongan', '2026-06-01', 'PEREMPUAN', 'Islam', 'B', 'Single', 'pekalongan', 'bekasi', 'risakamila246@gmail.com', '089256786567', 'kakak ', '.Net', 1, '8000000', '2026-06-10 08:41:28.603596', '2026-06-10 08:41:28.603596'),
(3, 3, 'System Analyst', 'Kamila', '8379274308493284098', 'Pekalongan', '2026-06-01', 'PEREMPUAN', 'Islam', 'B', 'Single', 'tets', 'test', 'risakamila246@gmail.com', '089256786567', 'kakak ', '.NET', 1, '8000000', '2026-06-11 03:01:53.579438', '2026-06-11 03:01:53.579438');

-- --------------------------------------------------------

--
-- Table structure for table `pekerjaans`
--

CREATE TABLE `pekerjaans` (
  `Id` int(11) NOT NULL,
  `BiodataId` int(11) NOT NULL,
  `NamaPerusahaan` longtext DEFAULT NULL,
  `Posisi` longtext DEFAULT NULL,
  `Gaji` longtext DEFAULT NULL,
  `TahunMasuk` longtext DEFAULT NULL,
  `TahunKeluar` longtext DEFAULT NULL,
  `AlasanKeluar` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pekerjaans`
--

INSERT INTO `pekerjaans` (`Id`, `BiodataId`, `NamaPerusahaan`, `Posisi`, `Gaji`, `TahunMasuk`, `TahunKeluar`, `AlasanKeluar`) VALUES
(1, 2, 'PT XX', 'programmer', '8000000', '2026', '2026', 'habis kontrak'),
(4, 3, 'PT XX', 'programmer', '8000000', '2026', '2026', 'habis kontrak');

-- --------------------------------------------------------

--
-- Table structure for table `pelatihans`
--

CREATE TABLE `pelatihans` (
  `Id` int(11) NOT NULL,
  `BiodataId` int(11) NOT NULL,
  `NamaKursus` longtext DEFAULT NULL,
  `Penyelenggara` longtext DEFAULT NULL,
  `Sertifikat` tinyint(1) DEFAULT NULL,
  `Tahun` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pelatihans`
--

INSERT INTO `pelatihans` (`Id`, `BiodataId`, `NamaKursus`, `Penyelenggara`, `Sertifikat`, `Tahun`) VALUES
(1, 2, 'Junior Dev', 'dicoding', 0, '2024'),
(4, 3, 'Junior Dev', 'dicoding', 0, '2024');

-- --------------------------------------------------------

--
-- Table structure for table `pendidikans`
--

CREATE TABLE `pendidikans` (
  `Id` int(11) NOT NULL,
  `BiodataId` int(11) NOT NULL,
  `Jenjang` longtext DEFAULT NULL,
  `NamaInstitusi` longtext DEFAULT NULL,
  `Jurusan` longtext DEFAULT NULL,
  `TahunMasuk` longtext DEFAULT NULL,
  `TahunLulus` longtext DEFAULT NULL,
  `Ipk` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pendidikans`
--

INSERT INTO `pendidikans` (`Id`, `BiodataId`, `Jenjang`, `NamaInstitusi`, `Jurusan`, `TahunMasuk`, `TahunLulus`, `Ipk`) VALUES
(1, 2, 'S1', 'Binus', 'Sistem Informasi', '2021', '2026', '3.8'),
(4, 3, 'D3', 'Politeknik Astra', 'Manajemen Informatika', '2021', '2024', '3.5');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `Id` int(11) NOT NULL,
  `Email` longtext NOT NULL,
  `Password` longtext NOT NULL,
  `Role` longtext NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `UpdatedAt` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`Id`, `Email`, `Password`, `Role`, `CreatedAt`, `UpdatedAt`) VALUES
(1, 'risakamila246@gmail.com', '$2a$11$NO.u6wC3AzVFTzKlkXm1AOh0kJMg22NLfS6N2OVe6XGsD75nHUnD6', 'ADMIN', '2026-06-10 08:40:51.119352', '2026-06-10 08:40:51.119353'),
(2, 'ica@gmail.com', '$2a$11$VEvm6FJqod284VifTS2uLuqa.L7ihFMqNxXuwtq9fejzaZ30BuVE.', 'USER', '2026-06-10 08:41:28.569138', '2026-06-10 08:41:28.569139'),
(3, 'mila@gmail.com', '$2a$11$.z81yoZw5LC78cvFIGz0GOeEw0e3VJsoMjI0fe26u6oCfA4jWY/Ou', 'USER', '2026-06-11 03:01:53.324747', '2026-06-11 03:01:53.324748');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `biodatas`
--
ALTER TABLE `biodatas`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `IX_Biodatas_UserId` (`UserId`);

--
-- Indexes for table `pekerjaans`
--
ALTER TABLE `pekerjaans`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_Pekerjaans_BiodataId` (`BiodataId`);

--
-- Indexes for table `pelatihans`
--
ALTER TABLE `pelatihans`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_Pelatihans_BiodataId` (`BiodataId`);

--
-- Indexes for table `pendidikans`
--
ALTER TABLE `pendidikans`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_Pendidikans_BiodataId` (`BiodataId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`Id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `biodatas`
--
ALTER TABLE `biodatas`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `pekerjaans`
--
ALTER TABLE `pekerjaans`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `pelatihans`
--
ALTER TABLE `pelatihans`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `pendidikans`
--
ALTER TABLE `pendidikans`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `biodatas`
--
ALTER TABLE `biodatas`
  ADD CONSTRAINT `FK_Biodatas_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `pekerjaans`
--
ALTER TABLE `pekerjaans`
  ADD CONSTRAINT `FK_Pekerjaans_Biodatas_BiodataId` FOREIGN KEY (`BiodataId`) REFERENCES `biodatas` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `pelatihans`
--
ALTER TABLE `pelatihans`
  ADD CONSTRAINT `FK_Pelatihans_Biodatas_BiodataId` FOREIGN KEY (`BiodataId`) REFERENCES `biodatas` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `pendidikans`
--
ALTER TABLE `pendidikans`
  ADD CONSTRAINT `FK_Pendidikans_Biodatas_BiodataId` FOREIGN KEY (`BiodataId`) REFERENCES `biodatas` (`Id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
