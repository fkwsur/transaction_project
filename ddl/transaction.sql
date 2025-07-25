CREATE TABLE `transaction` (
  `id` varchar(36) NOT NULL,
  `business_group_id` varchar(36) NOT NULL,
  `company_id` varchar(36)  NULL,
  `category_code` varchar(10) NULL,
   -- 적요, 글자 수 국내 기업 기준
  `description` varchar(100) NOT NULL,
  -- 입금액
  `deposit_amount` INT UNSIGNED NULL,
  -- 출금액
  `withdrawal_amount` INT UNSIGNED NULL,
  -- 거래 후 잔액
  `balance_after_transaction` BIGINT NULL,
  -- 거래점, 글자 수 국내 기업 기준
  `transaction_branch` varchar(100) NULL,
  -- 거래일시
  `transacted_at` datetime NULL,

  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_transaction` (`business_group_id`,`description`,`balance_after_transaction`, `transaction_branch`,`transacted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='거래내역'