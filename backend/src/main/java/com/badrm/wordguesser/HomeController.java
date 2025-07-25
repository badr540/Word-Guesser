package com.badrm.wordguesser;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import com.badrm.wordguesser.gamesessions.GameSession;
import com.badrm.wordguesser.gamesessions.GameSessionService;
import com.badrm.wordguesser.gamesessions.SessionNotFoundException;

import org.springframework.stereotype.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.ui.Model;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.core.io.ClassPathResource;


@Controller
public class HomeController {

    private final GameSessionService gameSessionService;

    HomeController(GameSessionService gameSessionService){
        this.gameSessionService = gameSessionService;
    }

    @GetMapping("/")
    public String index(@RequestParam(required = false) UUID sessionId, Model model){
        try {
            if(sessionId!= null){
                GameSession s = gameSessionService.getSession(sessionId);
                System.out.println("Custom data map: " + s.toString());
                model.addAttribute("mySession", s);
            }
            else{
                model.addAttribute("mySession", null);
            }

        } catch (SessionNotFoundException e) {
            model.addAttribute("mySession", null);
        }       

        return "index";

    }
}
