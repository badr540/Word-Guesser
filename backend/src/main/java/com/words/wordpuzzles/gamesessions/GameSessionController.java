package com.words.wordpuzzles.gamesessions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.view.RedirectView;

import main.java.com.words.wordpuzzles.gamesessions.SessionNotFoundException;

import org.springframework.ui.Model;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/sessions")
public class GameSessionController {

    private final GameSessionService gameSessionService;

    GameSessionController(GameSessionService gameSessionService) {
        this.gameSessionService = gameSessionService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<GameSession> getSession(@PathVariable UUID id) {
        try {
            GameSession session = gameSessionService.getSessionById(id);
            return ResponseEntity.ok(session);
        } catch (Exception ex) {
            return ResponseEntity.notFound().build();
        } 
    }

    @PostMapping
    public Object create(
        @RequestParam(required = false) Integer userId, 
        @RequestParam(required = false) Integer wordLength, 
        @RequestParam(required = false) Integer rarity,
        @RequestParam(required = false) String word){

        return gameSessionService.createSession(userId, wordLength, rarity, word);
    }

    @PostMapping("/guess")
    public GameSession guess(@RequestBody GameSession userSession){
        return gameSessionService.guess(userSession);
    }
    
    @PostMapping("/giveup")
    public GameSession giveup(@RequestBody GameSession userSession){
        return gameSessionService.giveup(userSession);
    }
}