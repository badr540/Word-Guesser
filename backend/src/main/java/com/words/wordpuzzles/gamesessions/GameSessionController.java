package com.words.wordpuzzles.gamesessions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/sessions")

public class GameSessionController {

    private final GameSessionService gameSessionService;

    GameSessionController(GameSessionService gameSessionService) {
        this.gameSessionService = gameSessionService;
    }

    @PostMapping
    public GameSession create(
        @RequestParam(required = false) Integer userId, 
        @RequestParam(required = false) Integer wordLength, 
        @RequestParam(required = false) Integer rarity){

        return gameSessionService.createSession(userId, wordLength, rarity);
    }

    @GetMapping(value = "/{sessionId}")
    public GameSession sessionStatus(@PathVariable UUID sessionId){
        return gameSessionService.status(sessionId);
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