CREATE TABLE `licenses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`licenseKey` varchar(64) NOT NULL,
	`orderId` int NOT NULL,
	`productKey` varchar(64) NOT NULL,
	`tier` enum('personal','family') NOT NULL,
	`customerEmail` varchar(320),
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `licenses_id` PRIMARY KEY(`id`),
	CONSTRAINT `licenses_licenseKey_unique` UNIQUE(`licenseKey`)
);
