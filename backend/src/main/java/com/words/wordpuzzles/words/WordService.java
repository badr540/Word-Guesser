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
        return wordRepository.read(wordLength, rarity);
    }

    public boolean isWordReal(String word){
        return wordRepository.exists(word);
    }
}
