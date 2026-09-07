import {
  Book,
  Challenge,
  YouTubeVideo,
  VipContent,
  Deposit,
  WalletTransaction,
  Purchase,
  Achievement,
  PaymentSettings,
  AppSettings,
  UserProfile,
  AdminActivityLog
} from '../types';

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'book-1',
    title: 'Understanding Sugar & Insulin',
    author: 'Dr. Aster Haile, MD',
    description: 'A comprehensive, eye-opening guide to how refined carbohydrates and sugar spike insulin, cause metabolic exhaustion, and how simple dietary swaps restore all-day energy.',
    cover_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    category: 'Sugar Reduction',
    price: 0,
    is_free: true,
    file_url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf',
    is_active: true,
    created_at: new Date(Date.now() - 86400000 * 20).toISOString()
  },
  {
    id: 'book-2',
    title: 'Healthy Weight Management: The Sustainable Blueprint',
    author: 'Tena Holistic Medical Board',
    description: 'Reject crash dieting forever. Learn the biology of fat burning, appetite hormones (ghrelin & leptin), and a 4-pillar routine for long-term health.',
    cover_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    category: 'Weight Management',
    price: 0,
    is_free: true,
    file_url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf',
    is_active: true,
    created_at: new Date(Date.now() - 86400000 * 15).toISOString()
  },
  {
    id: 'book-3',
    title: 'Walking for Cellular Longevity & Heart Health',
    author: 'Abebe Kebede, MSc Kinesiology',
    description: 'Why 7,000 to 10,000 brisk steps a day transforms blood pressure, strengthens mitochondrial density, and supports arterial elasticity.',
    cover_url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
    category: 'Walking & Movement',
    price: 100,
    is_free: false,
    file_url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf',
    is_active: true,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString()
  },
  {
    id: 'book-4',
    title: 'Diabetes Prevention & Reversal Protocols',
    author: 'Dr. Aster Haile, MD & Clinical Team',
    description: 'Evidence-based clinical strategies for lowering HbA1c, reversing pre-diabetes, and mastering postprandial glucose regulation.',
    cover_url: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=600&q=80',
    category: 'Diabetes Management',
    price: 150,
    is_free: false,
    file_url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf',
    is_active: true,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
  }
];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'challenge-1',
    title: 'Morning 20-Minute Brisk Walk',
    description: 'Step outside within 60 minutes of waking up. Get natural daylight in your eyes and walk at an energetic pace. This synchronizes your circadian clock and improves glycemic control.',
    short_description: 'Energize your morning with 20 minutes of outdoor movement.',
    image_url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80',
    category: 'Walking',
    difficulty: 'Easy',
    duration: '20 mins',
    price: 0,
    is_free: true,
    stars_reward: 2,
    order_number: 1,
    is_active: true,
    is_daily: true,
    created_at: new Date(Date.now() - 86400000 * 14).toISOString()
  },
  {
    id: 'challenge-2',
    title: 'Zero Added Sugar Day',
    description: 'Eliminate all sweetened beverages, sodas, added sugar in tea/coffee, and packaged pastries today. Eat whole fruits, whole grains, and protein instead.',
    short_description: 'Keep your body completely free from refined sugar today.',
    image_url: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80',
    category: 'Sugar Reduction',
    difficulty: 'Medium',
    duration: 'Full Day',
    price: 0,
    is_free: true,
    stars_reward: 3,
    order_number: 2,
    is_active: true,
    is_daily: true,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString()
  },
  {
    id: 'challenge-3',
    title: 'Hydration & Mineral Balance (2.5 Liters)',
    description: 'Drink 2.5 liters of clean water throughout the day. Add a pinch of mineral sea salt or lemon to optimize intracellular hydration and avoid afternoon brain fog.',
    short_description: 'Reach your optimal hydration target today.',
    image_url: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
    category: 'Nutrition',
    difficulty: 'Easy',
    duration: 'All Day',
    price: 0,
    is_free: true,
    stars_reward: 1,
    order_number: 3,
    is_active: true,
    is_daily: true,
    created_at: new Date(Date.now() - 86400000 * 8).toISOString()
  },
  {
    id: 'challenge-4',
    title: 'Post-Meal 10-Minute Glucose Walk',
    description: 'Walk gently for 10 minutes right after your largest meal (lunch or dinner). Muscle contraction soaks up circulating glucose without demanding extra insulin.',
    short_description: 'Blunt your blood sugar spike with a post-dinner stroll.',
    image_url: 'https://images.unsplash.com/photo-1483721074573-586540da5703?auto=format&fit=crop&w=800&q=80',
    category: 'Metabolic Health',
    difficulty: 'Easy',
    duration: '10 mins',
    price: 0,
    is_free: true,
    stars_reward: 2,
    order_number: 4,
    is_active: true,
    is_daily: true,
    created_at: new Date(Date.now() - 86400000 * 6).toISOString()
  },
  {
    id: 'challenge-5',
    title: '30-Day Intensive Walking & Cardio Masterclass',
    description: 'A comprehensive structured 30-day program guided by exercise physiologists to gradually build stamina, burn visceral fat, and double daily step volume.',
    short_description: 'Premium 30-day guided program with daily milestones and check-ins.',
    image_url: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80',
    category: 'Walking',
    difficulty: 'Hard',
    duration: '30 Days',
    price: 150,
    is_free: false,
    stars_reward: 15,
    order_number: 5,
    is_active: true,
    is_daily: false,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: 'challenge-6',
    title: '21-Day Sugar Detox & Metabolic Reset',
    description: 'Break emotional sugar cravings and reset your dopamine reward pathways with meal plans, habit anchors, and daily doctor voice notes.',
    short_description: 'Reset your tastebuds and insulin sensitivity in 3 weeks.',
    image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    category: 'Sugar Reduction',
    difficulty: 'Medium',
    duration: '21 Days',
    price: 120,
    is_free: false,
    stars_reward: 10,
    order_number: 6,
    is_active: true,
    is_daily: false,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

export const INITIAL_YOUTUBE_VIDEOS: YouTubeVideo[] = [
  {
    id: 'yt-1',
    title: 'How Walking 15 Minutes After Meals Lowers Blood Sugar',
    description: 'Visualizing how skeletal muscle glucose transporters (GLUT4) activate independently of insulin when you walk after eating.',
    youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=700&q=80',
    category: 'Walking',
    tags: ['walking', 'glucose', 'insulin', 'longevity'],
    is_active: true,
    order_number: 1,
    created_at: new Date(Date.now() - 86400000 * 12).toISOString()
  },
  {
    id: 'yt-2',
    title: 'The Truth About Hidden Sugar in Modern Diets',
    description: 'Discover the 50+ deceptive names of added sugar in packaged foods and condiments, and why liquid fructose drives fatty liver.',
    youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=700&q=80',
    category: 'Sugar',
    tags: ['sugar', 'liver', 'health', 'metabolism'],
    is_active: true,
    order_number: 2,
    created_at: new Date(Date.now() - 86400000 * 9).toISOString()
  },
  {
    id: 'yt-3',
    title: 'Doctor Talk: Understanding Type 2 Diabetes & Reversibility',
    description: 'Dr. Aster explains how early lifestyle intervention can dramatically bring HbA1c back into normal reference range.',
    youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=700&q=80',
    category: 'Doctor Talk',
    tags: ['diabetes', 'doctor', 'reversal', 'prevention'],
    is_active: true,
    order_number: 3,
    created_at: new Date(Date.now() - 86400000 * 7).toISOString()
  },
  {
    id: 'yt-4',
    title: 'Cancer Prevention & Lifestyle Factors: Evidence Overview',
    description: 'A compassionate, scientific discussion of dietary antioxidant density, chronic inflammation reduction, and physical movement.',
    youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=700&q=80',
    category: 'Cancer Awareness',
    tags: ['cancer awareness', 'inflammation', 'prevention', 'science'],
    is_active: true,
    order_number: 4,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'yt-5',
    title: 'Healthy Ethiopian Superfoods: Teff, Flax, and Greens',
    description: 'Analyzing the ancient nutritional wisdom of Teff, low glycemic indices, and how to build balanced traditional plates.',
    youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80',
    category: 'Nutrition',
    tags: ['nutrition', 'teff', 'superfoods', 'ethiopia'],
    is_active: true,
    order_number: 5,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'yt-6',
    title: 'Intermittent Fasting & Autophagy: Simple Beginners Guide',
    description: 'How taking a 12 to 16 hour digestive break allows your cells to perform maintenance, renew cellular components, and regulate hunger.',
    youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=700&q=80',
    category: 'Metabolic Health',
    tags: ['fasting', 'metabolism', 'autophagy', 'weight loss'],
    is_active: true,
    order_number: 6,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

export const INITIAL_VIP_CONTENT: VipContent[] = [
  {
    id: 'vip-1',
    title: 'Metabolic Trick: The Vinegar & Fiber Preload',
    description: 'How taking 1 tablespoon of apple cider vinegar in water or a raw vegetable salad before carbs reduces the glucose spike by up to 30%.',
    image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    content: 'Clinical trials demonstrate that acetic acid slows gastric emptying and inhibits alpha-amylase enzyme activity. Ingesting 1 tablespoon of unfiltered apple cider vinegar diluted in 250ml water 10 minutes prior to a carbohydrate-rich lunch blunts the post-meal glycemic surge by ~25-30% without requiring medication.',
    content_type: 'trick',
    is_active: true,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString()
  },
  {
    id: 'vip-2',
    title: 'VIP Master Book: The Complete Metabolic Health Almanac',
    description: 'Exclusive 180-page reference manual for VIP members covering lab testing interpretation, nutrition biochemistry, and exercise science.',
    image_url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
    content: 'VIP exclusive publication. In this comprehensive handbook, we analyze every standard clinical biomarker (Fasting Glucose, Fasting Insulin, Triglycerides to HDL ratio, hs-CRP, and HOMA-IR index) so you can advocate for your longevity with clinical precision.',
    content_type: 'book',
    is_active: true,
    created_at: new Date(Date.now() - 86400000 * 7).toISOString()
  },
  {
    id: 'vip-3',
    title: 'Doctor Talk Q&A: Addressing Chronic Fatigue & Hormonal Balance',
    description: 'Dr. Aster addresses VIP questions about thyroid function, adrenal exhaustion, and natural cortisol rhythm restoration.',
    image_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
    content: 'Afternoon energy crashes are almost universally triggered by excessive post-breakfast insulin secretion followed by reactive hypoglycemia, rather than insufficient caffeine. Shifting your first meal to prioritize at least 30g of protein and fiber will anchor your autonomic nervous system all day.',
    content_type: 'doctor_talk',
    is_active: true,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: 'vip-4',
    title: 'VIP Tip: Cold Water Immersion & Brown Adipose Tissue',
    description: 'Stimulating mitochondrial uncoupling protein (UCP1) through gentle 60-second cool shower finishers.',
    image_url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    content: 'Brown adipose tissue (BAT) burns chemical energy directly into body heat via mitochondrial UCP1 uncoupling. Ending your standard warm shower with 30-60 seconds of cold water across your neck, clavicles, and upper back naturally awakens dormant BAT reserves and improves insulin sensitivity.',
    content_type: 'tip',
    is_active: true,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

export const INITIAL_PAYMENT_SETTINGS: PaymentSettings = {
  id: 'pay-001',
  telebirr_account_name: 'Tena Holistic Health Care',
  telebirr_account_number: '0911223344',
  telebirr_instructions: '1. Open your Telebirr App\n2. Transfer desired amount to 0911223344 (Tena Holistic)\n3. Take a screenshot of the completed payment receipt\n4. Enter transaction reference & attach screenshot below.',
  cbe_account_name: 'Tena Holistic Health Services PLC',
  cbe_account_number: '1000234567891',
  cbe_instructions: '1. Open CBE Birr or Commercial Bank of Ethiopia App\n2. Transfer to Account: 1000234567891\n3. Capture SMS or digital receipt\n4. Enter CBE reference code and upload receipt photo below.',
  updated_at: new Date().toISOString()
};

export const INITIAL_APP_SETTINGS: AppSettings = {
  id: 'app-001',
  doctor_name: 'Dr. Aster Haile, MD',
  doctor_specialty: 'Preventive Medicine & Metabolic Health Specialist',
  doctor_bio: 'Chief Medical Director at Tena Holistic. With over 14 years of clinical experience, Dr. Aster is passionate about helping patients understand their metabolism, prevent chronic disease, and reclaim vibrant energy naturally.',
  doctor_contact_info: '@TenaHolisticDoctor',
  doctor_avatar_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
  emergency_crisis_phone: '8000',
  updated_at: new Date().toISOString()
};

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    code: 'first_challenge',
    title: 'First Step Taken',
    description: 'Completed your very first health challenge on Tena Holistic.',
    icon: '⭐',
    requirement_type: 'challenges',
    requirement_value: 1,
    stars_reward: 5
  },
  {
    id: 'ach-2',
    code: 'seven_challenges',
    title: 'Week Warrior',
    description: 'Completed 7 health challenges and built positive momentum.',
    icon: '🏆',
    requirement_type: 'challenges',
    requirement_value: 7,
    stars_reward: 15
  },
  {
    id: 'ach-3',
    code: 'thirty_challenges',
    title: 'Habit Master',
    description: 'Completed 30 health challenges. Your body is thanking you!',
    icon: '🎖️',
    requirement_type: 'challenges',
    requirement_value: 30,
    stars_reward: 50
  },
  {
    id: 'ach-4',
    code: 'hundred_stars',
    title: 'Centurion of Health',
    description: 'Accumulated 100 stars across your wellness journey.',
    icon: '✨',
    requirement_type: 'stars',
    requirement_value: 100,
    stars_reward: 25
  },
  {
    id: 'ach-5',
    code: 'seven_day_streak',
    title: '7-Day Fire',
    description: 'Maintained a 7-day daily challenge streak without missing.',
    icon: '🔥',
    requirement_type: 'streak',
    requirement_value: 7,
    stars_reward: 20
  },
  {
    id: 'ach-6',
    code: 'thirty_day_streak',
    title: '30-Day Legend',
    description: 'Achieved an unbroken 30-day streak of daily health discipline.',
    icon: '⚡',
    requirement_type: 'streak',
    requirement_value: 30,
    stars_reward: 100
  },
  {
    id: 'ach-7',
    code: 'vip_member',
    title: 'VIP Inner Circle',
    description: 'Became a privileged VIP member with direct doctor consultation access.',
    icon: '💎',
    requirement_type: 'vip',
    requirement_value: 1,
    stars_reward: 10
  }
];

export const INITIAL_DEPOSITS: Deposit[] = [
  {
    id: 'dep-101',
    user_id: 'user-001',
    amount: 500,
    payment_method: 'Telebirr',
    transaction_reference: 'TEL-839201948',
    receipt_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    status: 'pending',
    submitted_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    user: {
      telegram_id: 68492011,
      first_name: 'Bereket',
      last_name: 'Tekle',
      username: 'berekettk',
      photo_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    }
  },
  {
    id: 'dep-102',
    user_id: 'user-002',
    amount: 250,
    payment_method: 'CBE Birr',
    transaction_reference: 'CBE-9948201',
    receipt_url: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=600&q=80',
    status: 'approved',
    submitted_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    reviewed_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    reviewed_by: 'admin@tenaholistic.com',
    user: {
      telegram_id: 92837461,
      first_name: 'Selamawit',
      last_name: 'Alemu',
      username: 'selam_health',
      photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
    }
  }
];

export const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx-1',
    user_id: 'user-001',
    amount: 500,
    transaction_type: 'deposit',
    reference: 'Deposit approved (Telebirr Ref: TEL-71938210)',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'tx-2',
    user_id: 'user-001',
    amount: -150,
    transaction_type: 'challenge_purchase',
    reference: 'Purchased challenge: 30-Day Intensive Walking & Cardio Masterclass',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

export const INITIAL_PURCHASES: Purchase[] = [
  {
    id: 'pur-1',
    user_id: 'user-001',
    content_type: 'challenge',
    content_id: 'challenge-5',
    price: 150,
    purchased_at: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

export const INITIAL_LOGS: AdminActivityLog[] = [
  {
    id: 'log-1',
    admin_id: 'admin-001',
    admin_email: 'admin@tenaholistic.com',
    action: 'Approved Deposit',
    details: 'Approved 250 ETB deposit for user Selamawit Alemu (Ref: CBE-9948201)',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'log-2',
    admin_id: 'admin-001',
    admin_email: 'admin@tenaholistic.com',
    action: 'Published Book',
    details: 'Published new medical book: Diabetes Prevention & Reversal Protocols',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
  }
];
