package com.words.wordpuzzles;
import org.springframework.stereotype.*;
import org.springframework.web.bind.annotation.*;

@Controller
public class HomeController {
    @RequestMapping("/")
    public String index() {
        return "index.html";
    }
}
