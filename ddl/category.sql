CREATE TABLE `category` (
  `id` varchar(11) NOT NULL,
  `company_id` varchar(36)  NOT NULL,
  `category_code` varchar(10)  NOT NULL,
  `category_name` varchar(20)  NOT NULL,
  `keyword` varchar(100) NOT NULL,

  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_category_name` (`company_id`,`category_code`, `category_name`,`keyword`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='회사별 카테고리'