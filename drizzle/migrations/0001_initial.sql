CREATE TABLE IF NOT EXISTS `users` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `openId` varchar(64) NOT NULL UNIQUE,
  `name` text,
  `email` varchar(320),
  `loginMethod` varchar(64),
  `role` enum('user', 'admin') NOT NULL DEFAULT 'user',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastSignedIn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `orders` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `userId` int,
  `stripeSessionId` varchar(255) NOT NULL UNIQUE,
  `stripePaymentIntentId` varchar(255),
  `productKey` varchar(64) NOT NULL,
  `amountTotal` int,
  `currency` varchar(8),
  `paymentStatus` varchar(32),
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `licenses` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `licenseKey` varchar(64) NOT NULL UNIQUE,
  `orderId` int NOT NULL,
  `productKey` varchar(64) NOT NULL,
  `tier` enum('personal', 'family') NOT NULL,
  `customerEmail` varchar(320),
  `isActive` int NOT NULL DEFAULT 1,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);
