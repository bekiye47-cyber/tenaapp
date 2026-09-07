-- ==============================================================================
-- TENA HOLISTIC: 002_seed_demo_data.sql
-- High quality seed and demo records for development and production bootstrap
-- ==============================================================================

-- 1. Book Categories
INSERT INTO public.book_categories (name, slug) VALUES
('Metabolic Health', 'metabolic-health'),
('Nutrition & Food', 'nutrition'),
('Sugar Reduction', 'sugar-reduction'),
('Walking & Movement', 'walking-movement'),
('Diabetes Management', 'diabetes-management'),
('Lifestyle & Sleep', 'lifestyle-sleep')
ON CONFLICT (slug) DO NOTHING;

-- 2. Books (Free and Premium Paid in ETB)
INSERT INTO public.books (title, author, description, cover_url, category, price, is_free, file_url, is_active) VALUES
(
    'Understanding Sugar & Insulin',
    'Dr. Aster Haile, MD',
    'A comprehensive, eye-opening guide to how refined carbohydrates and sugar spike insulin, cause metabolic exhaustion, and how simple dietary swaps restore all-day energy.',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    'Sugar Reduction',
    0.00,
    TRUE,
    'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf',
    TRUE
),
(
    'Healthy Weight Management: The Sustainable Blueprint',
    'Tena Holistic Medical Board',
    'Reject crash dieting forever. Learn the biology of fat burning, appetite hormones (ghrelin & leptin), and a 4-pillar routine for long-term health.',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    'Weight Management',
    0.00,
    TRUE,
    'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf',
    TRUE
),
(
    'Walking for Cellular Longevity & Heart Health',
    'Abebe Kebede, MSc Kinesiology',
    'Why 7,000 to 10,000 brisk steps a day transforms blood pressure, strengthens mitochondrial density, and supports arterial elasticity.',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
    'Walking & Movement',
    100.00,
    FALSE,
    'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf',
    TRUE
),
(
    'Diabetes Prevention & Reversal Protocols',
    'Dr. Aster Haile, MD & Clinical Team',
    'Evidence-based clinical strategies for lowering HbA1c, reversing pre-diabetes, and mastering postprandial glucose regulation.',
    'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=600&q=80',
    'Diabetes Management',
    150.00,
    FALSE,
    'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf',
    TRUE
)
ON CONFLICT DO NOTHING;

-- 3. Challenges (Free Daily + Paid Masterclasses)
INSERT INTO public.challenges (title, description, short_description, image_url, category, difficulty, duration, price, is_free, stars_reward, order_number, is_active, is_daily) VALUES
(
    'Morning 20-Minute Brisk Walk',
    'Step outside within 60 minutes of waking up. Get natural daylight in your eyes and walk at an energetic pace. This synchronizes your circadian clock and improves glycemic control.',
    'Energize your morning with 20 minutes of outdoor movement.',
    'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80',
    'Walking',
    'Easy',
    '20 mins',
    0.00,
    TRUE,
    2,
    1,
    TRUE,
    TRUE
),
(
    'Zero Added Sugar Day',
    'Eliminate all sweetened beverages, sodas, added sugar in tea/coffee, and packaged pastries today. Eat whole fruits, whole grains, and protein instead.',
    'Keep your body completely free from refined sugar today.',
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80',
    'Sugar Reduction',
    'Medium',
    'Full Day',
    0.00,
    TRUE,
    3,
    2,
    TRUE,
    TRUE
),
(
    'Hydration & Mineral Balance (2.5 Liters)',
    'Drink 2.5 liters of clean water throughout the day. Add a pinch of mineral sea salt or lemon to optimize intracellular hydration and avoid afternoon brain fog.',
    'Reach your optimal hydration target today.',
    'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
    'Nutrition',
    'Easy',
    'All Day',
    0.00,
    TRUE,
    1,
    3,
    TRUE,
    TRUE
),
(
    'Post-Meal 10-Minute Glucose Walk',
    'Walk gently for 10 minutes right after your largest meal (lunch or dinner). Muscle contraction soaks up circulating glucose without demanding extra insulin.',
    'Blunt your blood sugar spike with a post-dinner stroll.',
    'https://images.unsplash.com/photo-1483721074573-586540da5703?auto=format&fit=crop&w=800&q=80',
    'Metabolic Health',
    'Easy',
    '10 mins',
    0.00,
    TRUE,
    2,
    4,
    TRUE,
    TRUE
),
(
    '30-Day Intensive Walking & Cardio Masterclass',
    'A comprehensive structured 30-day program guided by exercise physiologists to gradually build stamina, burn visceral fat, and double daily step volume.',
    'Premium 30-day guided program with daily milestones and check-ins.',
    'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80',
    'Walking',
    'Hard',
    '30 Days',
    150.00,
    FALSE,
    15,
    5,
    TRUE,
    FALSE
),
(
    '21-Day Sugar Detox & Metabolic Reset',
    'Break emotional sugar cravings and reset your dopamine reward pathways with meal plans, habit anchors, and daily doctor voice notes.',
    'Reset your tastebuds and insulin sensitivity in 3 weeks.',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    'Sugar Reduction',
    'Medium',
    '21 Days',
    120.00,
    FALSE,
    10,
    6,
    TRUE,
    FALSE
)
ON CONFLICT DO NOTHING;

