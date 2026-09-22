-- Live database patch for balance adjustments and per-account currency signs.
-- Safe to run more than once on the currently selected Valthera database.

CREATE TABLE IF NOT EXISTS `balance_adjustments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `admin_id` INT UNSIGNED NOT NULL,
  `balance_key` VARCHAR(32) NOT NULL,
  `amount` DECIMAL(28,8) NOT NULL,
  `before_balance` DECIMAL(28,8) NOT NULL,
  `after_balance` DECIMAL(28,8) NOT NULL,
  `reason` VARCHAR(250) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `balance_adjustments_user_id_id_idx` (`user_id`, `id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Use dynamic SQL so this remains compatible with MySQL versions that do not
-- support ALTER TABLE ... ADD COLUMN IF NOT EXISTS.
SET @currency_column_exists = (
  SELECT COUNT(*)
  FROM `information_schema`.`COLUMNS`
  WHERE `TABLE_SCHEMA` = DATABASE()
    AND `TABLE_NAME` = 'users'
    AND `COLUMN_NAME` = 'currency_symbol'
);

SET @currency_column_sql = IF(
  @currency_column_exists = 0,
  'ALTER TABLE `users` ADD COLUMN `currency_symbol` VARCHAR(8) NOT NULL DEFAULT ''$'' AFTER `investment_balance`',
  'SELECT ''users.currency_symbol already exists'' AS message'
);

PREPARE currency_column_statement FROM @currency_column_sql;
EXECUTE currency_column_statement;
DEALLOCATE PREPARE currency_column_statement;
