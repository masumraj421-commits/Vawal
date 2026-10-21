import { Product, Order, DistrictOption } from '../types';

// Exact generated image asset paths
import heroBannerImg from '../assets/images/hero_fresh_food_banner_1792503901793.jpg';
import honeyImg from '../assets/images/product_pure_honey_1792503902371.jpg';
import mixedNutsImg from '../assets/images/product_mixed_nuts_1792503903033.jpg';
import datesRaisinsImg from '../assets/images/product_dates_raisins_1792503903308.jpg';
import seedsImg from '../assets/images/product_superfood_seeds_1792503903128.jpg';

export { heroBannerImg, honeyImg, mixedNutsImg, datesRaisinsImg, seedsImg };

export const CATEGORIES = [
  { id: 'all', nameBn: 'সকল পণ্য', nameEn: 'All Products', count: 8 },
  { id: 'honey', nameBn: 'প্রাকৃতিক মধু', nameEn: 'Natural Honey', count: 2 },
  { id: 'nuts', nameBn: 'বাদাম সম্ভার', nameEn: 'Dry Nuts', count: 3 },
  { id: 'dates', nameBn: 'প্রিমিয়াম খেজুর', nameEn: 'Selected Dates', count: 1 },
  { id: 'raisins', nameBn: 'কিশমিশ', nameEn: 'Raisins', count: 1 },
  { id: 'seeds', nameBn: 'বীজ ও সুপারফুড', nameEn: 'Seeds & Superfoods', count: 1 },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'bff-001',
    nameBn: 'সুন্দরবনের প্রাকৃতিক খলিশা ফুলের খাঁটি মধু',
    nameEn: 'Sundarbans Natural Khalisha Flower Honey',
    category: 'honey',
    categoryBn: 'প্রাকৃতিক মধু',
    shortDescBn: 'সুন্দরবনের গভীর অরণ্য থেকে সরাসরি মৌয়ালদের মাধ্যমে সংগৃহীত ১০০% কাঁচা ও অপ্রক্রিয়াজাত মধু।',
    descriptionBn: 'ভাওয়াল ফ্রেশ ফুডের সুন্দরবনের খলিশা ফুলের মধু সম্পূর্ণ প্রাকৃতিকভাবে সংগৃহীত। এতে কোনো কৃত্রিম চিনি, ফ্লেভার বা কেমিক্যাল মেশানো হয় না। খাঁটি কাঁচা মধুর প্রাকৃতিক সুবাস ও অতুলনীয় স্বাদ আপনার প্রতিদিনের সুস্বাস্থ্যের সঙ্গী।',
    benefitsBn: [
      'রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি করে',
      'কাশ ও ঠান্ডাজনিত সমস্যায় দ্রুত আরাম দেয়',
      'প্রাকৃতিক এনার্জি বুস্টার হিসেবে কাজ করে',
      'হজমশক্তি বৃদ্ধি ও ত্বক উজ্জ্বল রাখতে সহায়ক'
    ],
    image: honeyImg,
    isFeatured: true,
    isBestSeller: true,
    rating: 4.9,
    reviewsCount: 128,
    stock: 45,
    originBn: 'সুন্দরবন, সাতক্ষীরা জোন',
    variants: [
      { id: 'v1-250', weight: '250g', weightBn: '২৫০ গ্রাম', price: 380, originalPrice: 420, inStock: true },
      { id: 'v1-500', weight: '500g', weightBn: '৫০০ গ্রাম', price: 720, originalPrice: 790, inStock: true },
      { id: 'v1-1000', weight: '1kg', weightBn: '১ কেজি', price: 1390, originalPrice: 1550, inStock: true },
    ]
  },
  {
    id: 'bff-002',
    nameBn: 'প্রিমিয়াম কাজুবাদাম ও ক্যালিফোর্নিয়া কাঠবাদাম কম্বো',
    nameEn: 'Premium Roasted Cashew & California Almond Mix',
    category: 'nuts',
    categoryBn: 'বাদাম সম্ভার',
    shortDescBn: 'হালকা ভাজা ও কুঁচকুঁচে মুচমুচে কাজুবাদাম এবং ক্যালিফোর্নিয়া থেকে আমদানিকৃত সেরা কাঠবাদাম।',
    descriptionBn: 'ভাওয়াল ফ্রেশ ফুড নিয়ে এসেছে প্রিমিয়াম গ্রেডের ভাজা কাজুবাদাম এবং টাটকা ক্যালিফোর্নিয়া কাঠবাদামের মনকাড়া পুষ্টিকর ব্লেন্ড। প্রতিটি বাদাম বাছাইকৃত, স্বাস্থ্যসম্মত প্যাক এবং খাঁটি স্বাদের নিশ্চয়তা।',
    benefitsBn: [
      'হার্ট ও রক্তচাপ নিয়ন্ত্রণে সহায়ক ওমেগা-৩ ও ভালো চর্বি',
      'মস্তিষ্কের স্মৃতিশক্তি বাড়াতে দারুণ কার্যকর',
      'উচ্চমাত্রার প্রোটিন ও ফাইবার সমৃদ্ধ স্ন্যাক্স'
    ],
    image: mixedNutsImg,
    isFeatured: true,
    isBestSeller: true,
    rating: 4.8,
    reviewsCount: 94,
    stock: 38,
    originBn: 'আমদানি ও নিজস্ব স্বাস্থ্যসম্মত রোস্টিং',
    variants: [
      { id: 'v2-250', weight: '250g', weightBn: '২৫০ গ্রাম', price: 420, originalPrice: 460, inStock: true },
      { id: 'v2-500', weight: '500g', weightBn: '৫০০ গ্রাম', price: 820, originalPrice: 900, inStock: true },
      { id: 'v2-1000', weight: '1kg', weightBn: '১ কেজি', price: 1580, originalPrice: 1750, inStock: true },
    ]
  },
  {
    id: 'bff-003',
    nameBn: 'মদিনার সুস্বাদু ভিআইপি মরিয়ম ও আজওয়া খেজুর',
    nameEn: 'VIP Ajwa & Maryam Premium Dates',
    category: 'dates',
    categoryBn: 'প্রিমিয়াম খেজুর',
    shortDescBn: 'সৌদি আরবের মদিনা মোনাওয়ারা থেকে আমদানিকৃত নরম, রসালো ও অতি পুষ্টিকর খেজুর।',
    descriptionBn: 'মরিয়ম ও আজওয়া খেজুরের প্রাকৃতিক মিষ্টতা এবং অসাধারণ পুষ্টিগুণ আপনার পরিবারের জন্য আদর্শ। ডায়াবেটিক ও স্বাস্থ্য সচেতন যে কারো জন্য চিনি পরিহার করে প্রাকৃতিক শক্তির সেরা উৎস।',
    benefitsBn: [
      'প্রাকৃতিক মিষ্টি ও তাত্ক্ষণিক শারীরিক শক্তি বৃদ্ধি',
      'আয়রন, ক্যালসিয়াম ও ভিটামিনে সমৃদ্ধ',
      'হৃদরোগের ঝুঁকি কমাতে সহায়তা করে'
    ],
    image: datesRaisinsImg,
    isFeatured: true,
    isBestSeller: true,
    rating: 5.0,
    reviewsCount: 165,
    stock: 52,
    originBn: 'মদিনা শরিফ, সৌদি আরব',
    variants: [
      { id: 'v3-250', weight: '250g', weightBn: '২৫০ গ্রাম', price: 350, originalPrice: 390, inStock: true },
      { id: 'v3-500', weight: '500g', weightBn: '৫০০ গ্রাম', price: 680, originalPrice: 750, inStock: true },
      { id: 'v3-1000', weight: '1kg', weightBn: '১ কেজি', price: 1290, originalPrice: 1450, inStock: true },
    ]
  },
  {
    id: 'bff-004',
    nameBn: 'আফগানিস্তানের গোল্ডেন জাম্বো কিশমিশ',
    nameEn: 'Afghan Jumbo Golden Raisins',
    category: 'raisins',
    categoryBn: 'কিশমিশ',
    shortDescBn: 'রোদে শুকানো সম্পূর্ণ প্রাকৃতিক সোনালি মিষ্টি কিশমিশ। ধূলিমুক্ত ও পরিচ্ছন্ন।',
    descriptionBn: 'আফগানিস্তানের বিখ্যাত বাগানের বাছাইকৃত রসালো আঙুর রোদে শুকিয়ে তৈরি জাম্বো গোল্ডেন কিশমিশ। পায়েস, সেমাই, পোলাও বা প্রতিদিনের স্ন্যাক হিসেবে দারুণ উপযোগী।',
    benefitsBn: [
      'শরীরে রক্তস্বল্পতা ও আয়রনের ঘাটতি পূরণ করে',
      'হজমশক্তি ও অন্ত্রের স্বাস্থ্যের যত্ন নেয়',
      'অ্যান্টি-অক্সিডেন্ট রক্তকে বিশুদ্ধ রাখে'
    ],
    image: datesRaisinsImg,
    isFeatured: false,
    isBestSeller: true,
    rating: 4.7,
    reviewsCount: 62,
    stock: 60,
    originBn: 'কান্দাহার, আফগানিস্তান',
    variants: [
      { id: 'v4-250', weight: '250g', weightBn: '২৫০ গ্রাম', price: 210, originalPrice: 240, inStock: true },
      { id: 'v4-500', weight: '500g', weightBn: '৫০০ গ্রাম', price: 400, originalPrice: 460, inStock: true },
      { id: 'v4-1000', weight: '1kg', weightBn: '১ কেজি', price: 780, originalPrice: 880, inStock: true },
    ]
  },
  {
    id: 'bff-005',
    nameBn: 'অর্গানিক চিয়া সিডস ও রোস্টেড চিনাবাদাম প্যাক',
    nameEn: 'Organic Chia Seeds & Roasted Deshi Peanuts',
    category: 'seeds',
    categoryBn: 'বীজ ও সুপারফুড',
    shortDescBn: 'ওজন নিয়ন্ত্রণ ও প্রতিদিনের পুষ্টি চাহিদায় খাঁটি মেক্সিকান চিয়া বীজ ও মচমচে দেশি চিনাবাদাম।',
    descriptionBn: 'উচ্চমানের ডায়েটারি ফাইবার ও ওমেগা ফ্যাটি অ্যাসিডে ভরপুর প্রাকৃতিক সুপারফুড। সকালের নাস্তায় দুধ, ওটস বা লেবুপানির সাথে মিশিয়ে প্রতিদিন পান করার জন্য সেরা।',
    benefitsBn: [
      'ওজন কমাতে ও ক্ষুধা নিয়ন্ত্রণে বিস্ময়কর কার্যকরী',
      'উচ্চমাত্রার উদ্ভিজ্জ প্রোটিন সমৃদ্ধ',
      'ত্বক ও চুলের পুষ্টি জোগায়'
    ],
    image: seedsImg,
    isFeatured: true,
    isBestSeller: false,
    rating: 4.8,
    reviewsCount: 47,
    stock: 40,
    originBn: 'আমদানিকৃত চিয়া সিড ও ভাওয়াল গড়ের দেশি চিনাবাদাম',
    variants: [
      { id: 'v5-250', weight: '250g', weightBn: '২৫০ গ্রাম', price: 260, originalPrice: 290, inStock: true },
      { id: 'v5-500', weight: '500g', weightBn: '৫০০ গ্রাম', price: 490, originalPrice: 550, inStock: true },
      { id: 'v5-1000', weight: '1kg', weightBn: '১ কেজি', price: 920, originalPrice: 1050, inStock: true },
    ]
  },
  {
    id: 'bff-006',
    nameBn: 'ভাওয়াল গড়ের দেশি ক্রাঞ্চি ভাজা চিনাবাদাম',
    nameEn: 'Crunchy Deshi Roasted Peanuts',
    category: 'nuts',
    categoryBn: 'বাদাম সম্ভার',
    shortDescBn: 'বালুতে ভাজা সম্পূর্ণ খাঁটি দেশীয় খোসাযুক্ত ও খোসাছাড়ানো সুস্বাদু চিনাবাদাম।',
    descriptionBn: 'গাজীপুরের ঐতিহ্যবাহী ভাওয়াল অঞ্চলের কৃষকদের সরাসরি চাষ করা দেশি চিনাবাদাম। বালুতে স্বাস্থ্যসম্মতভাবে ভাজা, কোনো ক্ষতিকর তেল বা প্রিজারভেটিভ নেই।',
    benefitsBn: [
      'সহজলভ্য কিন্তু উচ্চমানের প্রোটিনের আধার',
      'শরীরকে কর্মক্ষম ও চনমনে রাখে',
      'বিকেলের চায়ের সাথে পারফেক্ট স্বাস্থ্যকর নাস্তা'
    ],
    image: seedsImg,
    isFeatured: false,
    isBestSeller: true,
    rating: 4.9,
    reviewsCount: 88,
    stock: 75,
    originBn: 'ভাওয়াল অঞ্চল, গাজীপুর',
    variants: [
      { id: 'v6-250', weight: '250g', weightBn: '২৫০ গ্রাম', price: 110, originalPrice: 130, inStock: true },
      { id: 'v6-500', weight: '500g', weightBn: '৫০০ গ্রাম', price: 200, originalPrice: 240, inStock: true },
      { id: 'v6-1000', weight: '1kg', weightBn: '১ কেজি', price: 380, originalPrice: 450, inStock: true },
    ]
  },
  {
    id: 'bff-007',
    nameBn: 'প্রাকৃতিক সরিষা ফুলের খাঁটি দানাদার মধু',
    nameEn: 'Natural Mustard Blossom Cream Honey',
    category: 'honey',
    categoryBn: 'প্রাকৃতিক মধু',
    shortDescBn: 'শীতকালীন সরিষা ফুলের মনকাড়া মিষ্টি সুগন্ধি ও প্রাকৃতিক মাখনের মতো ক্রিস্টালাইজড খাঁটি মধু।',
    descriptionBn: 'উত্তরবঙ্গের দিগন্তজোড়া সরিষা ক্ষেত থেকে সংগৃহীত এই মধু প্রাকৃতিকভাবেই হালকা জমে যাওয়া মাখনের মতো টেক্সচার পায়। এতে খাঁটি গ্লুকোজ ও ফ্রুক্টোজের প্রাকৃতিক ভারসাম্য বিদ্যমান।',
    benefitsBn: [
      'শীতকালের সর্দি-কাশির সুরক্ষায় অতুলনীয়',
      'রুচি ও পরিপাকতন্ত্রের শক্তি বৃদ্ধি করে',
      'শিশুদের জন্য পুষ্টিকর ও প্রিয় মিষ্টি'
    ],
    image: honeyImg,
    isFeatured: false,
    isBestSeller: false,
    rating: 4.6,
    reviewsCount: 39,
    stock: 30,
    originBn: 'সিরাজগঞ্জ ও নাটোর',
    variants: [
      { id: 'v7-500', weight: '500g', weightBn: '৫০০ গ্রাম', price: 380, originalPrice: 440, inStock: true },
      { id: 'v7-1000', weight: '1kg', weightBn: '১ কেজি', price: 720, originalPrice: 820, inStock: true },
    ]
  },
  {
    id: 'bff-008',
    nameBn: 'আখরোতের গিরি (Walnut Kernels) প্রিমিয়াম',
    nameEn: 'Premium Walnut Kernels Chile',
    category: 'nuts',
    categoryBn: 'বাদাম সম্ভার',
    shortDescBn: 'মস্তিষ্কের আদলে তৈরি সুপার নাট — টাটকা, মিষ্টি স্বাদের খোসা ছাড়ানো আখরোটের গিরি।',
    descriptionBn: 'ব্রেন হেলথের জন্য বিশ্বজুড়ে সুপরিচিত প্রিমিয়াম চিলিয়ান আখরোট। কোনো প্রকার তেতো ভাব নেই, প্রতিটি টুকরো সতেজ ও মুচমুচে অবস্থায় বাতাসরোধী জারে সংরক্ষিত।',
    benefitsBn: [
      'মেধা ও স্মৃতিশক্তি বৃদ্ধিতে সর্বোৎকৃষ্ট ড্রাই ফ্রুট',
      'ওমেগা-৩ ফ্যাটি এসিডে সমৃদ্ধ',
      'ঘুমের উন্নতি ও স্ট্রেস কমাতে সহায়ক'
    ],
    image: mixedNutsImg,
    isFeatured: true,
    isBestSeller: false,
    rating: 4.9,
    reviewsCount: 51,
    stock: 22,
    originBn: 'চিলি (Chile) আমদানি',
    variants: [
      { id: 'v8-250', weight: '250g', weightBn: '২৫০ গ্রাম', price: 490, originalPrice: 550, inStock: true },
      { id: 'v8-500', weight: '500g', weightBn: '৫০০ গ্রাম', price: 950, originalPrice: 1050, inStock: true },
    ]
  }
];

