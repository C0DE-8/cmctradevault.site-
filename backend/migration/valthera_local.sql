-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Sep 05, 2026 at 04:20 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `valthera_local`
--

-- --------------------------------------------------------

--
-- Table structure for table `account_upgrades`
--

CREATE TABLE `account_upgrades` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `requested_account_type` varchar(80) NOT NULL,
  `current_account_type` varchar(80) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'pending',
  `proof_filename` varchar(255) DEFAULT NULL,
  `admin_note` text DEFAULT NULL,
  `approved_by` int(10) UNSIGNED DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `declined_by` int(10) UNSIGNED DEFAULT NULL,
  `declined_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `name`, `email`, `password_hash`, `created_at`, `updated_at`) VALUES
(1, 'Local Test Admin', 'admin@valthera.test', '$2b$12$w023m4aWZOs14l1eeQwolOIIy1uTxUtf6QAs9xIYRXQ4PFotpm2jy', '2026-09-05 01:23:53', '2026-09-05 01:23:53');

-- --------------------------------------------------------

--
-- Table structure for table `admin_audit_logs`
--

CREATE TABLE `admin_audit_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `admin_id` int(10) UNSIGNED DEFAULT NULL,
  `admin_email` varchar(191) DEFAULT NULL,
  `method` varchar(10) NOT NULL,
  `resource` varchar(200) NOT NULL,
  `status_code` smallint(5) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_audit_logs`
--

INSERT INTO `admin_audit_logs` (`id`, `admin_id`, `admin_email`, `method`, `resource`, `status_code`, `created_at`) VALUES
(1, 1, 'admin@valthera.test', 'POST', '/login', 200, '2026-09-05 02:06:40'),
(2, 1, 'admin@valthera.test', 'PATCH', '/users/5/trading-settings', 200, '2026-09-05 02:06:41'),
(3, 1, 'admin@valthera.test', 'PATCH', '/users/5/trading-settings', 400, '2026-09-05 02:06:41'),
(4, 1, 'admin@valthera.test', 'PATCH', '/users/5/trading-settings', 200, '2026-09-05 02:06:51'),
(5, 1, 'admin@valthera.test', 'PATCH', '/users/5/trading-settings', 200, '2026-09-05 02:06:51'),
(6, 1, 'admin@valthera.test', 'POST', '/deposits/2/approve', 200, '2026-09-05 02:06:51'),
(7, 1, 'admin@valthera.test', 'POST', '/deposits/2/approve', 400, '2026-09-05 02:06:51'),
(8, NULL, NULL, 'POST', '/login', 401, '2026-09-05 02:15:25'),
(9, 1, 'admin@valthera.test', 'POST', '/login', 200, '2026-09-05 02:15:40');

-- --------------------------------------------------------

--
-- Table structure for table `binary_trades`
--

CREATE TABLE `binary_trades` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `asset` varchar(10) NOT NULL,
  `side` varchar(10) NOT NULL,
  `amount` decimal(18,2) NOT NULL,
  `entry_price` decimal(28,8) NOT NULL,
  `exit_price` decimal(28,8) DEFAULT NULL,
  `payout_percent` decimal(5,2) NOT NULL DEFAULT 80.00,
  `pnl` decimal(18,2) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'open',
  `opened_at_ms` bigint(20) NOT NULL,
  `expires_at_ms` bigint(20) NOT NULL,
  `settled_at_ms` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `copy_traders`
--

CREATE TABLE `copy_traders` (
  `id` int(10) UNSIGNED NOT NULL,
  `trader_name` varchar(150) NOT NULL,
  `image_filename` varchar(255) DEFAULT NULL,
  `specialty` varchar(150) DEFAULT NULL,
  `win_rate_percent` decimal(8,2) NOT NULL DEFAULT 0.00,
  `profit_percent` decimal(8,2) NOT NULL DEFAULT 0.00,
  `followers` int(11) NOT NULL DEFAULT 0,
  `status` varchar(30) NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `copy_traders`
--

INSERT INTO `copy_traders` (`id`, `trader_name`, `image_filename`, `specialty`, `win_rate_percent`, `profit_percent`, `followers`, `status`, `created_at`, `updated_at`, `is_active`) VALUES
(1, 'Local Demo Trader', NULL, NULL, 50.00, 0.00, 0, 'active', '2026-09-05 01:23:53', '2026-09-05 01:23:53', 1);

-- --------------------------------------------------------

--
-- Table structure for table `deposits`
--

CREATE TABLE `deposits` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `asset` varchar(16) NOT NULL,
  `amount` decimal(24,2) NOT NULL DEFAULT 0.00,
  `status` varchar(30) NOT NULL DEFAULT 'pending',
  `admin_note` text DEFAULT NULL,
  `proof_filename` varchar(255) DEFAULT NULL,
  `approved_by` int(10) UNSIGNED DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `declined_by` int(10) UNSIGNED DEFAULT NULL,
  `declined_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `email_logs`
