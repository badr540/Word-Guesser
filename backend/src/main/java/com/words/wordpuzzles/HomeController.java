package com.words.wordpuzzles;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.UUID;

import com.words.wordpuzzles.gamesessions.GameSessionService;
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
    @ResponseBody
    public String index(@RequestParam(required = false) UUID sessionId) throws IOException {
        System.out.println(sessionId);
    
        Object session = (sessionId != null) ? gameSessionService.getSession(sessionId) : Map.of();
    
        Path path = new ClassPathResource("static/index.html").getFile().toPath();
        String content = Files.readString(path);
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(session);
        String modifiedHtml = content.replace("__INJECTED_SESSION__", json);
    
        return modifiedHtml;
    }
}
