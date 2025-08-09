// ==========================================================================
// CUSTOM REACT HOOKS
// ==========================================================================

const useSpeech = () => {
    // Enhanced language detection with better pinyin recognition
    const detectLanguage = (text) => {
        if (!text) return 'en-US';
        
        // Check for Thai characters (Unicode range: 0E00-0E7F)
        const thaiRegex = /[\u0E00-\u0E7F]/;
        if (thaiRegex.test(text)) {
            return 'th-TH';
        }
        
        // Check for Chinese characters (Unicode ranges: 4E00-9FFF, 3400-4DBF, F900-FAFF)
        const chineseRegex = /[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF]/;
        if (chineseRegex.test(text)) {
            return 'zh-CN';
        }
        
        // Enhanced pinyin detection - more comprehensive patterns
        const commonPinyinSyllables = [
            'ba', 'pa', 'ma', 'fa', 'da', 'ta', 'na', 'la', 'ga', 'ka', 'ha',
            'ji', 'qi', 'xi', 'zhi', 'chi', 'shi', 'ri', 'zi', 'ci', 'si',
            'ya', 'wa', 'yuan', 'ying', 'yang', 'yong', 'you', 'yan', 'yin',
            'ai', 'ei', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'ong',
            'ia', 'ie', 'iao', 'iou', 'ian', 'in', 'iang', 'ing', 'iong',
            'ua', 'uo', 'uai', 'ui', 'uan', 'un', 'uang', 'ueng',
            'ue', 'uan', 'un'
        ];
        
        // Check if text contains tone marks or pinyin patterns
        const hasToneMarks = /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/i.test(text);
        const textLower = text.toLowerCase().trim();
        const isPinyinSyllable = commonPinyinSyllables.some(syllable => 
            textLower === syllable || textLower.includes(syllable)
        );
        
        if (hasToneMarks || isPinyinSyllable) {
            return 'zh-CN';
        }
        
        // Check for space-separated pinyin (like "bà ba")
        const words = textLower.split(/\s+/);
        const allWordsPinyin = words.length > 1 && words.every(word => 
            commonPinyinSyllables.includes(word) || /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/.test(word)
        );
        
        if (allWordsPinyin) {
            return 'zh-CN';
        }
        
        return 'en-US';
    };

    const pronounceText = React.useCallback(async (text, requestedLang) => {
        if (!text || !text.trim()) {
            console.error("No text to pronounce.");
            return;
        }
        
        // Use smart language detection instead of relying on requestedLang
        const detectedLang = detectLanguage(text);
        console.log(`Text: "${text}" | Requested: ${requestedLang} | Detected: ${detectedLang}`);
        
        // For Chinese content (characters OR pinyin), always use external TTS
        if (detectedLang === 'zh-CN') {
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                if (audioContext.state === 'suspended') {
                    await audioContext.resume();
                }

                const backendUrl = "https://d682f7a4-5681-429e-9c86-22b8329e4b8e-00-liewh2dfj37m.sisko.replit.dev/tts";

                console.log('🇨🇳 Using external TTS for Chinese content...');
                const response = await fetch(backendUrl, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'audio/mpeg'
                    },
                    body: JSON.stringify({ text, lang: 'zh-CN' })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`TTS request failed with status ${response.status}: ${errorText}`);
                }

                const audioData = await response.arrayBuffer();
                if (audioData.byteLength === 0) {
                    throw new Error('Received empty audio data');
                }

                const audioBuffer = await audioContext.decodeAudioData(audioData);
                const source = audioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioContext.destination);
                source.start(0);
                
                console.log('✅ Chinese TTS played successfully');
                return;

            } catch (error) {
                console.error("❌ External Chinese TTS failed:", error);
                // Don't fallback for Chinese - we want the accurate pronunciation
                return;
            }
        }
        
        // For Thai content, use external TTS too for better quality
        if (detectedLang === 'th-TH') {
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                if (audioContext.state === 'suspended') {
                    await audioContext.resume();
                }

                const backendUrl = "https://d682f7a4-5681-429e-9c86-22b8329e4b8e-00-liewh2dfj37m.sisko.replit.dev/tts";

                console.log('🇹🇭 Using external TTS for Thai content...');
                const response = await fetch(backendUrl, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'audio/mpeg'
                    },
                    body: JSON.stringify({ text, lang: 'th-TH' })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`TTS request failed with status ${response.status}: ${errorText}`);
                }

                const audioData = await response.arrayBuffer();
                if (audioData.byteLength === 0) {
                    throw new Error('Received empty audio data');
                }

                const audioBuffer = await audioContext.decodeAudioData(audioData);
                const source = audioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioContext.destination);
                source.start(0);
                
                console.log('✅ Thai TTS played successfully');
                return;

            } catch (error) {
                console.error("❌ External Thai TTS failed:", error);
                // Fallback to browser for Thai if external fails
            }
        }
        
        // Use browser speech synthesis for English or as fallback
        if ('speechSynthesis' in window) {
            try {
                speechSynthesis.cancel();
                
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = detectedLang;
                utterance.rate = 0.8;
                utterance.volume = 1.0;
                
                utterance.onstart = () => console.log(`🔊 Browser speech started (${detectedLang})`);
                utterance.onend = () => console.log('✅ Browser speech ended');
                utterance.onerror = (e) => console.error('❌ Browser speech error:', e);
                
                speechSynthesis.speak(utterance);
                return;
            } catch (error) {
                console.error("❌ Browser speech synthesis failed:", error);
            }
        }
        
        console.error("❌ No speech synthesis method available");
    }, []);

    return { pronounceText };
};
