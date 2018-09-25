-- phpMyAdmin SQL Dump
-- version 4.8.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Sep 13, 2018 at 11:05 AM
-- Server version: 5.7.22-0ubuntu18.04.1
-- PHP Version: 7.2.9-1+ubuntu18.04.1+deb.sury.org+1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `assignment_code`
--

-- --------------------------------------------------------

--
-- Table structure for table `actor`
--

CREATE TABLE `actor` (
  `id` int(11) NOT NULL,
  `login` varchar(200) NOT NULL,
  `avatar_url` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `actor`
--

INSERT INTO `actor` (`id`, `login`, `avatar_url`) VALUES
(1, 'a1', 'avatar1'),
(2, 'a2', 'avatar2'),
(3, 'a3', 'avatar3'),
(4, 'a4', 'avatar4');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `type` varchar(200) NOT NULL,
  `actor` int(11) NOT NULL DEFAULT '1',
  `repo` int(11) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `type`, `actor`, `repo`, `created_at`) VALUES
(1, 'e1', 1, 1, '2018-09-11 17:51:03'),
(2, 'e2', 1, 1, '2018-09-12 17:51:03'),
(3, 'e3', 1, 1, '2018-09-13 17:51:30'),
(4, 'e4', 1, 1, '2018-09-19 17:51:30'),
(5, 'e5', 1, 1, '2018-09-20 05:09:54'),
(6, 'e6', 3, 1, '2018-09-11 17:51:03'),
(7, 'e7', 3, 1, '2018-09-12 17:51:03'),
(8, 'e8', 3, 1, '2018-09-13 17:51:30'),
(9, 'e9', 3, 1, '2018-09-02 17:51:30'),
(10, 'e10', 3, 1, '2018-09-03 05:09:54'),
(16, 'e11', 3, 1, '2018-09-22 09:28:55'),
(17, 'e12', 3, 1, '2018-09-23 09:28:55'),
(18, 'e13', 3, 1, '2018-09-24 00:00:00'),
(19, 'e14', 3, 1, '2018-09-25 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `repo`
--

CREATE TABLE `repo` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `url` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `actor`
--
ALTER TABLE `actor`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_at` (`created_at`);

--
-- Indexes for table `repo`
--
ALTER TABLE `repo`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `actor`
--
ALTER TABLE `actor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `repo`
--
ALTER TABLE `repo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
