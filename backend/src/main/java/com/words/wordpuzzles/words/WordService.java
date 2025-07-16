package com.words.wordpuzzles.words;

import com.words.wordpuzzles.words.WordRepository;

import com.words.wordpuzzles.words.Word;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class WordService {
    private final WordRepository wordRepository;

    WordService( WordRepository wordRepository) {
        this.wordRepository = wordRepository;        
    }

    public Word getRandomWord(Integer wordLength, Integer rarity){
        Optional<Word> res = wordRepository.read(wordLength, rarity, null);
        if(res.isPresent()){
            return res.get();
        }

        return null;
    }

    public boolean isWordReal(String word){
        Optional<Word> res = wordRepository.read(null, null, word);
        return res.isPresent();
    }
}
