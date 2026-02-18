# Adding New Languages Guide

This guide shows you how to add Gujarati and other Indian languages to your app.

## 🎯 Quick Overview

The app is designed to be easily extensible. Adding a new language requires:
1. Update the language selection UI
2. Add language data to each category
3. Test and deploy

**Time to add a language:** 30-60 minutes

---

## 📝 Step-by-Step: Adding Gujarati

### Step 1: Update Language Selection State

In `app.jsx`, find the language selection state (around line 10):

**Current:**
```javascript
const [selectedLanguage, setSelectedLanguage] = useState('both');
```

**Updated:**
```javascript
const [selectedLanguage, setSelectedLanguage] = useState('all'); // or keep 'both' for backward compatibility
```

### Step 2: Add Gujarati Words to Categories

Find the `categories` object in `app.jsx`. For each category, add Gujarati translations:

**Before (2 languages):**
```javascript
{ 
  english: 'Dog', 
  kannada: 'ನಾಯಿ', 
  kannadaSound: 'naayi', 
  hindi: 'कुत्ता', 
  hindiSound: 'kutta', 
  emoji: '🐕' 
}
```

**After (3 languages):**
```javascript
{ 
  english: 'Dog', 
  kannada: 'ನಾಯಿ', 
  kannadaSound: 'naayi', 
  hindi: 'कुत्ता', 
  hindiSound: 'kutta',
  gujarati: 'કૂતરો',
  gujaratiSound: 'kuutro',
  emoji: '🐕' 
}
```

### Step 3: Update FlashCard Component

Find the `FlashCard` component's back side (around line 300). Update it to show Gujarati:

**Add this section after Hindi:**
```javascript
{selectedLanguage !== 'kannada' && selectedLanguage !== 'hindi' && (
  <div className="text-center mt-4">
    <div className="flex items-center justify-center gap-3 mb-2">
      <div className="text-6xl font-bold text-white">{item.gujarati}</div>
      <button
        onClick={(e) => handleSpeak(e, item.gujaratiSound, 'gujarati')}
        className="bg-white/20 p-3 rounded-full hover:bg-white/30 transition-colors"
      >
        <Volume2 className="w-8 h-8 text-white" />
      </button>
    </div>
    <div className="text-3xl text-orange-100 mb-1">({item.gujaratiSound})</div>
    <div className="text-lg text-orange-200 font-semibold">Gujarati</div>
  </div>
)}
```

### Step 4: Add Gujarati Language Toggle Button

Find the language toggle buttons (around line 350):

**Add this button:**
```javascript
<button
  onClick={() => setSelectedLanguage('gujarati')}
  className={`px-4 py-2 rounded-full font-semibold ${
    selectedLanguage === 'gujarati' 
      ? 'bg-orange-500 text-white' 
      : 'bg-white text-orange-600'
  }`}
>
  Gujarati Only
</button>
```

### Step 5: Update Text-to-Speech

In the `speak` function, add Gujarati support:

```javascript
const speak = (text, lang) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    if (lang === 'kannada') {
      utterance.lang = 'kn-IN';
    } else if (lang === 'hindi') {
      utterance.lang = 'hi-IN';
    } else if (lang === 'gujarati') {
      utterance.lang = 'gu-IN';
    }
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  }
};
```

### Step 6: Update Matching Game

If you want Gujarati in the matching game, update the `MatchingGame` component:

```javascript
pairs.push({ 
  id: `word-${idx}`, 
  type: 'word', 
  word: selectedLanguage === 'hindi' 
    ? item.hindi 
    : selectedLanguage === 'gujarati'
    ? item.gujarati
    : item.kannada,
  sound: selectedLanguage === 'hindi' 
    ? item.hindiSound 
    : selectedLanguage === 'gujarati'
    ? item.gujaratiSound
    : item.kannadaSound,
  matchId: idx 
});
```

### Step 7: Update HomePage Subtitle

Update the homepage to show Gujarati is available:

```javascript
<p className="text-2xl text-purple-500 mb-4">
  Kannada • Hindi • Gujarati
</p>
```

---

## 🗂️ Gujarati Vocabulary Reference

Here's starter vocabulary for common categories:

### Animals
```javascript
{ english: 'Dog', gujarati: 'કૂતરો', gujaratiSound: 'kuutro' }
{ english: 'Cat', gujarati: 'બિલાડી', gujaratiSound: 'bilaaDi' }
{ english: 'Elephant', gujarati: 'હાથી', gujaratiSound: 'haathi' }
{ english: 'Cow', gujarati: 'ગાય', gujaratiSound: 'gaay' }
{ english: 'Bird', gujarati: 'પક્ષી', gujaratiSound: 'pakshi' }
```

### Colors
```javascript
{ english: 'Red', gujarati: 'લાલ', gujaratiSound: 'laal' }
{ english: 'Blue', gujarati: 'વાદળી', gujaratiSound: 'vaadaLi' }
{ english: 'Yellow', gujarati: 'પીળો', gujaratiSound: 'piiLo' }
{ english: 'Green', gujarati: 'લીલો', gujaratiSound: 'liilo' }
```

### Numbers
```javascript
{ english: 'One', gujarati: 'એક', gujaratiSound: 'ek' }
{ english: 'Two', gujarati: 'બે', gujaratiSound: 'be' }
{ english: 'Three', gujarati: 'ત્રણ', gujaratiSound: 'traN' }
{ english: 'Four', gujarati: 'ચાર', gujaratiSound: 'chaar' }
{ english: 'Five', gujarati: 'પાંચ', gujaratiSound: 'paanch' }
```

