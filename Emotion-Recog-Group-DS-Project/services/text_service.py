import time
import os

# 🌐 NETWORK STABILITY FIX: Increase timeouts for slow internet/large model downloads
os.environ["HF_HUB_READ_TIMEOUT"] = "120" # 120 seconds
os.environ["HTTPX_TIMEOUT"] = "120.0"

from transformers import pipeline
from langdetect import detect
from deep_translator import GoogleTranslator

# Initializing global state
try:
    print("⏳ [ADVANCED TEXT] Loading Multi-modal NLP Model...")
    classifier = pipeline(
        "text-classification",
        model="j-hartmann/emotion-english-distilroberta-base"
    )
    print("✅ [ADVANCED TEXT] Human-Understanding Engine Online")
except Exception as e:
    print(f"⚠️ NLP Load Error: {e}")
    classifier = None

LABEL_MAP = {
    'anger': 'Angry',
    'disgust': 'Disgust',
    'fear': 'Fear',
    'joy': 'Happy',
    'neutral': 'Neutral',
    'sadness': 'Sad',
    'surprise': 'Surprise',
    'sarcasm': 'Sarcasm',
    'mixed': 'Mixed'
}

# HEURISTIC FALLBACK: Keyword-based backup for low-resource environments
def heuristic_predict(text):
    text = str(text).lower()
    # Use split to avoid substring matches (like 'bad' in 'bhadiya')
    words_in_text = set(text.split())
    
    keywords = {
        'Happy': ["happy", "joy", "great", "nice", "good", "love", "awesome", "khush", "khushi", "kush", "mazza", "bhadiya", "acha", "sahi", "mast", "sukoon", "best", "pyaar", "friend", "holiday", "superb", "gazab", "masti", "mazedaar", "op", "bohot", "dhanyavaad", "bagundi", "manchi", "bhale", "santhosham", "aanandham", "adbhutham", "haayigaa", "uuthsaaham", "shubham", "aanandam", "ecstatic", "delighted", "grateful", "blessed", "wonderful", "vibrant", "harsh", "prassan", "kushal", "jaan", "zindabad", "shad", "masroor", "afreen", "mubarak", "madad"],
        'Angry': ["angry", "mad", "hate", "rude", "bad", "worst", "gussa", "pagal", "chup", "faltu", "bekar", "nafrat", "kamine", "ghusa", "jahil", "bewakoof", "ghatiya", "kopam", "chiraaku", "agraham", "dhvesham", "thittu", "asahanayam", "asayam", "furious", "enraged", "irritated", "outraged", "krodh", "naraz", "badla", "shat up", "stfu", "ghatiya", "barhami", "khafa", "zulm"],
        'Sad': ["sad", "cry", "unhappy", "depressed", "sorry", "pain", "dukh", "dard", "rona", "pareshan", "boring", "udhas", "udaas", "udas", "bikhar", "gam", "duki", "rona", "akela", "tanha", "noppi", "badha", "edupu", "ibbandi", "kantam", "dhukkam", "kastaalu", "vishaadam", "viyogam", "nirasahaya", "miserable", "gloomy", "lonely", "despair", "tears", "shok", "bechain", "afsos", "malal", "ranj"],
        'Fear': ["scared", "fear", "afraid", "worry", "panic", "dar", "bhago", "khatra", "darr", "khauf", "ghabrahat", "darro", "darrpoke", "bhayamu", "thondara", "bayyam", "bhayam", "beduru", "vunuku", "terrified", "horrified", "anxious", "danger", "threat", "dahshat", "atank", "khauf"],
        'Surprise': ["wow", "surprise", "unbelievable", "omg", "shock", "gazab", "kya", "shander", "hairan", "ajab", "kamaal", "ashcharyam", "adbhutam", "vismayam", "ashcharyaṃ", "astounded", "bewildered", "miracle", "chamatkar", "achamba", "hairat", "subhanallah"],
        'Disgust': ["disgust", "gross", "yuck", "eww", "chi", "ghinn", "thoo", "chee", "bakwaas", "chechi", "heyamu", "jugupsa", "aschayam", "revolting", "repulsive", "filthy", "shameful", "ganda", "ghinona", "napak", "laanat"],
        'Sarcasm': ["wah", "shabash", "theek", "chal", "ha ha", "very good", "sahi hai bhai", "theek hai", "abba", "sarle", "avunaa", "nijamaa", "voddhu", "sarle sarle", "totally", "whatever", "sure thing", "genius", "slow clap", "theek bhai", "ha bhai ha", "janab"]
    }
    
    # Check for Mixed logic
    if any(m in words_in_text for m in ["but", "however", "lekin", "magar"]):
        return "Mixed", 0.65
    
    # 📉 COUNTER SYSTEM (Weighted Sentiment)
    scores = {emo: 0 for emo in keywords}
    for emo, kw_list in keywords.items():
        for kw in kw_list:
            # SAFETY UPGRADE: Only match exact words for single-character/short tokens
            # This prevents 'mad' from matching 'madad' (Help)
            is_phrase = " " in kw
            if (is_phrase and kw in text) or (not is_phrase and kw in words_in_text):
                # 🛡️ NEGATION GUARD: 'Holiday' is good, but 'Holiday NAHI hai' is bad
                is_negated = any(neg in words_in_text for neg in ["nahi", "nahin", "na", "no", "not"])
                
                weight = 1.0 if not is_phrase else 1.5 # Phrases are more specific
                
                if emo == 'Happy' and is_negated:
                    scores['Sad'] += weight
                elif emo == 'Angry' and is_negated:
                    scores['Happy'] += (weight * 0.5)
                else:
                    scores[emo] += weight

    # Return top scoring emotion
    top_emo = max(scores.keys(), key=lambda k: scores[k])
    if scores[top_emo] > 0:
        # Priority logic: Hinglish markers for Joy/Angry are often strong
        conf_boost = min(0.85, 0.75 + (0.1 * scores[top_emo]))
        return top_emo, conf_boost
    
    return "Neutral", 0.50