-- 4. YouTube Categories & Videos
INSERT INTO public.youtube_categories (name, slug) VALUES
('All', 'all'),
('Diabetes', 'diabetes'),
('Weight Loss', 'weight-loss'),
('Sugar', 'sugar'),
('Walking', 'walking'),
('Exercise', 'exercise'),
('Nutrition', 'nutrition'),
('Cancer Awareness', 'cancer-awareness'),
('Metabolic Health', 'metabolic-health'),
('Lifestyle', 'lifestyle'),
('Doctor Talk', 'doctor-talk')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.youtube_videos (title, description, youtube_url, thumbnail_url, category, tags, is_active, order_number) VALUES
(
    'How Walking 15 Minutes After Meals Lowers Blood Sugar',
    'Visualizing how skeletal muscle glucose transporters (GLUT4) activate independently of insulin when you walk after eating.',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=700&q=80',
    'Walking',
    ARRAY['walking', 'glucose', 'insulin', 'longevity'],
    TRUE,
    1
),
(
    'The Truth About Hidden Sugar in Modern Diets',
    'Discover the 50+ deceptive names of added sugar in packaged foods and condiments, and why liquid fructose drives fatty liver.',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=700&q=80',
    'Sugar',
    ARRAY['sugar', 'liver', 'health', 'metabolism'],
    TRUE,
    2
),
(
    'Doctor Talk: Understanding Type 2 Diabetes & Reversibility',
    'Dr. Aster explains how early lifestyle intervention can dramatically bring HbA1c back into normal reference range.',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=700&q=80',
    'Doctor Talk',
    ARRAY['diabetes', 'doctor', 'reversal', 'prevention'],
    TRUE,
    3
),
(
    'Cancer Prevention & Lifestyle Factors: Evidence Overview',
    'A compassionate, scientific discussion of dietary antioxidant density, chronic inflammation reduction, and physical movement.',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=700&q=80',
    'Cancer Awareness',
    ARRAY['cancer awareness', 'inflammation', 'prevention', 'science'],
    TRUE,
    4
),
(
    'Healthy Ethiopian Superfoods: Teff, Flax, and Greens',
    'Analyzing the ancient nutritional wisdom of Teff, low glycemic indices, and how to build balanced traditional plates.',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80',
    'Nutrition',
    ARRAY['nutrition', 'teff', 'superfoods', 'ethiopia'],
    TRUE,
    5
),
(
    'Intermittent Fasting & Autophagy: Simple Beginners Guide',
    'How taking a 12 to 16 hour digestive break allows your cells to perform maintenance, renew cellular components, and regulate hunger.',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=700&q=80',
    'Metabolic Health',
    ARRAY['fasting', 'metabolism', 'autophagy', 'weight loss'],
    TRUE,
    6
)
ON CONFLICT DO NOTHING;

