package com.words.wordpuzzles.gamesessions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.view.RedirectView;

import main.java.com.words.wordpuzzles.gamesessions.SessionNotFoundException;

import org.springframework.ui.Model;

import java.net.URI;
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
    public ResponseEntity<?> getSession(@PathVariable UUID id) {
        try {
            GameSession session = gameSessionService.getSessionById(id);
            return ResponseEntity.ok(session);
        } catch (SessionNotFoundException ex) {
            return ResponseEntity.notFound().build();
        } 
    }

    @PostMapping
    public ResponseEntity<?> createSession(
        @RequestParam(required = false) Integer userId,
        @RequestParam(required = false) Integer wordLength,
        @RequestParam(required = false) Integer rarity,
        @RequestParam(required = false) String word){
            
        try {
            GameSession session = gameSessionService.createSession(userId, wordLength, rarity, word);
            return ResponseEntity.created(URI.create("/?sessionId=" + session.getSessionId()))
            .body(session);
        } catch (InvalidWordException e) {
            return ResponseEntity.badRequest()
            .body(Map.of(
                "error", "INVALID_WORD",
                "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/guess")
    public ResponseEntity<?> guess(@RequestBody GameSession userSession){
        try {
            GameSession session = gameSessionService.guess(userSession);
            return ResponseEntity.ok(session);
        } catch (Exception ex) {
            return ResponseEntity.notFound().build();
        } 
    }
    
    @PostMapping("/giveup")
    public ResponseEntity<?> giveup(@RequestBody GameSession userSession){
        try {
            GameSession session = gameSessionService.guess(userSession);
            return ResponseEntity.ok(session);
        } catch (Exception ex) {
            return ResponseEntity.notFound().build();
        } 
    }
}