--

CREATE TABLE `email_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED DEFAULT NULL,
  `to_email` varchar(191) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text DEFAULT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'pending',
  `error` text DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `email_otps`
--

CREATE TABLE `email_otps` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED DEFAULT NULL,
  `email` varchar(191) NOT NULL,
  `otp` varchar(10) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `investment_plans`
--

CREATE TABLE `investment_plans` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `roi_percent` decimal(8,2) NOT NULL DEFAULT 0.00,
  `accuracy_percent` decimal(8,2) NOT NULL DEFAULT 0.00,
  `price` decimal(24,2) NOT NULL DEFAULT 0.00,
  `min_amount` decimal(24,2) NOT NULL DEFAULT 0.00,
  `max_amount` decimal(24,2) DEFAULT NULL,
  `duration_days` int(11) NOT NULL DEFAULT 1,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `investment_plans`
--

INSERT INTO `investment_plans` (`id`, `name`, `description`, `roi_percent`, `accuracy_percent`, `price`, `min_amount`, `max_amount`, `duration_days`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Foundation Yield', NULL, 8.50, 82.00, 250.00, 0.00, NULL, 7, 1, '2026-09-05 01:22:42', '2026-09-05 01:22:42'),
(2, 'Market Access', NULL, 14.00, 86.00, 500.00, 0.00, NULL, 14, 1, '2026-09-05 01:22:42', '2026-09-05 01:22:42'),
(3, 'Growth Strategy', NULL, 22.50, 89.00, 1000.00, 0.00, NULL, 21, 1, '2026-09-05 01:22:42', '2026-09-05 01:22:42'),
(4, 'Prime Momentum', NULL, 35.00, 92.00, 2500.00, 0.00, NULL, 30, 1, '2026-09-05 01:22:42', '2026-09-05 01:22:42'),
(5, 'Executive Reserve', NULL, 55.00, 95.00, 5000.00, 0.00, NULL, 45, 1, '2026-09-05 01:22:42', '2026-09-05 01:22:42');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED DEFAULT NULL,
  `type` varchar(40) NOT NULL DEFAULT 'notice',
  `title` varchar(180) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `expires_at` datetime DEFAULT NULL,
  `created_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `message`, `is_read`, `expires_at`, `created_by`, `created_at`) VALUES
(1, 1, 'notification', 'Local testing account', 'This local account contains test funds only. No real funds or deposits are required.', 0, NULL, NULL, '2026-09-05 01:23:53');

-- --------------------------------------------------------

--
-- Table structure for table `trades`
--

CREATE TABLE `trades` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `symbol` varchar(40) NOT NULL,
  `side` varchar(10) NOT NULL,
  `amount` decimal(24,2) NOT NULL DEFAULT 0.00,
  `duration_seconds` int(11) NOT NULL DEFAULT 60,
  `entry_price` decimal(28,8) DEFAULT NULL,
  `exit_price` decimal(28,8) DEFAULT NULL,
  `pnl` decimal(24,2) NOT NULL DEFAULT 0.00,
  `duration` varchar(20) NOT NULL DEFAULT '1m',
  `status` varchar(30) NOT NULL DEFAULT 'open',
  `pnl_amount` decimal(24,2) NOT NULL DEFAULT 0.00,
  `opened_at` datetime DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  `closes_at` datetime DEFAULT NULL,
  `closed_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `full_name` varchar(150) NOT NULL,
  `username` varchar(80) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(120) DEFAULT NULL,
  `zipcode` varchar(40) DEFAULT NULL,
  `country` varchar(80) DEFAULT NULL,
  `phone` varchar(60) DEFAULT NULL,
  `email` varchar(191) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` varchar(30) NOT NULL DEFAULT 'user',
  `is_verified` tinyint(1) NOT NULL DEFAULT 0,
  `main_balance` decimal(24,2) NOT NULL DEFAULT 0.00,
  `profit_balance` decimal(24,2) NOT NULL DEFAULT 0.00,
  `investment_balance` decimal(24,2) NOT NULL DEFAULT 0.00,
  `currency_symbol` varchar(8) NOT NULL DEFAULT '$',
  `withdraw_hold` decimal(24,2) NOT NULL DEFAULT 0.00,
  `pin_hash` varchar(255) DEFAULT NULL,
  `account_type` varchar(50) NOT NULL DEFAULT 'individual',
  `trade_progress` decimal(5,2) NOT NULL DEFAULT 0.00,
  `signal_strength` decimal(5,2) NOT NULL DEFAULT 0.00,
  `account_status` varchar(30) NOT NULL DEFAULT 'active',
  `copy_trading_status` varchar(30) NOT NULL DEFAULT 'inactive',
  `trading_status` varchar(30) NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `copied_trader_id` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `username`, `address`, `city`, `zipcode`, `country`, `phone`, `email`, `password_hash`, `role`, `is_verified`, `main_balance`, `profit_balance`, `investment_balance`, `withdraw_hold`, `pin_hash`, `account_type`, `trade_progress`, `signal_strength`, `account_status`, `copy_trading_status`, `trading_status`, `created_at`, `updated_at`, `copied_trader_id`) VALUES
