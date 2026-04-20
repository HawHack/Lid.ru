USE hunter_platform;
SET NAMES utf8mb4;

-- =====================================================
-- БАЗОВЫЙ ЖИВОЙ SEED ДЛЯ ПРОЕКТА Лид.ру
-- Все пароли у пользователей ниже: password123
-- =====================================================

-- ===== SKILLS =====
INSERT INTO skills (id, name, slug, category) VALUES
(1, 'Go', 'go', 'backend'),
(2, 'PostgreSQL', 'postgresql', 'database'),
(3, 'Docker', 'docker', 'devops'),
(4, 'Kubernetes', 'kubernetes', 'devops'),
(5, 'React', 'react', 'frontend'),
(6, 'TypeScript', 'typescript', 'frontend'),
(7, 'Node.js', 'nodejs', 'backend'),
(8, 'Python', 'python', 'backend'),
(9, 'Figma', 'figma', 'design'),
(10, 'Product Analytics', 'product-analytics', 'product'),
(11, 'QA Automation', 'qa-automation', 'qa'),
(12, 'REST API', 'rest-api', 'backend');

-- ===== USERS =====
-- password123 -> bcrypt
INSERT INTO users (id, email, password_hash, role, is_active) VALUES
(1, 'admin@lid.ru', '$2y$10$.MB4t/OdlmIFICJPfkDH9.WPpBwjKOagFzJelTMmMQ69Xb654TEKq', 'admin', true),
(2, 'candidate@test.com', '$2y$10$.MB4t/OdlmIFICJPfkDH9.WPpBwjKOagFzJelTMmMQ69Xb654TEKq', 'candidate', true),
(3, 'candidate2@test.com', '$2y$10$.MB4t/OdlmIFICJPfkDH9.WPpBwjKOagFzJelTMmMQ69Xb654TEKq', 'candidate', true),
(4, 'candidate3@test.com', '$2y$10$.MB4t/OdlmIFICJPfkDH9.WPpBwjKOagFzJelTMmMQ69Xb654TEKq', 'candidate', true),
(5, 'candidate4@test.com', '$2y$10$.MB4t/OdlmIFICJPfkDH9.WPpBwjKOagFzJelTMmMQ69Xb654TEKq', 'candidate', true),
(6, 'employer@test.com', '$2y$10$.MB4t/OdlmIFICJPfkDH9.WPpBwjKOagFzJelTMmMQ69Xb654TEKq', 'employer', true),
(7, 'employer2@test.com', '$2y$10$.MB4t/OdlmIFICJPfkDH9.WPpBwjKOagFzJelTMmMQ69Xb654TEKq', 'employer', true),
(8, 'employer3@test.com', '$2y$10$.MB4t/OdlmIFICJPfkDH9.WPpBwjKOagFzJelTMmMQ69Xb654TEKq', 'employer', true);

-- ===== CANDIDATE PROFILES =====
INSERT INTO candidate_profiles (user_id, full_name, experience_years, location, work_format, about) VALUES
(2, 'Иван Петров', 3, 'Москва', 'remote', 'Go-разработчик. Люблю писать понятные сервисы, работать с очередями, базами данных и инфраструктурой.'),
(3, 'Анна Смирнова', 5, 'Санкт-Петербург', 'hybrid', 'Frontend-разработчица с упором на React, TypeScript и продуктовый интерфейс.'),
(4, 'Михаил Орлов', 4, 'Казань', 'remote', 'QA automation инженер. Поднимаю стабильные e2e и API тесты, люблю прозрачные процессы и качество релизов.'),
(5, 'Елена Крылова', 6, 'Екатеринбург', 'hybrid', 'Продуктовый менеджер с сильной аналитикой, опытом запуска B2B SaaS и тесной работой с дизайном и разработкой.');

-- ===== CANDIDATE SKILLS =====
INSERT INTO candidate_skills (candidate_id, skill_id, level) VALUES
(2, 1, 4),
(2, 2, 4),
(2, 3, 3),
(2, 4, 2),
(2, 12, 4),

(3, 5, 5),
(3, 6, 5),
(3, 9, 3),
(3, 10, 3),
(3, 12, 4),

(4, 8, 3),
(4, 11, 5),
(4, 3, 3),
(4, 12, 4),

(5, 9, 3),
(5, 10, 5),
(5, 6, 2),
(5, 12, 3);

-- ===== EMPLOYER PROFILES =====
INSERT INTO employer_profiles (user_id, company_name, inn, website, description, verified, verification_status) VALUES
(6, 'Норд Софт', '7701001001', 'https://nord-soft.ru', 'Продуктовая команда для B2B-платформы логистики. Развиваем backend, клиентский кабинет и внутренние инструменты.', true, 'approved'),
(7, 'Пиксель Крафт', '7701001002', 'https://pixelcraft.ru', 'Делаем сервисы для цифровых команд: дизайн-система, личные кабинеты, маркетинговые лендинги и внутренние панели.', true, 'approved'),
(8, 'Клауд Шип', '7701001003', 'https://cloudship.ru', 'SaaS-платформа для автоматизации складских и транспортных операций. Активно растём и нанимаем в продукт.', false, 'pending');

