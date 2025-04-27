package com.words.wordpuzzles.sessions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/sessions")
public class SessionsController {

    private final SessionsRepository sessionsRepository;

    SessionsController(SessionsRepository sessionsRepository) {
        this.sessionsRepository = sessionsRepository;
    }

    @GetMapping
    public Sessions create(@RequestParam(required = false) Integer userID){
        return sessionsRepository.create(0, "fakeword", 0);
    }
}