export const BANGLADESH_DISTRICTS: DistrictOption[] = [
  {
    nameBn: 'ঢাকা (Dhaka)',
    nameEn: 'Dhaka',
    deliveryFee: 70,
    upazilas: ['মিরপুর', 'উত্তরা', 'ধানমন্ডি', 'মোহাম্মদপুর', 'গুলশান', 'বনানী', 'বাড্ডা', 'যাত্রাবাড়ী', 'মতিঝিল', 'খিলগাঁও', 'সাভার', 'ধামরাই', 'কেরানীগঞ্জ']
  },
  {
    nameBn: 'গাজীপুর (ভাওয়াল অঞ্চল)',
    nameEn: 'Gazipur',
    deliveryFee: 70,
    upazilas: ['গাজীপুর সদর', 'জয়দেবপুর', 'টঙ্গী', 'কালিয়াকৈর', 'শ্রীপুর', 'কাপাসিয়া', 'কালীগঞ্জ']
  },
  {
    nameBn: 'নারায়ণগঞ্জ (Narayanganj)',
    nameEn: 'Narayanganj',
    deliveryFee: 70,
    upazilas: ['নারায়ণগঞ্জ সদর', 'ফতুল্লা', 'সিদ্ধিরগঞ্জ', 'বন্দর', 'সোনারগাঁও', 'রূপগঞ্জ', 'আড়াইহাজার']
  },
  {
    nameBn: 'চট্টগ্রাম (Chattogram)',
    nameEn: 'Chattogram',
    deliveryFee: 130,
    upazilas: ['কোতোয়ালী', 'পাঁচলাইশ', 'হালিশহর', 'খুলশী', 'পটিয়া', 'সীতাকুণ্ড', 'মিরসরাই', 'হাটহাজারী', 'রাঙ্গুনিয়া', 'আনোয়ারা']
  },
  {
    nameBn: 'সিলেট (Sylhet)',
    nameEn: 'Sylhet',
    deliveryFee: 130,
    upazilas: ['সিলেট সদর', 'দক্ষিণ সুরমা', 'গোলাপগঞ্জ', 'বিয়ানীবাজার', 'জৈন্তাপুর', 'বিশ্বনাথ', 'ফেঞ্চুগঞ্জ']
  },
  {
    nameBn: 'রাজশাহী (Rajshahi)',
    nameEn: 'Rajshahi',
    deliveryFee: 130,
    upazilas: ['বোয়ালিয়া', 'রাজপাড়া', 'মতিহার', 'পবা', 'গোদাগাড়ী', 'তানোর', 'বাগমারা', 'চারঘাট', 'পুঠিয়া']
  },
  {
    nameBn: 'খুলনা (Khulna)',
    nameEn: 'Khulna',
    deliveryFee: 130,
    upazilas: ['খুলনা সদর', 'সোনাডাঙ্গা', 'খালিশপুর', 'দৌলতপুর', 'দাকোপ', 'ডুমুরিয়া', 'রূপসা', 'পাইকগাছা']
  },
  {
    nameBn: 'বরিশাল (Barishal)',
    nameEn: 'Barishal',
    deliveryFee: 130,
    upazilas: ['বরিশাল সদর', 'বাকেরগঞ্জ', 'বাবুগঞ্জ', 'উজিরপুর', 'গৌরনদী', 'বানারীপাড়া', 'মেহেন্দিগঞ্জ']
  },
  {
    nameBn: 'ময়মনসিংহ (Mymensingh)',
    nameEn: 'Mymensingh',
    deliveryFee: 130,
    upazilas: ['ময়মনসিংহ সদর', 'মুক্তাগাছা', 'ত্রিশাল', 'ভালুকা', 'ফুলবাড়িয়া', 'গফরগাঁও', 'ঈশ্বরগঞ্জ']
  },
  {
    nameBn: 'বগুড়া (Bogura)',
    nameEn: 'Bogura',
    deliveryFee: 130,
    upazilas: ['বগুড়া সদর', 'শেরপুর', 'শিবগঞ্জ', 'দুপচাঁচিয়া', 'গাবতলী', 'কাহালু', 'সোনাতলা']
  },
  {
    nameBn: 'কুমিল্লা (Cumilla)',
    nameEn: 'Cumilla',
    deliveryFee: 130,
    upazilas: ['কুমিল্লা আদর্শ সদর', 'চৌদ্দগ্রাম', 'লাকসাম', 'দাউদকান্দি', 'বরুড়া', 'চান্দিনা', 'দেবীদ্বার']
  },
  {
    nameBn: 'রংপুর (Rangpur)',
    nameEn: 'Rangpur',
    deliveryFee: 130,
    upazilas: ['রংপুর সদর', 'গঙ্গাচড়া', 'তারাগঞ্জ', 'বদরগঞ্জ', 'পীরগাছা', 'পীরগঞ্জ', 'মিঠাপুকুর']
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'BFF-89412',
    customerName: 'তানভীর হাসান',
    phone: '01712345678',
    district: 'ঢাকা (Dhaka)',
    upazila: 'উত্তরা',
    fullAddress: 'হাউজ #১২, রোড #০৫, সেক্টর #০৩, উত্তরা, ঢাকা',
    deliveryNotes: 'দুপুরের পর ডেলিভারি দিলে ভালো হয়।',
    items: [
      {
        productId: 'bff-001',
        productNameBn: 'সুন্দরবনের প্রাকৃতিক খলিশা ফুলের খাঁটি মধু',
        variantWeightBn: '৫০০ গ্রাম',
        price: 720,
        quantity: 1,
        image: honeyImg,
      },
      {
        productId: 'bff-002',
        productNameBn: 'প্রিমিয়াম কাজুবাদাম ও ক্যালিফোর্নিয়া কাঠবাদাম কম্বো',
        variantWeightBn: '২৫০ গ্রাম',
        price: 420,
        quantity: 1,
        image: mixedNutsImg,
      }
    ],
    subtotal: 1140,
    deliveryFee: 70,
    discount: 0,
    total: 1210,
    paymentMethod: 'cod',
    paymentStatus: 'unpaid',
    status: 'shipped',
    createdAt: '2026-10-19 14:30',
    trackingSteps: [
      { titleBn: 'অর্ডার গৃহীত হয়েছে', descBn: 'অর্ডার নিশ্চিত করা হয়েছে এবং ইনভয়েস প্রস্তুত।', timestamp: '১৯ অক্টো, দুপুর ২:৩০', completed: true, current: false },
      { titleBn: 'প্যাকেজিং সম্পন্ন', descBn: 'সুরক্ষিত এয়ারটাইট ও ফুড-গ্রেড প্যাকেটে প্রস্তুত।', timestamp: '১৯ অক্টো, বিকাল ৫:০০', completed: true, current: false },
      { titleBn: 'কুরিয়ারে হস্তান্তর', descBn: 'রাইডার পণ্য নিয়ে আপনার ঠিকানার উদ্দেশ্যে রওনা দিয়েছে।', timestamp: '২০ অক্টো, সকাল ৯:১৫', completed: true, current: true },
      { titleBn: 'ডেলিভারি সম্পন্ন', descBn: 'গ্রাহকের নিকট ক্যাশ অন ডেলিভারিতে হস্তান্তর হবে।', timestamp: 'প্রত্যাশিত: আজ বিকাল', completed: false, current: false },
    ]
  },
  {
    id: 'BFF-78210',
    customerName: 'নাসরিন আক্তার',
    phone: '01898765432',
    district: 'গাজীপুর (ভাওয়াল অঞ্চল)',
    upazila: 'জয়দেবপুর',
    fullAddress: 'ভাওয়াল রাজবাড়ি রোড, জয়দেবপুর বাজার সংলগ্ন, গাজীপুর',
    deliveryNotes: 'অফিস টাইমে ফোন দিবেন।',
    items: [
      {
        productId: 'bff-003',
        productNameBn: 'মদিনার সুস্বাদু ভিআইপি মরিয়ম ও আজওয়া খেজুর',
        variantWeightBn: '১ কেজি',
        price: 1290,
        quantity: 1,
        image: datesRaisinsImg,
      }
    ],
    subtotal: 1290,
    deliveryFee: 70,
    discount: 50,
    total: 1310,
    paymentMethod: 'cod',
    paymentStatus: 'unpaid',
    status: 'confirmed',
    createdAt: '2026-10-20 08:15',
    trackingSteps: [
      { titleBn: 'অর্ডার গৃহীত হয়েছে', descBn: 'অর্ডারটি সফলভাবে গৃহীত হয়েছে।', timestamp: '২০ অক্টো, সকাল ৮:১৫', completed: true, current: false },
      { titleBn: 'প্যাকেজিং প্রক্রিয়াধীন', descBn: 'স্টক থেকে পণ্য যাচাই ও প্যাকেজিং চলছে।', timestamp: '২০ অক্টো, সকাল ৯:০০', completed: true, current: true },
      { titleBn: 'কুরিয়ারে হস্তান্তর', descBn: 'ডেলিভারি পার্টনারের নিকট হস্তান্তর করা হবে।', timestamp: 'অপেক্ষমাণ', completed: false, current: false },
      { titleBn: 'ডেলিভারি সম্পন্ন', descBn: 'গ্রাহকের ঠিকানায় পৌঁছে দেওয়া হবে।', timestamp: 'অপেক্ষমাণ', completed: false, current: false },
    ]
  }
];

// Helper to convert numbers to Bengali digits
export function toBengaliNumber(num: number | string): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (digit) => bnDigits[parseInt(digit, 10)]);
}

// Format currency with BDT symbol (৳)
export function formatBDT(amount: number): string {
  const formatted = amount.toLocaleString('en-US');
  return `৳${toBengaliNumber(formatted)}`;
}