-- ===== VACANCIES =====
INSERT INTO vacancies (id, employer_id, title, description, salary_from, salary_to, work_format, is_active) VALUES
(1, 6, 'Go Backend Developer', 'Ищем backend-разработчика в ядро платформы. Нужно развивать микросервисы, работать с PostgreSQL, очередями и внутренними API, улучшать надёжность и наблюдаемость сервисов.', 180000, 260000, 'remote', true),
(2, 6, 'Middle Product Manager', 'Нужен продуктовый менеджер на внутренний кабинет клиентов. В задачах: исследование сценариев, постановка задач, работа с аналитикой и запуск улучшений вместе с командой.', 170000, 240000, 'hybrid', true),
(3, 7, 'Frontend Developer (React)', 'Ищем frontend-разработчика в продуктовую команду. Много работы с интерфейсами, TypeScript, дизайн-системой, формами и метриками поведения пользователей.', 160000, 230000, 'hybrid', true),
(4, 8, 'QA Automation Engineer', 'Нужен инженер автоматизации тестирования для API и web. Стек команды: Postman, автотесты, CI, регресс, тестовая документация и поддержка качества релизов.', 150000, 220000, 'remote', true),
(5, 8, 'Backend Engineer (Python/Go)', 'Роль на стыке интеграций и внутренних сервисов. Нужен инженер, который уверенно чувствует себя с API, очередями, Docker и базами данных.', 190000, 280000, 'remote', true),
(6, 7, 'UI/UX Designer', 'Ищем дизайнера для развития интерфейсов B2B-сервиса: исследование сценариев, проработка экранов, поддержка дизайн-системы, плотная работа с аналитикой и продуктом.', 140000, 210000, 'hybrid', true);

-- ===== VACANCY SKILLS =====
INSERT INTO vacancy_skills (vacancy_id, skill_id, required_level, is_required) VALUES
(1, 1, 4, true),
(1, 2, 4, true),
(1, 3, 3, true),
(1, 4, 2, false),
(1, 12, 4, true),

(2, 10, 4, true),
(2, 9, 2, false),
(2, 12, 3, true),
(2, 6, 2, false),

(3, 5, 4, true),
(3, 6, 4, true),
(3, 9, 2, false),
(3, 10, 2, false),
(3, 12, 3, true),

(4, 11, 4, true),
(4, 8, 2, false),
(4, 3, 3, true),
(4, 12, 4, true),

(5, 8, 4, true),
(5, 1, 3, false),
(5, 2, 3, true),
(5, 3, 3, true),
(5, 12, 4, true),

(6, 9, 4, true),
(6, 10, 3, true),
(6, 5, 2, false),
(6, 6, 2, false);

-- ===== APPLICATIONS =====
INSERT INTO applications (id, candidate_id, vacancy_id, status) VALUES
(1, 2, 1, 'interview'),
(2, 2, 5, 'applied'),
(3, 3, 3, 'offer'),
(4, 3, 6, 'interview'),
(5, 4, 4, 'applied'),
(6, 5, 2, 'interview'),
(7, 5, 6, 'rejected');

-- ===== CHAT MESSAGES =====
INSERT INTO chat_messages (application_id, sender_id, message) VALUES
(1, 6, 'Иван, добрый день! Спасибо за отклик. Хотели бы пригласить вас на первое техническое интервью на этой неделе.'),
(1, 2, 'Добрый день! Спасибо, с удовольствием. Могу во вторник или среду после 15:00.'),
(1, 6, 'Отлично, тогда предварительно поставим среду на 16:00. Отправим детали отдельным сообщением.'),

(3, 7, 'Анна, команда готова сделать вам оффер. Если вам удобно, обсудим детали по зарплате и формату выхода.'),
(3, 3, 'Спасибо! Да, удобно. Буду рада созвониться сегодня после 18:00.'),

(4, 7, 'Елена, нам очень понравился ваш опыт. Хотим провести финальную встречу с руководителем продукта.'),
(4, 5, 'Спасибо! Готова подключиться. Пришлите, пожалуйста, удобные слоты на этой неделе.'),

(5, 8, 'Михаил, спасибо за отклик. Мы получили ваше резюме и вернёмся с обратной связью после первичного отбора.'),
(5, 4, 'Спасибо, буду ждать. При необходимости могу сразу прислать примеры автотестов и описание процессов.'),

(6, 6, 'Елена, приглашаем вас на интервью с командой аналитики и дизайна.'),
(6, 5, 'Отлично, спасибо. Подходит четверг после 11:00.');

-- ===== AUTO_INCREMENT SAFETY =====
ALTER TABLE users AUTO_INCREMENT = 9;
ALTER TABLE skills AUTO_INCREMENT = 13;
ALTER TABLE vacancies AUTO_INCREMENT = 7;
ALTER TABLE applications AUTO_INCREMENT = 8;
