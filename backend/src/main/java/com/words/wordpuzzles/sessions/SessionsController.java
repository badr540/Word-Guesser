package com.words.wordpuzzles.sessions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/sessions")
public class SessionsController {

    private final SessionsRepository sessionsRepository;

    SessionsController(SessionsRepository sessionsRepository) {
        this.sessionsRepository = sessionsRepository;
    }

    @PostMapping
    public UUID create(@RequestParam(required = false) Integer userID){
        return sessionsRepository.create(0, "fakeword", 0);
    }

    @GetMapping(value = "/{sessionId}")
    public Sessions sessionStatus(@PathVariable UUID sessionId){
        return sessionsRepository.sessionStatus(sessionId);
    }
    
    @PostMapping(value = "/{sessionId}/guess")
    public Sessions guess(@PathVariable UUID sessionId, @RequestBody String guessedWord){
        return sessionsRepository.guess(sessionId, guessedWord);
    }
}