-- 5. VIP Exclusive Content
INSERT INTO public.vip_content (title, description, image_url, content, content_type, is_active) VALUES
(
    'Metabolic Trick: The Vinegar & Fiber Preload',
    'How taking 1 tablespoon of apple cider vinegar in water or a raw vegetable salad before carbs reduces the glucose spike by up to 30%.',
    'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    'Clinical studies demonstrate that acetic acid slows gastric emptying and blocks alpha-amylase from breaking down complex starches too rapidly. Try consuming 1 tablespoon of apple cider vinegar in a tall glass of water 10 minutes prior to a carbohydrate-rich lunch.',
    'trick',
    TRUE
),
(
    'VIP Master Book: The Complete Metabolic Health Almanac',
    'Exclusive 180-page reference manual for VIP members covering lab testing interpretation, nutrition biochemistry, and exercise science.',
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
    'VIP members get full unlimited access to download and study our complete 180-page clinical handbook.',
    'book',
    TRUE
),
(
    'Doctor Talk Q&A: Addressing Chronic Fatigue & Hormonal Balance',
    'Dr. Aster addresses VIP questions about thyroid function, adrenal exhaustion, and natural cortisol rhythm restoration.',
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
    'In this session, we review why afternoon fatigue is often driven by breakfast glycemic crashes, not caffeine deficit. Focus on 30g protein before 10 AM and prioritize morning sunlight.',
    'doctor_talk',
    TRUE
),
(
    'VIP Tip: Cold Water Immersion & Brown Adipose Tissue',
    'Stimulating mitochondrial uncoupling protein (UCP1) through gentle 60-second cool shower finishers.',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    'Brown adipose tissue burns energy directly into heat. Finish your normal shower with 30-60 seconds of cool water on your neck and upper spine to naturally stimulate brown fat activation.',
    'tip',
    TRUE
)
ON CONFLICT DO NOTHING;

-- 6. Achievements Catalog
INSERT INTO public.achievements (code, title, description, icon, requirement_type, requirement_value, stars_reward) VALUES
('first_challenge', 'First Step Taken', 'Completed your very first health challenge on Tena Holistic.', '⭐', 'challenges', 1, 5),
('seven_challenges', 'Week Warrior', 'Completed 7 health challenges and built positive momentum.', '🏆', 'challenges', 7, 15),
('thirty_challenges', 'Habit Master', 'Completed 30 health challenges. Your body is thanking you!', '🎖️', 'challenges', 30, 50),
('hundred_stars', 'Centurion of Health', 'Accumulated 100 stars across your wellness journey.', '✨', 'stars', 100, 25),
('seven_day_streak', '7-Day Fire', 'Maintained a 7-day daily challenge streak without missing.', '🔥', 'streak', 7, 20),
('thirty_day_streak', '30-Day Legend', 'Achieved an unbroken 30-day streak of daily health discipline.', '⚡', 'streak', 30, 100),
('vip_member', 'VIP Inner Circle', 'Became a privileged VIP member with direct doctor consultation access.', '💎', 'vip', 1, 10)
ON CONFLICT (code) DO NOTHING;

-- 7. Payment Settings (Telebirr and CBE Birr configuration)
INSERT INTO public.payment_settings (id, telebirr_account_name, telebirr_account_number, telebirr_instructions, cbe_account_name, cbe_account_number, cbe_instructions)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Tena Holistic Health Care',
    '0911223344',
    '1. Open your Telebirr App\n2. Transfer the desired amount to 0911223344 (Tena Holistic)\n3. Take a screenshot of the completed payment receipt\n4. Submit your transaction reference number and upload the receipt below.',
    'Tena Holistic Health Services PLC',
    '1000234567891',
    '1. Open CBE Birr or Commercial Bank of Ethiopia Mobile Banking\n2. Transfer to Account: 1000234567891\n3. Capture the transaction confirmation or SMS receipt\n4. Enter the CBE reference and attach receipt photo below.'
)
ON CONFLICT (id) DO UPDATE SET
    telebirr_account_name = EXCLUDED.telebirr_account_name,
    telebirr_account_number = EXCLUDED.telebirr_account_number,
    cbe_account_name = EXCLUDED.cbe_account_name,
    cbe_account_number = EXCLUDED.cbe_account_number;

-- 8. App Settings
INSERT INTO public.app_settings (id, doctor_name, doctor_specialty, doctor_bio, doctor_contact_info, doctor_avatar_url, emergency_crisis_phone)
VALUES (
    '00000000-0000-0000-0000-000000000002',
    'Dr. Aster Haile, MD',
    'Preventive Medicine & Metabolic Health Specialist',
    'Chief Medical Director at Tena Holistic. Passionate about empowering individuals to prevent chronic illness, reverse metabolic syndrome, and live with vitality.',
    '@TenaHolisticDoctor',
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    '8000'
)
ON CONFLICT (id) DO NOTHING;
