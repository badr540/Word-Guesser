package com.words.wordpuzzles.words;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;


@RestController 
@RequestMapping("/get-word") 
public class WordsController {

    private final JdbcWordsRepository wordRepository;

    WordsController(JdbcWordsRepository wordRepository) {
        this.wordRepository = wordRepository;
    }

    @GetMapping
    public List<Words> getWord(
        @RequestParam(required = false, defaultValue = "50") int size,
        @RequestParam(required = false, defaultValue = "0") int offset,
        @RequestParam(required = false) Integer wordLength,
        @RequestParam(required = false) Integer difficulty){
        
        return wordRepository.getWord(size, offset, wordLength, difficulty);

    }
}
