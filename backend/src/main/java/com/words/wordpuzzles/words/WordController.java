package com.words.wordpuzzles.words;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;


@RestController 
@RequestMapping("/get-word") 
public class WordController {

    private final WordRepository wordRepository;

    WordController(WordRepository wordRepository) {
        this.wordRepository = wordRepository;
    }

    @GetMapping
    public Word getWord(
        @RequestParam(required = false) Integer wordLength,
        @RequestParam(required = false) Integer rarity){
        
        return wordRepository.getWord(wordLength, rarity);

    }
}
