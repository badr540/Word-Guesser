package com.badrm.wordguesser.gamesessions;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.view.RedirectView;

import org.springframework.http.ResponseEntity;
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

    @GetMapping("/{sessionId}")
    public ResponseEntity<Object> getSession(@PathVariable UUID sessionId) {
        try {
            GameSession session = gameSessionService.getSession(sessionId);
            return ResponseEntity.ok(session);
        } catch (SessionNotFoundException e) {
            return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(Map.of(
                "error", "SESSION_NOT_FOUND",
                "message", e.getMessage()
            ));
        } 
    }

    @PostMapping
    public ResponseEntity<Object> createSession(
        @RequestParam(required = false) Integer wordLength,
        @RequestParam(required = false) Integer rarity,
        @RequestParam(required = false) String word){
            
        try {
            GameSession session = gameSessionService.createSession(wordLength, rarity, word);
            return ResponseEntity.created(URI.create("/?sessionId=" + session.sessionId()))
            .body(session);
        } catch (InvalidWordException e) {
            return ResponseEntity.badRequest()
            .body(Map.of(
                "error", "INVALID_WORD",
                "message", e.getMessage()
            ));
        }catch (Exception e) {
            System.err.println("ERROR: " + e.getMessage());
            return ResponseEntity.internalServerError()
            .body(Map.of(
                "error", "SERVER_ERROR",
                "message", "Try again later"  
            ));
        }
    }

    @PostMapping("/guess")
    public ResponseEntity<Object> guess(@RequestBody GameSession userSession){
        try {
            GameSession session = gameSessionService.guess(userSession);
            return ResponseEntity.ok(session);
        } catch (SessionNotFoundException e) {
            return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(Map.of(
                "error", "SESSION_NOT_FOUND",
                "message", e.getMessage()
            ));
        } 
    }
    
    @PostMapping("/{sessionId}/giveup")
    public ResponseEntity<Object> giveup(@PathVariable UUID sessionId){
        try {
            GameSession session = gameSessionService.giveup(sessionId);
            return ResponseEntity.ok(session);
        } catch (SessionNotFoundException e) {
            return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(Map.of(
                "error", "SESSION_NOT_FOUND",
                "message", e.getMessage()
            ));
        } 
    }
}