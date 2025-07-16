package com.words.wordpuzzles.gamesessions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.view.RedirectView;

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

    @GetMapping("/{uuid}")
    public Object get(@PathVariable UUID uuid){
        GameSession session = gameSessionService.getSession(uuid);
        if(session == null){
            return new RedirectView("/");
        }

        return session;
    }

    @PostMapping
    public GameSession create(
        @RequestParam(required = false) Integer userId, 
        @RequestParam(required = false) Integer wordLength, 
        @RequestParam(required = false) Integer rarity){

        return gameSessionService.createSession(userId, wordLength, rarity);
    }
    
    @PostMapping("/status")
    public GameSession sessionStatus(@RequestBody GameSession userSession){
        return gameSessionService.status(userSession);
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