package com.words.wordpuzzles;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Collections;
import java.util.Map;
import java.util.UUID;

import com.words.wordpuzzles.gamesessions.GameSessionService;
import com.words.wordpuzzles.gamesessions.SessionNotFoundException;

import org.springframework.stereotype.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.ui.Model;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.core.io.ClassPathResource;
import java.nio.file.Files;
import java.nio.file.Path;

@Controller
public class HomeController {

    private final GameSessionService gameSessionService;

    HomeController(GameSessionService gameSessionService){
        this.gameSessionService = gameSessionService;
    }

    @GetMapping("/")
    public String index(@RequestParam(required = false) UUID sessionId, Model model){
        try {
            model.addAttribute("session",
                sessionId != null 
                    ? gameSessionService.getSession(sessionId)
                    : Collections.emptyMap()
            );
        } catch (SessionNotFoundException e) {
            model.addAttribute("session", Collections.emptyMap());
            
        }

        return "index";
    }
}
