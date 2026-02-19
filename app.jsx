const { useState, useEffect } = React;

// Simple icon components to replace lucide-react
const Icon = ({ children, className = '', size = 24 }) => (
  <span className={className} style={{ fontSize: size, lineHeight: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
    {children}
  </span>
);
const Volume2 = ({ className, size }) => <Icon className={className} size={size}>🔊</Icon>;
const Star = ({ className, size }) => <Icon className={className} size={size}>⭐</Icon>;
const Award = ({ className, size }) => <Icon className={className} size={size}>🏅</Icon>;
const Book = ({ className, size }) => <Icon className={className} size={size}>📖</Icon>;
const Gamepad2 = ({ className, size }) => <Icon className={className} size={size}>🎮</Icon>;
const Trophy = ({ className, size }) => <Icon className={className} size={size}>🏆</Icon>;
const CheckCircle = ({ className, size }) => <Icon className={className} size={size}>✅</Icon>;
const RotateCcw = ({ className, size }) => <Icon className={className} size={size}>🔄</Icon>;

const LanguageLearningApp = () => {
  const [currentView, setCurrentView] = useState('home');
  const [currentCategory, setCurrentCategory] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [progress, setProgress] = useState({});
  const [totalStars, setTotalStars] = useState(0);
  const [dailyStreak, setDailyStreak] = useState(0);
  const [gameState, setGameState] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [showInterestPicker, setShowInterestPicker] = useState(false);

  // Load progress from localStorage
  useEffect(() => {
    // Migrate old key
    const oldData = localStorage.getItem('kannadaHindiProgress');
    if (oldData && !localStorage.getItem('indianLanguagesProgress')) {
      localStorage.setItem('indianLanguagesProgress', oldData);
      localStorage.removeItem('kannadaHindiProgress');
    }
    const savedProgress = localStorage.getItem('indianLanguagesProgress');
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      setProgress(parsed.progress || {});
      setTotalStars(parsed.totalStars || 0);
      setDailyStreak(parsed.dailyStreak || 0);
    }
    const savedInterests = localStorage.getItem('indianLanguagesInterests');
    if (savedInterests) {
      setSelectedInterests(JSON.parse(savedInterests));
    } else {
      setShowInterestPicker(true);
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = (newProgress, stars) => {
    const data = {
      progress: newProgress,
      totalStars: stars,
      dailyStreak: dailyStreak,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('indianLanguagesProgress', JSON.stringify(data));
  };

  const categories = {
    animals: {
      title: 'Animals',
      emoji: '🐘',
      color: 'from-yellow-400 to-orange-400',
      items: [
        { english: 'Dog', kannada: 'ನಾಯಿ', kannadaSound: 'naayi', hindi: 'कुत्ता', hindiSound: 'kutta', gujarati: 'કૂતરો', gujaratiSound: 'kuutro', emoji: '🐕' },
        { english: 'Cat', kannada: 'ಬೆಕ್ಕು', kannadaSound: 'bekku', hindi: 'बिल्ली', hindiSound: 'billi', gujarati: 'બિલાડી', gujaratiSound: 'bilaaDi', emoji: '🐱' },
        { english: 'Elephant', kannada: 'ಆನೆ', kannadaSound: 'aane', hindi: 'हाथी', hindiSound: 'haathi', gujarati: 'હાથી', gujaratiSound: 'haathi', emoji: '🐘' },
        { english: 'Cow', kannada: 'ಹಸು', kannadaSound: 'hasu', hindi: 'गाय', hindiSound: 'gaay', gujarati: 'ગાય', gujaratiSound: 'gaay', emoji: '🐄' },
        { english: 'Monkey', kannada: 'ಕಪಿ', kannadaSound: 'kapi', hindi: 'बंदर', hindiSound: 'bandar', gujarati: 'વાંદરો', gujaratiSound: 'vaandro', emoji: '🐒' },
        { english: 'Bird', kannada: 'ಹಕ್ಕಿ', kannadaSound: 'hakki', hindi: 'पक्षी', hindiSound: 'pakshi', gujarati: 'પક્ષી', gujaratiSound: 'pakshi', emoji: '🐦' },
        { english: 'Fish', kannada: 'ಮೀನು', kannadaSound: 'meenu', hindi: 'मछली', hindiSound: 'machli', gujarati: 'માછલી', gujaratiSound: 'maachli', emoji: '🐟' },
        { english: 'Lion', kannada: 'ಸಿಂಹ', kannadaSound: 'simha', hindi: 'शेर', hindiSound: 'sher', gujarati: 'સિંહ', gujaratiSound: 'sinh', emoji: '🦁' },
        { english: 'Tiger', kannada: 'ಹುಲಿ', kannadaSound: 'huli', hindi: 'बाघ', hindiSound: 'baagh', gujarati: 'વાઘ', gujaratiSound: 'vaagh', emoji: '🐯' },
        { english: 'Rabbit', kannada: 'ಮೊಲ', kannadaSound: 'mola', hindi: 'खरगोश', hindiSound: 'khargosh', gujarati: 'સસલું', gujaratiSound: 'saslun', emoji: '🐰' },
      ]
    },
    colors: {
      title: 'Colors',
      emoji: '🌈',
      color: 'from-pink-400 to-purple-400',
      items: [
        { english: 'Red', kannada: 'ಕೆಂಪು', kannadaSound: 'kempu', hindi: 'लाल', hindiSound: 'laal', gujarati: 'લાલ', gujaratiSound: 'laal', color: '#EF4444' },
        { english: 'Blue', kannada: 'ನೀಲಿ', kannadaSound: 'neeli', hindi: 'नीला', hindiSound: 'neela', gujarati: 'વાદળી', gujaratiSound: 'vaadaLi', color: '#3B82F6' },
        { english: 'Yellow', kannada: 'ಹಳದಿ', kannadaSound: 'haladi', hindi: 'पीला', hindiSound: 'peela', gujarati: 'પીળો', gujaratiSound: 'piiLo', color: '#EAB308' },
        { english: 'Green', kannada: 'ಹಸಿರು', kannadaSound: 'hasiru', hindi: 'हरा', hindiSound: 'hara', gujarati: 'લીલો', gujaratiSound: 'liilo', color: '#22C55E' },
        { english: 'Orange', kannada: 'ಕಿತ್ತಳೆ', kannadaSound: 'kittale', hindi: 'नारंगी', hindiSound: 'naarangi', gujarati: 'નારંગી', gujaratiSound: 'naarangi', color: '#F97316' },
        { english: 'Purple', kannada: 'ನೇರಳೆ', kannadaSound: 'nerale', hindi: 'बैंगनी', hindiSound: 'baingani', gujarati: 'જાંબલી', gujaratiSound: 'jaambli', color: '#A855F7' },
        { english: 'White', kannada: 'ಬಿಳಿ', kannadaSound: 'bili', hindi: 'सफ़ेद', hindiSound: 'safed', gujarati: 'સફેદ', gujaratiSound: 'safed', color: '#FFFFFF' },
        { english: 'Black', kannada: 'ಕಪ್ಪು', kannadaSound: 'kappu', hindi: 'काला', hindiSound: 'kaala', gujarati: 'કાળો', gujaratiSound: 'kaaLo', color: '#000000' },
        { english: 'Brown', kannada: 'ಕಂದು', kannadaSound: 'kandu', hindi: 'भूरा', hindiSound: 'bhoora', gujarati: 'ભૂરો', gujaratiSound: 'bhuuro', color: '#92400E' },
        { english: 'Pink', kannada: 'ಗುಲಾಬಿ', kannadaSound: 'gulaabi', hindi: 'गुलाबी', hindiSound: 'gulaabi', gujarati: 'ગુલાબી', gujaratiSound: 'gulaabi', color: '#EC4899' },
      ]
    },
    numbers: {
      title: 'Numbers',
      emoji: '🔢',
      color: 'from-blue-400 to-cyan-400',
      items: [
        { english: 'One', kannada: 'ಒಂದು', kannadaSound: 'ondu', hindi: 'एक', hindiSound: 'ek', gujarati: 'એક', gujaratiSound: 'ek', number: '1' },
        { english: 'Two', kannada: 'ಎರಡು', kannadaSound: 'eradu', hindi: 'दो', hindiSound: 'do', gujarati: 'બે', gujaratiSound: 'be', number: '2' },
        { english: 'Three', kannada: 'ಮೂರು', kannadaSound: 'mooru', hindi: 'तीन', hindiSound: 'teen', gujarati: 'ત્રણ', gujaratiSound: 'traN', number: '3' },
        { english: 'Four', kannada: 'ನಾಲ್ಕು', kannadaSound: 'naalku', hindi: 'चार', hindiSound: 'chaar', gujarati: 'ચાર', gujaratiSound: 'chaar', number: '4' },
        { english: 'Five', kannada: 'ಐದು', kannadaSound: 'aidu', hindi: 'पाँच', hindiSound: 'paanch', gujarati: 'પાંચ', gujaratiSound: 'paanch', number: '5' },
        { english: 'Six', kannada: 'ಆರು', kannadaSound: 'aaru', hindi: 'छः', hindiSound: 'chhah', gujarati: 'છ', gujaratiSound: 'chha', number: '6' },
        { english: 'Seven', kannada: 'ಏಳು', kannadaSound: 'elu', hindi: 'सात', hindiSound: 'saat', gujarati: 'સાત', gujaratiSound: 'saat', number: '7' },
        { english: 'Eight', kannada: 'ಎಂಟು', kannadaSound: 'entu', hindi: 'आठ', hindiSound: 'aath', gujarati: 'આઠ', gujaratiSound: 'aaTh', number: '8' },
        { english: 'Nine', kannada: 'ಒಂಬತ್ತು', kannadaSound: 'ombattu', hindi: 'नौ', hindiSound: 'nau', gujarati: 'નવ', gujaratiSound: 'nav', number: '9' },
        { english: 'Ten', kannada: 'ಹತ್ತು', kannadaSound: 'hattu', hindi: 'दस', hindiSound: 'das', gujarati: 'દસ', gujaratiSound: 'das', number: '10' },
      ]
    },
    family: {
      title: 'Family',
      emoji: '👨‍👩‍👧',
      color: 'from-red-400 to-pink-400',
      items: [
        { english: 'Mother', kannada: 'ಅಮ್ಮ', kannadaSound: 'amma', hindi: 'माँ', hindiSound: 'maa', gujarati: 'મા', gujaratiSound: 'maa', emoji: '👩' },
        { english: 'Father', kannada: 'ಅಪ್ಪ', kannadaSound: 'appa', hindi: 'पिता', hindiSound: 'pita', gujarati: 'પિતા', gujaratiSound: 'pitaa', emoji: '👨' },
        { english: 'Sister', kannada: 'ಅಕ್ಕ/ತಂಗಿ', kannadaSound: 'akka/tangi', hindi: 'बहन', hindiSound: 'bahan', gujarati: 'બહેન', gujaratiSound: 'bahen', emoji: '👧' },
        { english: 'Brother', kannada: 'ಅಣ್ಣ/ತಮ್ಮ', kannadaSound: 'anna/tamma', hindi: 'भाई', hindiSound: 'bhai', gujarati: 'ભાઈ', gujaratiSound: 'bhaai', emoji: '👦' },
        { english: 'Grandmother', kannada: 'ಅಜ್ಜಿ', kannadaSound: 'ajji', hindi: 'दादी', hindiSound: 'daadi', gujarati: 'દાદી', gujaratiSound: 'daadi', emoji: '👵' },
        { english: 'Grandfather', kannada: 'ಅಜ್ಜ', kannadaSound: 'ajja', hindi: 'दादा', hindiSound: 'daada', gujarati: 'દાદા', gujaratiSound: 'daadaa', emoji: '👴' },
        { english: 'Baby', kannada: 'ಮಗು', kannadaSound: 'magu', hindi: 'बच्चा', hindiSound: 'baccha', gujarati: 'બાળક', gujaratiSound: 'baaLak', emoji: '👶' },
        { english: 'Uncle', kannada: 'ಚಿಕ್ಕಪ್ಪ', kannadaSound: 'chikkappa', hindi: 'चाचा', hindiSound: 'chacha', gujarati: 'કાકા', gujaratiSound: 'kaakaa', emoji: '👨‍🦱' },
        { english: 'Aunt', kannada: 'ಚಿಕ್ಕಮ್ಮ', kannadaSound: 'chikkamma', hindi: 'चाची', hindiSound: 'chachi', gujarati: 'કાકી', gujaratiSound: 'kaaki', emoji: '👩‍🦱' },
      ]
    },
    body: {
      title: 'Body Parts',
      emoji: '👋',
      color: 'from-green-400 to-teal-400',
      items: [
        { english: 'Head', kannada: 'ತಲೆ', kannadaSound: 'tale', hindi: 'सिर', hindiSound: 'sir', gujarati: 'માથું', gujaratiSound: 'maathun', emoji: '🧑' },
        { english: 'Eyes', kannada: 'ಕಣ್ಣು', kannadaSound: 'kannu', hindi: 'आँखें', hindiSound: 'aankhen', gujarati: 'આંખો', gujaratiSound: 'aankho', emoji: '👁️' },
        { english: 'Nose', kannada: 'ಮೂಗು', kannadaSound: 'moogu', hindi: 'नाक', hindiSound: 'naak', gujarati: 'નાક', gujaratiSound: 'naak', emoji: '👃' },
        { english: 'Mouth', kannada: 'ಬಾಯಿ', kannadaSound: 'baayi', hindi: 'मुँह', hindiSound: 'munh', gujarati: 'મોં', gujaratiSound: 'mon', emoji: '👄' },
        { english: 'Hand', kannada: 'ಕೈ', kannadaSound: 'kai', hindi: 'हाथ', hindiSound: 'haath', gujarati: 'હાથ', gujaratiSound: 'haath', emoji: '✋' },
        { english: 'Foot', kannada: 'ಕಾಲು', kannadaSound: 'kaalu', hindi: 'पैर', hindiSound: 'pair', gujarati: 'પગ', gujaratiSound: 'pag', emoji: '🦶' },
        { english: 'Ear', kannada: 'ಕಿವಿ', kannadaSound: 'kivi', hindi: 'कान', hindiSound: 'kaan', gujarati: 'કાન', gujaratiSound: 'kaan', emoji: '👂' },
        { english: 'Hair', kannada: 'ಕೂದಲು', kannadaSound: 'koodalu', hindi: 'बाल', hindiSound: 'baal', gujarati: 'વાળ', gujaratiSound: 'vaaL', emoji: '💇' },
        { english: 'Teeth', kannada: 'ಹಲ್ಲು', kannadaSound: 'hallu', hindi: 'दाँत', hindiSound: 'daant', gujarati: 'દાંત', gujaratiSound: 'daant', emoji: '🦷' },
        { english: 'Stomach', kannada: 'ಹೊಟ್ಟೆ', kannadaSound: 'hoTTe', hindi: 'पेट', hindiSound: 'pet', gujarati: 'પેટ', gujaratiSound: 'peT', emoji: '🤰' },
      ]
    },
    food: {
      title: 'Food',
      emoji: '🍎',
      color: 'from-orange-400 to-red-400',
      items: [
        { english: 'Rice', kannada: 'ಅನ್ನ', kannadaSound: 'anna', hindi: 'चावल', hindiSound: 'chaawal', gujarati: 'ભાત', gujaratiSound: 'bhaat', emoji: '🍚' },
        { english: 'Water', kannada: 'ನೀರು', kannadaSound: 'neeru', hindi: 'पानी', hindiSound: 'paani', gujarati: 'પાણી', gujaratiSound: 'paaNi', emoji: '💧' },
        { english: 'Milk', kannada: 'ಹಾಲು', kannadaSound: 'haalu', hindi: 'दूध', hindiSound: 'doodh', gujarati: 'દૂધ', gujaratiSound: 'doodh', emoji: '🥛' },
        { english: 'Banana', kannada: 'ಬಾಳೆಹಣ್ಣು', kannadaSound: 'baalehaNNu', hindi: 'केला', hindiSound: 'kela', gujarati: 'કેળું', gujaratiSound: 'keLun', emoji: '🍌' },
        { english: 'Apple', kannada: 'ಸೇಬು', kannadaSound: 'sebu', hindi: 'सेब', hindiSound: 'seb', gujarati: 'સફરજન', gujaratiSound: 'safarjan', emoji: '🍎' },
        { english: 'Bread', kannada: 'ರೊಟ್ಟಿ', kannadaSound: 'roTTi', hindi: 'रोटी', hindiSound: 'roti', gujarati: 'રોટલી', gujaratiSound: 'roTli', emoji: '🍞' },
        { english: 'Mango', kannada: 'ಮಾವಿನಹಣ್ಣು', kannadaSound: 'maavinahaNNu', hindi: 'आम', hindiSound: 'aam', gujarati: 'કેરી', gujaratiSound: 'keri', emoji: '🥭' },
        { english: 'Chocolate', kannada: 'ಚಾಕೊಲೇಟ್', kannadaSound: 'chaakoleyT', hindi: 'चॉकलेट', hindiSound: 'chocolate', gujarati: 'ચોકલેટ', gujaratiSound: 'chokleT', emoji: '🍫' },
        { english: 'Ice Cream', kannada: 'ಐಸ್ ಕ್ರೀಮ್', kannadaSound: 'ice cream', hindi: 'आइसक्रीम', hindiSound: 'ice cream', gujarati: 'આઈસક્રીમ', gujaratiSound: 'ice cream', emoji: '🍦' },
        { english: 'Egg', kannada: 'ಮೊಟ್ಟೆ', kannadaSound: 'moTTe', hindi: 'अंडा', hindiSound: 'anda', gujarati: 'ઈંડું', gujaratiSound: 'indun', emoji: '🥚' },
      ]
    },
    phrases: {
      title: 'Common Phrases',
      emoji: '💬',
      color: 'from-purple-400 to-indigo-400',
      items: [
        { english: 'Hello', kannada: 'ನಮಸ್ಕಾರ', kannadaSound: 'namaskara', hindi: 'नमस्ते', hindiSound: 'namaste', gujarati: 'નમસ્તે', gujaratiSound: 'namaste', emoji: '👋' },
        { english: 'Thank You', kannada: 'ಧನ್ಯವಾದ', kannadaSound: 'dhanyavaada', hindi: 'धन्यवाद', hindiSound: 'dhanyavaad', gujarati: 'આભાર', gujaratiSound: 'aabhaar', emoji: '🙏' },
        { english: 'I Love You', kannada: 'ನಾನು ನಿನ್ನನ್ನು ಪ್ರೀತಿಸುತ್ತೇನೆ', kannadaSound: 'naanu ninnanu preetisuttene', hindi: 'मैं तुमसे प्यार करता हूँ', hindiSound: 'main tumse pyaar karta hun', gujarati: 'હું તને પ્રેમ કરું છું', gujaratiSound: 'hun tane prem karun chhun', emoji: '❤️' },
        { english: 'Good Morning', kannada: 'ಶುಭೋದಯ', kannadaSound: 'shubhodaya', hindi: 'सुप्रभात', hindiSound: 'suprabhat', gujarati: 'સુપ્રભાત', gujaratiSound: 'suprabhaat', emoji: '🌅' },
        { english: 'Good Night', kannada: 'ಶುಭ ರಾತ್ರಿ', kannadaSound: 'shubha raatri', hindi: 'शुभ रात्रि', hindiSound: 'shubh raatri', gujarati: 'શુભ રાત્રી', gujaratiSound: 'shubh raatri', emoji: '🌙' },
        { english: 'Yes', kannada: 'ಹೌದು', kannadaSound: 'haudu', hindi: 'हाँ', hindiSound: 'haan', gujarati: 'હા', gujaratiSound: 'haa', emoji: '✅' },
        { english: 'No', kannada: 'ಇಲ್ಲ', kannadaSound: 'illa', hindi: 'नहीं', hindiSound: 'nahin', gujarati: 'ના', gujaratiSound: 'naa', emoji: '❌' },
      ]
    },
    vehicles: {
      title: 'Vehicles',
      emoji: '🚗',
      color: 'from-cyan-400 to-blue-400',
      items: [
        { english: 'Car', kannada: 'ಕಾರು', kannadaSound: 'kaaru', hindi: 'कार', hindiSound: 'kaar', gujarati: 'કાર', gujaratiSound: 'kaar', emoji: '🚗' },
        { english: 'Bus', kannada: 'ಬಸ್', kannadaSound: 'bas', hindi: 'बस', hindiSound: 'bas', gujarati: 'બસ', gujaratiSound: 'bas', emoji: '🚌' },
        { english: 'Train', kannada: 'ರೈಲು', kannadaSound: 'railu', hindi: 'रेलगाड़ी', hindiSound: 'relgaadi', gujarati: 'ટ્રેન', gujaratiSound: 'Tren', emoji: '🚂' },
        { english: 'Bicycle', kannada: 'ಸೈಕಲ್', kannadaSound: 'cycle', hindi: 'साइकिल', hindiSound: 'cycle', gujarati: 'સાઈકલ', gujaratiSound: 'cycle', emoji: '🚲' },
        { english: 'Airplane', kannada: 'ವಿಮಾನ', kannadaSound: 'vimaana', hindi: 'हवाई जहाज़', hindiSound: 'hawai jahaaz', gujarati: 'વિમાન', gujaratiSound: 'vimaan', emoji: '✈️' },
        { english: 'Boat', kannada: 'ದೋಣಿ', kannadaSound: 'doni', hindi: 'नाव', hindiSound: 'naav', gujarati: 'હોડી', gujaratiSound: 'hoDi', emoji: '⛵' },
        { english: 'Rickshaw', kannada: 'ಆಟೋ', kannadaSound: 'auto', hindi: 'रिक्शा', hindiSound: 'rickshaw', gujarati: 'રિક્ષા', gujaratiSound: 'rikshaa', emoji: '🛺' },
      ]
    },
  };

  const interestTags = [
    {
      id: 'animals_nature', emoji: '🦁', label: 'Animals & Nature',
      color: 'from-yellow-400 to-orange-400',
      words: [
        ['animals','Dog'],['animals','Cat'],['animals','Elephant'],['animals','Cow'],
        ['animals','Monkey'],['animals','Bird'],['animals','Fish'],['animals','Lion'],
        ['animals','Tiger'],['animals','Rabbit'],['colors','Green'],['food','Water'],
      ]
    },
    {
      id: 'yummy_food', emoji: '🍕', label: 'Yummy Food',
      color: 'from-orange-400 to-red-400',
      words: [
        ['food','Rice'],['food','Milk'],['food','Banana'],['food','Apple'],
        ['food','Bread'],['food','Mango'],['food','Chocolate'],['food','Ice Cream'],
        ['food','Egg'],['food','Water'],['colors','Red'],['colors','Orange'],['colors','Yellow'],
      ]
    },
    {
      id: 'things_that_go', emoji: '🚀', label: 'Things That Go',
      color: 'from-cyan-400 to-blue-400',
      words: [
        ['vehicles','Car'],['vehicles','Bus'],['vehicles','Train'],['vehicles','Bicycle'],
        ['vehicles','Airplane'],['vehicles','Boat'],['vehicles','Rickshaw'],
        ['colors','Red'],['colors','Blue'],['numbers','One'],['numbers','Two'],['numbers','Three'],
      ]
    },
    {
      id: 'my_family', emoji: '👨‍👩‍👧', label: 'My Family',
      color: 'from-red-400 to-pink-400',
      words: [
        ['family','Mother'],['family','Father'],['family','Sister'],['family','Brother'],
        ['family','Grandmother'],['family','Grandfather'],['family','Baby'],
        ['family','Uncle'],['family','Aunt'],['phrases','I Love You'],['phrases','Hello'],['phrases','Thank You'],
      ]
    },
    {
      id: 'numbers_colors', emoji: '🔢', label: 'Numbers & Colors',
      color: 'from-blue-400 to-purple-400',
      words: [
        ['numbers','One'],['numbers','Two'],['numbers','Three'],['numbers','Four'],
        ['numbers','Five'],['numbers','Six'],['numbers','Seven'],['numbers','Eight'],
        ['numbers','Nine'],['numbers','Ten'],['colors','Red'],['colors','Blue'],
        ['colors','Yellow'],['colors','Green'],['colors','Orange'],['colors','Purple'],['colors','Pink'],
      ]
    },
    {
      id: 'magic_words', emoji: '🌟', label: 'Magic Words',
      color: 'from-purple-400 to-indigo-400',
      words: [
        ['phrases','Hello'],['phrases','Thank You'],['phrases','I Love You'],
        ['phrases','Good Morning'],['phrases','Good Night'],['phrases','Yes'],['phrases','No'],
        ['family','Mother'],['family','Father'],['food','Water'],['food','Milk'],
      ]
    },
    {
      id: 'my_body', emoji: '🧑', label: 'My Body',
      color: 'from-green-400 to-teal-400',
      words: [
        ['body','Head'],['body','Eyes'],['body','Nose'],['body','Mouth'],['body','Hand'],
        ['body','Foot'],['body','Ear'],['body','Hair'],['body','Teeth'],['body','Stomach'],
        ['colors','Brown'],['colors','Pink'],['colors','White'],
      ]
    },
  ];

  const resolveInterestWords = (tag) => {
    return tag.words.map(([catKey, englishName]) => {
      const items = categories[catKey].items;
      const idx = items.findIndex(i => i.english === englishName);
      return idx >= 0 ? { ...items[idx], _categoryKey: catKey, _itemIndex: idx } : null;
    }).filter(Boolean);
  };

  const saveInterests = (interests) => {
    localStorage.setItem('indianLanguagesInterests', JSON.stringify(interests));
  };

  // Audio cache to avoid repeated API calls for the same word
  const audioCache = React.useRef({});

  const speakWithBrowserTTS = (text, lang) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      const langMap = { kannada: 'kn-IN', hindi: 'hi-IN', gujarati: 'gu-IN' };
      utterance.lang = langMap[lang] || 'hi-IN';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const speak = async (text, lang) => {
    const langMap = { kannada: 'kn-IN', hindi: 'hi-IN', gujarati: 'gu-IN' };
    const langCode = langMap[lang];
    if (!langCode) return;

    const cacheKey = `${langCode}:${text}`;

    // Check cache first
    if (audioCache.current[cacheKey]) {
      const audio = new Audio(audioCache.current[cacheKey]);
      audio.play().catch(() => speakWithBrowserTTS(text, lang));
      return;
    }

    try {
      const res = await fetch('/.netlify/functions/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language_code: langCode }),
      });

      if (!res.ok) throw new Error('API error');

      const data = await res.json();
      const audioUrl = `data:audio/mp3;base64,${data.audio}`;

      // Cache the audio data URL
      audioCache.current[cacheKey] = audioUrl;

      const audio = new Audio(audioUrl);
      audio.play().catch(() => speakWithBrowserTTS(text, lang));
    } catch (err) {
      // Fallback to browser TTS
      speakWithBrowserTTS(text, lang);
    }
  };

  const markWordAsLearned = (categoryKey, wordIndex) => {
    const key = `${categoryKey}-${wordIndex}`;
    const newProgress = { ...progress, [key]: true };
    const newStars = totalStars + (progress[key] ? 0 : 1);
    setProgress(newProgress);
    setTotalStars(newStars);
    saveProgress(newProgress, newStars);
  };

  const getCategoryProgress = (categoryKey) => {
    const category = categories[categoryKey];
    const learned = category.items.filter((_, idx) => 
      progress[`${categoryKey}-${idx}`]
    ).length;
    return { learned, total: category.items.length };
  };

  // Interest Picker Component
  const InterestPicker = ({ currentInterests, onSave }) => {
    const [picks, setPicks] = useState(currentInterests || []);

    const toggleInterest = (tagId) => {
      setPicks(prev =>
        prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
      );
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-pink-200 to-purple-200 p-6 flex flex-col items-center justify-center">
        <div className="max-w-2xl w-full text-center">
          <div className="text-8xl mb-4">🌟</div>
          <h1 className="text-5xl font-bold text-purple-600 mb-2">What do you like?</h1>
          <p className="text-xl text-purple-400 mb-8">Pick your favorites!</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {interestTags.map(tag => {
              const isSelected = picks.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  onClick={() => toggleInterest(tag.id)}
                  className={`p-6 rounded-3xl shadow-xl transition-all transform hover:scale-105 ${
                    isSelected
                      ? 'bg-gradient-to-br ' + tag.color + ' text-white ring-4 ring-yellow-300 scale-105'
                      : 'bg-white text-gray-700'
                  }`}
                >
                  <div className="text-6xl mb-2">{tag.emoji}</div>
                  <div className="text-lg font-bold">{tag.label}</div>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => { if (picks.length > 0) onSave(picks); }}
            disabled={picks.length === 0}
            className="bg-purple-500 text-white text-2xl font-bold px-12 py-4 rounded-full shadow-xl hover:bg-purple-600 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Let's Go! {picks.length > 0 && `(${picks.length} picked)`}
          </button>
        </div>
      </div>
    );
  };

  // Flashcard Component
  const FlashCard = ({ item, categoryKey, itemIndex }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const isLearned = progress[`${categoryKey}-${itemIndex}`];

    const handleFlip = () => {
      setIsFlipped(!isFlipped);
      if (!isFlipped && !isLearned) {
        markWordAsLearned(categoryKey, itemIndex);
      }
    };

    const handleSpeak = (e, text, lang) => {
      e.stopPropagation();
      speak(text, lang);
    };

    return (
      <div onClick={handleFlip} className="w-full h-80 cursor-pointer perspective-1000">
        <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          {/* Front */}
          <div className={`absolute w-full h-full backface-hidden bg-gradient-to-br ${categories[categoryKey].color} rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8`}>
            {isLearned && (
              <div className="absolute top-4 right-4">
                <Star className="w-10 h-10 text-yellow-300 fill-yellow-300" />
              </div>
            )}
            <div className="text-9xl mb-6">
              {item.emoji || <span style={{display:'inline-block', width:100, height:100, borderRadius:'50%', backgroundColor: item.color, border: '3px solid white'}}></span>}
              {item.number && <div className="text-white font-bold">{item.number}</div>}
            </div>
            <div className="text-4xl font-bold text-white mb-3">{item.english}</div>
            <div className="text-white text-xl opacity-90 bg-white/20 px-6 py-2 rounded-full">
              Tap to learn!
            </div>
          </div>
          
          {/* Back */}
          <div className={`absolute w-full h-full backface-hidden bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-2xl flex flex-col items-center justify-center ${selectedLanguage === 'all' ? 'p-4' : 'p-8'} rotate-y-180`}>
            {(selectedLanguage === 'all' || selectedLanguage === 'kannada') && (
              <div className="mb-3 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className={`${selectedLanguage === 'all' ? 'text-4xl' : 'text-6xl'} font-bold text-white`}>{item.kannada}</div>
                  <button
                    onClick={(e) => handleSpeak(e, item.kannadaSound, 'kannada')}
                    className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
                  >
                    <Volume2 className="w-6 h-6 text-white" />
                  </button>
                </div>
                <div className={`${selectedLanguage === 'all' ? 'text-xl' : 'text-3xl'} text-blue-100 mb-1`}>({item.kannadaSound})</div>
                <div className="text-sm text-blue-200 font-semibold">Kannada</div>
              </div>
            )}
            {(selectedLanguage === 'all' || selectedLanguage === 'hindi') && (
              <div className="mb-3 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className={`${selectedLanguage === 'all' ? 'text-4xl' : 'text-6xl'} font-bold text-white`}>{item.hindi}</div>
                  <button
                    onClick={(e) => handleSpeak(e, item.hindiSound, 'hindi')}
                    className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
                  >
                    <Volume2 className="w-6 h-6 text-white" />
                  </button>
                </div>
                <div className={`${selectedLanguage === 'all' ? 'text-xl' : 'text-3xl'} text-green-100 mb-1`}>({item.hindiSound})</div>
                <div className="text-sm text-green-200 font-semibold">Hindi</div>
              </div>
            )}
            {(selectedLanguage === 'all' || selectedLanguage === 'gujarati') && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className={`${selectedLanguage === 'all' ? 'text-4xl' : 'text-6xl'} font-bold text-white`}>{item.gujarati}</div>
                  <button
                    onClick={(e) => handleSpeak(e, item.gujaratiSound, 'gujarati')}
                    className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
                  >
                    <Volume2 className="w-6 h-6 text-white" />
                  </button>
                </div>
                <div className={`${selectedLanguage === 'all' ? 'text-xl' : 'text-3xl'} text-orange-100 mb-1`}>({item.gujaratiSound})</div>
                <div className="text-sm text-orange-200 font-semibold">Gujarati</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Matching Game Component
  const MatchingGame = ({ categoryKey }) => {
    const category = categories[categoryKey];
    const [gameItems, setGameItems] = useState([]);
    const [selectedCards, setSelectedCards] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState([]);
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);

    useEffect(() => {
      initializeGame();
    }, []);

    const getWordForLanguage = (item) => {
      if (selectedLanguage === 'hindi') return { word: item.hindi, sound: item.hindiSound };
      if (selectedLanguage === 'gujarati') return { word: item.gujarati, sound: item.gujaratiSound };
      if (selectedLanguage === 'kannada') return { word: item.kannada, sound: item.kannadaSound };
      const langs = ['kannada', 'hindi', 'gujarati'];
      const pick = langs[Math.floor(Math.random() * langs.length)];
      return { word: item[pick], sound: item[pick + 'Sound'] };
    };

    const initializeGame = () => {
      // Take first 5 items and create pairs
      const items = category.items.slice(0, 5);
      const pairs = [];

      items.forEach((item, idx) => {
        const { word, sound } = getWordForLanguage(item);
        pairs.push({ id: `emoji-${idx}`, type: 'emoji', emoji: item.emoji, matchId: idx });
        pairs.push({
          id: `word-${idx}`,
          type: 'word',
          word,
          sound,
          matchId: idx 
        });
      });
      
      setGameItems(pairs.sort(() => Math.random() - 0.5));
      setSelectedCards([]);
      setMatchedPairs([]);
      setScore(0);
      setAttempts(0);
    };

    const handleCardClick = (card) => {
      if (selectedCards.length === 2 || matchedPairs.includes(card.matchId) || 
          selectedCards.find(c => c.id === card.id)) {
        return;
      }

      const newSelected = [...selectedCards, card];
      setSelectedCards(newSelected);

      if (newSelected.length === 2) {
        setAttempts(attempts + 1);
        
        if (newSelected[0].matchId === newSelected[1].matchId) {
          // Match!
          setMatchedPairs([...matchedPairs, card.matchId]);
          setScore(score + 10);
          setTimeout(() => setSelectedCards([]), 500);
          
          if (matchedPairs.length + 1 === 5) {
            setTimeout(() => {
              alert(`🎉 Great job! You matched all pairs in ${attempts + 1} attempts!`);
            }, 600);
          }
        } else {
          // No match
          setTimeout(() => setSelectedCards([]), 1000);
        }
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-orange-200 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCurrentView('home')}
              className="bg-white px-6 py-3 rounded-full shadow-lg font-bold text-purple-600 hover:bg-purple-50"
            >
              ← Back
            </button>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">Matching Game</div>
              <div className="text-lg text-purple-500">{category.title}</div>
            </div>
            <button
              onClick={initializeGame}
              className="bg-white px-6 py-3 rounded-full shadow-lg font-bold text-purple-600 hover:bg-purple-50 flex items-center gap-2"
            >
              <RotateCcw size={20} /> Reset
            </button>
          </div>

          <div className="bg-white/50 rounded-2xl p-4 mb-6 flex justify-around text-center">
            <div>
              <div className="text-3xl font-bold text-purple-600">{score}</div>
              <div className="text-sm text-purple-500">Score</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">{attempts}</div>
              <div className="text-sm text-purple-500">Attempts</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">{matchedPairs.length}/5</div>
              <div className="text-sm text-purple-500">Matched</div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {gameItems.map((card) => {
              const isSelected = selectedCards.find(c => c.id === card.id);
              const isMatched = matchedPairs.includes(card.matchId);
              
              return (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card)}
                  disabled={isMatched}
                  className={`aspect-square rounded-2xl shadow-lg text-2xl font-bold transition-all transform hover:scale-105
                    ${isMatched ? 'bg-green-400 text-white opacity-50' : 
                      isSelected ? 'bg-blue-400 text-white scale-105' : 
                      'bg-white text-gray-800 hover:bg-gray-50'}`}
                >
                  {card.type === 'emoji' ? (
                    <div className="text-6xl">{card.emoji}</div>
                  ) : (
                    <div className="text-2xl px-2">{card.word}</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Category Practice View
  const CategoryView = ({ categoryKey }) => {
    const category = categories[categoryKey];
    const categoryProgress = getCategoryProgress(categoryKey);

    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCurrentView('home')}
              className="bg-white px-6 py-3 rounded-full shadow-lg font-bold text-purple-600 hover:bg-purple-50"
            >
              ← Back
            </button>
            <div className="text-3xl font-bold text-purple-600 flex items-center gap-2">
              {category.emoji} {category.title}
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {currentCardIndex + 1}/{category.items.length}
            </div>
          </div>

          <div className="bg-white/50 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-500" />
                <span className="font-semibold">Progress: {categoryProgress.learned}/{categoryProgress.total}</span>
              </div>
              <button
                onClick={() => setCurrentView(`game-${categoryKey}`)}
                className="bg-purple-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-purple-600 flex items-center gap-2"
              >
                <Gamepad2 size={20} /> Play Game
              </button>
            </div>
          </div>

          <div className="mb-6 flex justify-center">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-6 py-3 rounded-full text-lg font-semibold bg-white text-purple-600 shadow-lg border-2 border-purple-300 focus:border-purple-500 focus:outline-none cursor-pointer"
              style={{ minWidth: '220px' }}
            >
              <option value="all">All Languages</option>
              <option value="kannada">ಕನ್ನಡ Kannada</option>
              <option value="hindi">हिन्दी Hindi</option>
              <option value="gujarati">ગુજરાતી Gujarati</option>
            </select>
          </div>

          <FlashCard 
            item={category.items[currentCardIndex]} 
            categoryKey={categoryKey}
            itemIndex={currentCardIndex}
          />

          <div className="flex gap-4 mt-6 justify-center">
            <button
              onClick={() => setCurrentCardIndex(Math.max(0, currentCardIndex - 1))}
              disabled={currentCardIndex === 0}
              className="bg-white px-8 py-4 rounded-full shadow-lg font-bold text-2xl text-purple-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-purple-50"
            >
              ← Previous
            </button>
            <button
              onClick={() => setCurrentCardIndex(Math.min(category.items.length - 1, currentCardIndex + 1))}
              disabled={currentCardIndex === category.items.length - 1}
              className="bg-white px-8 py-4 rounded-full shadow-lg font-bold text-2xl text-purple-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-purple-50"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Progress Dashboard
  const ProgressDashboard = () => {
    const totalWords = Object.values(categories).reduce((sum, cat) => sum + cat.items.length, 0);
    const learnedWords = Object.keys(progress).length;
    const percentComplete = Math.round((learnedWords / totalWords) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setCurrentView('home')}
              className="bg-white px-6 py-3 rounded-full shadow-lg font-bold text-purple-600 hover:bg-purple-50"
            >
              ← Back
            </button>
            <div className="text-4xl font-bold text-purple-600 flex items-center gap-2">
              <Trophy className="text-yellow-500" /> Progress Dashboard
            </div>
            <div></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-3xl shadow-xl p-6 text-center">
              <Star className="w-16 h-16 text-yellow-500 mx-auto mb-2 fill-yellow-500" />
              <div className="text-5xl font-bold text-purple-600 mb-2">{totalStars}</div>
              <div className="text-lg text-gray-600">Total Stars</div>
            </div>
            
            <div className="bg-white rounded-3xl shadow-xl p-6 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-2" />
              <div className="text-5xl font-bold text-purple-600 mb-2">{learnedWords}/{totalWords}</div>
              <div className="text-lg text-gray-600">Words Learned</div>
            </div>
            
            <div className="bg-white rounded-3xl shadow-xl p-6 text-center">
              <Award className="w-16 h-16 text-purple-500 mx-auto mb-2" />
              <div className="text-5xl font-bold text-purple-600 mb-2">{percentComplete}%</div>
              <div className="text-lg text-gray-600">Complete</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-purple-600 mb-6">Category Progress</h2>
            <div className="space-y-4">
              {Object.entries(categories).map(([key, category]) => {
                const prog = getCategoryProgress(key);
                const percent = Math.round((prog.learned / prog.total) * 100);
                
                return (
                  <div key={key} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl">{category.emoji}</span>
                        <span className="text-xl font-semibold text-gray-800">{category.title}</span>
                      </div>
                      <div className="text-lg font-bold text-purple-600">
                        {prog.learned}/{prog.total}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Home Page
  const HomePage = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold text-purple-600 mb-4">
              🌟 Learn Indian Languages! 🌟
            </h1>
            <p className="text-2xl text-purple-500 mb-4">
              Kannada • Hindi • Gujarati
            </p>
            <p className="text-xl text-purple-400">
              Choose a category to start learning!
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="bg-white rounded-full px-6 py-3 shadow-lg flex items-center gap-2">
                <Star className="text-yellow-500 fill-yellow-500" />
                <span className="font-bold text-purple-600">{totalStars} Stars</span>
              </div>
              <button
                onClick={() => setCurrentView('progress')}
                className="bg-purple-500 text-white rounded-full px-6 py-3 shadow-lg font-bold hover:bg-purple-600 flex items-center gap-2"
              >
                <Trophy size={20} /> View Progress
              </button>
            </div>
          </div>

          {selectedInterests.length > 0 && (() => {
            const items = [];
            const seen = new Set();
            selectedInterests.forEach(tagId => {
              const tag = interestTags.find(t => t.id === tagId);
              if (tag) {
                resolveInterestWords(tag).forEach(item => {
                  if (!seen.has(item.english)) {
                    seen.add(item.english);
                    items.push(item);
                  }
                });
              }
            });
            // Stable shuffle based on day so it doesn't change on every render
            const day = new Date().toDateString();
            items.sort((a, b) => {
              const ha = (a.english + day).split('').reduce((s, c) => s + c.charCodeAt(0), 0);
              const hb = (b.english + day).split('').reduce((s, c) => s + c.charCodeAt(0), 0);
              return ha - hb;
            });
            const forYouItems = items.slice(0, 20);
            return (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-3xl font-bold text-purple-600">✨ For You</h2>
                  <button
                    onClick={() => setShowInterestPicker(true)}
                    className="bg-white px-4 py-2 rounded-full shadow-lg text-sm font-semibold text-purple-500 hover:bg-purple-50"
                  >
                    Change Interests
                  </button>
                </div>
                <div
                  className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
                  style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
                >
                  {forYouItems.map((item) => (
                    <button
                      key={item.english}
                      onClick={() => {
                        setCurrentCategory(item._categoryKey);
                        setCurrentCardIndex(item._itemIndex);
                        setCurrentView(item._categoryKey);
                      }}
                      className="snap-center flex-shrink-0 w-40 bg-white rounded-3xl shadow-xl p-4 hover:scale-105 transform transition-all"
                    >
                      <div className="text-5xl mb-2">{item.emoji || ''}</div>
                      <div className="text-lg font-bold text-purple-600">{item.english}</div>
                      <div className="text-xs text-purple-400 mt-1">Tap to learn!</div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {Object.entries(categories).map(([key, category]) => {
              const prog = getCategoryProgress(key);
              const isComplete = prog.learned === prog.total;
              
              return (
                <button
                  key={key}
                  onClick={() => {
                    setCurrentCategory(key);
                    setCurrentCardIndex(0);
                    setCurrentView(key);
                  }}
                  className="bg-white rounded-3xl shadow-xl p-6 hover:scale-105 transform transition-all duration-200 hover:shadow-2xl relative"
                >
                  {isComplete && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="w-8 h-8 text-green-500 fill-green-500" />
                    </div>
                  )}
                  <div className="text-7xl mb-4">{category.emoji}</div>
                  <div className="text-xl font-bold text-purple-600 mb-2">{category.title}</div>
                  <div className="text-sm text-purple-400">
                    {prog.learned}/{prog.total} learned
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className={`bg-gradient-to-r ${category.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${(prog.learned / prog.total) * 100}%` }}
                    ></div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-purple-600 mb-4 flex items-center gap-2">
              <Book size={32} /> Tips for Parents
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-2xl">✨</span>
                  <span className="text-lg text-gray-700">Practice 10-15 minutes daily</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-2xl">🗣️</span>
                  <span className="text-lg text-gray-700">Say the words out loud together</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-2xl">🎵</span>
                  <span className="text-lg text-gray-700">Make it fun with songs & games</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-2xl">🔄</span>
                  <span className="text-lg text-gray-700">Review previous categories regularly</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-2xl">💬</span>
                  <span className="text-lg text-gray-700">Use words in daily conversations</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-2xl">🌈</span>
                  <span className="text-lg text-gray-700">Point out objects around the house</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main Router
  return (
    <div className="font-sans">
      {showInterestPicker ? (
        <InterestPicker
          currentInterests={selectedInterests}
          onSave={(picks) => {
            setSelectedInterests(picks);
            saveInterests(picks);
            setShowInterestPicker(false);
          }}
        />
      ) : (
        <>
          {currentView === 'home' && <HomePage />}
          {currentView === 'progress' && <ProgressDashboard />}
          {currentView.startsWith('game-') && <MatchingGame categoryKey={currentView.replace('game-', '')} />}
          {currentView !== 'home' && currentView !== 'progress' && !currentView.startsWith('game-') && (
            <CategoryView categoryKey={currentView} />
          )}
        </>
      )}
      
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<LanguageLearningApp />);