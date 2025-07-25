CREATE TABLE `company` (
  `id` varchar(36) NOT NULL,
  `business_group_id` varchar(36)   NOT NULL,
  `company_code` varchar(36)  NOT NULL,
  -- 국내 기업 기준
  `company_name` varchar(100)  NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_group_code` (`business_group_id`, `company_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='회사'