### Family
```javascript
{ english: 'Mother', gujarati: 'માતા', gujaratiSound: 'maataa' }
{ english: 'Father', gujarati: 'પિતા', gujaratiSound: 'pitaa' }
{ english: 'Sister', gujarati: 'બહેન', gujaratiSound: 'bahen' }
{ english: 'Brother', gujarati: 'ભાઈ', gujaratiSound: 'bhaai' }
```

### Common Phrases
```javascript
{ english: 'Hello', gujarati: 'નમસ્તે', gujaratiSound: 'namaste' }
{ english: 'Thank You', gujarati: 'આભાર', gujaratiSound: 'aabhaar' }
{ english: 'Good Morning', gujarati: 'સુપ્રભાત', gujaratiSound: 'suprabhaat' }
```

---

## 🎨 UI Considerations for Multiple Languages

### Option 1: All Languages at Once
Show all three languages on the flashcard back:
```javascript
// Kannada section
// Hindi section  
// Gujarati section
```

**Pros:** See everything at once
**Cons:** Crowded on smaller screens

### Option 2: Language Selector (Current Approach)
Toggle between languages with buttons.

**Pros:** Clean UI, focused learning
**Cons:** More taps to see all

### Option 3: Tabs
Use tab interface to switch languages.

**Pros:** Modern, familiar pattern
**Cons:** More complex to implement

### Recommendation
Start with Option 2 (current approach), add Option 1 as "Show All" mode later.

---

## 🌍 Adding More Languages (Tamil, Telugu, etc.)

The pattern is the same for any language:

1. **Add to word objects:**
   ```javascript
   tamil: 'நாய்',
   tamilSound: 'naai',
   ```

2. **Update FlashCard display**

3. **Add toggle button**

4. **Update text-to-speech:**
   ```javascript
   else if (lang === 'tamil') {
     utterance.lang = 'ta-IN';
   }
   ```

### Supported Languages for Text-to-Speech

| Language | Code | Supported |
|----------|------|-----------|
| Kannada | kn-IN | ✅ |
| Hindi | hi-IN | ✅ |
| Gujarati | gu-IN | ✅ |
| Tamil | ta-IN | ✅ |
| Telugu | te-IN | ✅ |
| Marathi | mr-IN | ✅ |
| Bengali | bn-IN | ✅ |
| Malayalam | ml-IN | ✅ |
| Punjabi | pa-IN | ✅ |

---

## 💡 Advanced: Language Selector Component

For cleaner code when you have 4+ languages, create a reusable component:

```javascript
const LanguageSelector = ({ selectedLanguage, setSelectedLanguage }) => {
  const languages = [
    { code: 'all', name: 'All Languages', color: 'purple' },
    { code: 'kannada', name: 'Kannada', color: 'blue' },
    { code: 'hindi', name: 'Hindi', color: 'green' },
    { code: 'gujarati', name: 'Gujarati', color: 'orange' },
  ];

  return (
    <div className="flex gap-2 justify-center flex-wrap">
      {languages.map(lang => (
        <button
          key={lang.code}
          onClick={() => setSelectedLanguage(lang.code)}
          className={`px-4 py-2 rounded-full font-semibold ${
            selectedLanguage === lang.code
              ? `bg-${lang.color}-500 text-white`
              : `bg-white text-${lang.color}-600`
          }`}
        >
          {lang.name}
        </button>
      ))}
    </div>
  );
};
```

---

## 🧪 Testing Checklist

After adding a language:

- [ ] All category words have new language data
- [ ] FlashCard displays new language correctly
- [ ] Audio pronunciation works (or phonetic guide shows)
- [ ] Toggle buttons work
- [ ] Matching game works with new language
- [ ] Progress tracking still works
- [ ] Test on iPad Safari
- [ ] No console errors

---

## 📦 Commit Template

When adding a new language:

```bash
git add app.jsx
git commit -m "Add Gujarati language support

- Added Gujarati translations to all 8 categories (60+ words)
- Updated FlashCard component to display Gujarati
- Added Gujarati toggle button
- Integrated Gujarati text-to-speech (gu-IN)
- Updated matching game to support Gujarati
- Updated homepage to show Gujarati is available"
git push
```

---

## 🚀 Quick Start: Adding Gujarati This Week

1. **Monday:** Add Gujarati to Animals & Colors (2 categories)
2. **Tuesday:** Add to Numbers & Family (2 categories)
3. **Wednesday:** Add to Body Parts & Food (2 categories)
4. **Thursday:** Add to Phrases & Vehicles (2 categories)
5. **Friday:** Test everything, deploy, celebrate! 🎉

**Pro tip:** Ask Claude Code to help:
```
"Add Gujarati language support to app.jsx. Add translations for all 
words in the animals category using proper Gujarati script and 
phonetic spellings."
```

---

## 🎯 Future: Advanced Multi-Language Features

Ideas for when you have 4+ languages:

- [ ] **Language comparison mode** - See all languages side-by-side
- [ ] **Mixed language quizzes** - Random language selection
- [ ] **Per-user language selection** - Each family member picks their languages
- [ ] **Difficulty levels** - Start with 1-2 languages, unlock more
- [ ] **Language-specific categories** - "Gujarati Festivals", "Kannada Foods"

---

**Ready to add Gujarati? The app structure makes it easy! Just follow the steps above.** 🌟
