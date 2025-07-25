CREATE TABLE `business_group` (
  `id` varchar(36) NOT NULL,
  -- 고객사
  `business_group_name` varchar(100) NOT NULL,
  `registration_number` VARCHAR(10) NOT NULL,

  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `registration_number` (`registration_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='고객사'