(1, 'Local Test Investor', 'tester', '1 Test Street', 'Test City', NULL, 'United States', '0000000000', 'tester@valthera.test', '$2b$12$w023m4aWZOs14l1eeQwolOIIy1uTxUtf6QAs9xIYRXQ4PFotpm2jy', 'user', 1, 10000.00, 0.00, 0.00, 100.00, '123456', 'individual', 0.00, 0.00, 'active', 'inactive', 'active', '2026-09-05 01:23:53', '2026-09-05 01:54:47', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_crypto_balances`
--

CREATE TABLE `user_crypto_balances` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `asset` varchar(16) NOT NULL,
  `balance` decimal(28,8) NOT NULL DEFAULT 0.00000000,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_investments`
--

CREATE TABLE `user_investments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `plan_id` int(10) UNSIGNED NOT NULL,
  `amount` decimal(24,2) NOT NULL DEFAULT 0.00,
  `roi_percent` decimal(8,2) NOT NULL DEFAULT 0.00,
  `expected_profit` decimal(24,2) NOT NULL DEFAULT 0.00,
  `expected_total` decimal(24,2) NOT NULL DEFAULT 0.00,
  `duration_days` int(11) NOT NULL DEFAULT 1,
  `actual_profit_loss` decimal(24,2) NOT NULL DEFAULT 0.00,
  `final_total` decimal(24,2) NOT NULL DEFAULT 0.00,
  `status` varchar(30) NOT NULL DEFAULT 'active',
  `started_at` datetime DEFAULT NULL,
  `ends_at` datetime DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  `admin_note` text DEFAULT NULL,
  `settled_by` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_kyc`
--

CREATE TABLE `user_kyc` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `id_type` varchar(80) DEFAULT NULL,
  `id_number` varchar(120) DEFAULT NULL,
  `id_front_filename` varchar(255) DEFAULT NULL,
  `id_back_filename` varchar(255) DEFAULT NULL,
  `selfie_filename` varchar(255) DEFAULT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'pending',
  `admin_note` text DEFAULT NULL,
  `reviewed_by` int(10) UNSIGNED DEFAULT NULL,
  `reviewed_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `approved_by` int(10) UNSIGNED DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `declined_by` int(10) UNSIGNED DEFAULT NULL,
  `declined_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wallet_addresses`
--

CREATE TABLE `wallet_addresses` (
  `id` int(10) UNSIGNED NOT NULL,
  `asset` varchar(16) NOT NULL,
  `address` varchar(255) NOT NULL,
  `qr_filename` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wallet_addresses`
--

INSERT INTO `wallet_addresses` (`id`, `asset`, `address`, `qr_filename`, `created_at`, `updated_at`) VALUES
(1, 'BTC', 'LOCAL-TEST-ONLY-NO-BLOCKCHAIN-ADDRESS', NULL, '2026-09-05 01:29:13', '2026-09-05 01:29:13');

-- --------------------------------------------------------

--
-- Table structure for table `withdrawals`
--

CREATE TABLE `withdrawals` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `amount` decimal(24,2) NOT NULL DEFAULT 0.00,
  `method` varchar(20) NOT NULL,
  `asset` varchar(16) DEFAULT NULL,
  `crypto_address` varchar(255) DEFAULT NULL,
  `crypto_network` varchar(80) DEFAULT NULL,
  `bank_name` varchar(150) DEFAULT NULL,
  `bank_account_number` varchar(80) DEFAULT NULL,
  `bank_account_name` varchar(150) DEFAULT NULL,
  `bank_country` varchar(80) DEFAULT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'pending',
  `admin_note` text DEFAULT NULL,
  `approved_by` int(10) UNSIGNED DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `declined_by` int(10) UNSIGNED DEFAULT NULL,
  `declined_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `withdrawals`
--

INSERT INTO `withdrawals` (`id`, `user_id`, `amount`, `method`, `asset`, `crypto_address`, `crypto_network`, `bank_name`, `bank_account_number`, `bank_account_name`, `bank_country`, `status`, `admin_note`, `approved_by`, `approved_at`, `declined_by`, `declined_at`, `created_at`, `updated_at`) VALUES
(2, 1, 100.00, 'crypto', 'ETH', 'LOCAL-TEST-ONLY-NO-BLOCKCHAIN-ADDRESS', 'TRC', NULL, NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL, NULL, '2026-09-05 01:54:47', '2026-09-05 01:54:47');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account_upgrades`
--
ALTER TABLE `account_upgrades`
  ADD PRIMARY KEY (`id`),
  ADD KEY `account_upgrades_user_idx` (`user_id`),
  ADD KEY `account_upgrades_status_idx` (`status`);

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `admins_email_unique` (`email`);

--
-- Indexes for table `admin_audit_logs`
--
ALTER TABLE `admin_audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `audit_admin_created` (`admin_id`,`created_at`);

--
-- Indexes for table `binary_trades`
--
ALTER TABLE `binary_trades`
  ADD PRIMARY KEY (`id`),
  ADD KEY `binary_user_status` (`user_id`,`status`),
  ADD KEY `binary_expiry` (`status`,`expires_at_ms`);

--
-- Indexes for table `copy_traders`
--
ALTER TABLE `copy_traders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deposits`
--
ALTER TABLE `deposits`
  ADD PRIMARY KEY (`id`),
  ADD KEY `deposits_user_idx` (`user_id`),
  ADD KEY `deposits_status_idx` (`status`);

--
-- Indexes for table `email_logs`
--
ALTER TABLE `email_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `email_logs_user_idx` (`user_id`);

--
-- Indexes for table `email_otps`
--
ALTER TABLE `email_otps`
  ADD PRIMARY KEY (`id`),
  ADD KEY `email_otps_email_idx` (`email`),
  ADD KEY `email_otps_user_idx` (`user_id`);

--
-- Indexes for table `investment_plans`
--
ALTER TABLE `investment_plans`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_user_idx` (`user_id`);

--
-- Indexes for table `trades`
--
ALTER TABLE `trades`
  ADD PRIMARY KEY (`id`),
  ADD KEY `trades_user_idx` (`user_id`),
  ADD KEY `trades_status_idx` (`status`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indexes for table `user_crypto_balances`
--
ALTER TABLE `user_crypto_balances`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_asset_unique` (`user_id`,`asset`);

--
-- Indexes for table `user_investments`
--
ALTER TABLE `user_investments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_investments_user_idx` (`user_id`),
  ADD KEY `user_investments_plan_idx` (`plan_id`);

--
-- Indexes for table `user_kyc`
--
ALTER TABLE `user_kyc`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_kyc_user_unique` (`user_id`);

--
-- Indexes for table `wallet_addresses`
--
ALTER TABLE `wallet_addresses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `wallet_asset_unique` (`asset`);

--
-- Indexes for table `withdrawals`
--
ALTER TABLE `withdrawals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `withdrawals_user_idx` (`user_id`),
  ADD KEY `withdrawals_status_idx` (`status`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `account_upgrades`
--
ALTER TABLE `account_upgrades`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `admin_audit_logs`
--
ALTER TABLE `admin_audit_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `binary_trades`
--
ALTER TABLE `binary_trades`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `copy_traders`
--
ALTER TABLE `copy_traders`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `deposits`
--
ALTER TABLE `deposits`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `email_logs`
--
ALTER TABLE `email_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `email_otps`
--
ALTER TABLE `email_otps`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `investment_plans`
--
ALTER TABLE `investment_plans`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `trades`
--
ALTER TABLE `trades`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user_crypto_balances`
--
ALTER TABLE `user_crypto_balances`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_investments`
--
ALTER TABLE `user_investments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user_kyc`
--
ALTER TABLE `user_kyc`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `wallet_addresses`
--
ALTER TABLE `wallet_addresses`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `withdrawals`
--
ALTER TABLE `withdrawals`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
