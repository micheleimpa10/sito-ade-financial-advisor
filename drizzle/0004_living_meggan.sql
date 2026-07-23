ALTER TABLE `orders` DROP INDEX `orders_stripeSessionId_unique`;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_session_product_idx` UNIQUE(`stripeSessionId`,`productKey`);