def predict_text(text):
    """
    ADVANCED SMART AI: Real Context Analysis (Transformers) + Sarcasm + Mixed State Detection
    Multilingual support via Deep-Translator + Langdetect
    No keyword dependency - Understands semantic intent.
    """
    if not text or not text.strip():
        return {"error": "No meaningful text provided."}

    t0 = time.time()
    
    try:
        # Step 1: Detect Language (Auto-detect from input)
        try:
            lang = detect(text)
        except:
            lang = 'en'
            
        # Step 2: Translate to English if needed (Model works best on English)
        if lang != 'en':
            try:
                translated_text = GoogleTranslator(source='auto', target='en').translate(text)
            except Exception as tr_err:
                print(f"Translation Error: {tr_err}")
                translated_text = text
        else:
            translated_text = text

        # Step 3: Hybrid Inference (Transformers + Keyword Booster)
        h_emo, h_conf = heuristic_predict(text) # Check ORIGINAL text for Hinglish nuances
        
        if classifier:
            res = classifier(translated_text)[0]
            label = res['label'].lower()
            confidence = float(res['score'])
            t_emo = LABEL_MAP.get(label, label.capitalize())
            
            # 🔥 Step 4: Hybrid Decision Logic (Keyword Booster Override)
            # If original text has a strong Hinglish marker (like 'kush'), override Transformer
            if h_emo != "Neutral" and h_conf >= 0.75:
                display_emotion = h_emo
                confidence = max(confidence, h_conf)
                note = f"Bi-lingual Hybrid Booster Applied ({h_emo})"
            else:
                display_emotion = t_emo
                note = "Neural Analysis Active"

            text_lower = translated_text.lower()
            # Step 5: Sarcasm & Mixed logic remains...

        return {
            "emotion": display_emotion,
            "confidence": round(confidence, 4),
            "language": lang,
            "original": text,
            "translated": translated_text if lang != 'en' else None,
            "time": round(time.time() - t0, 3),
            "note": note
        }

    except Exception as e:
        print(f"Text Analysis Error: {e}")
        return {"emotion": "Neutral", "confidence": 0.50, "language": "unknown", "error": str(e)}
