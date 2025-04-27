package com.words.wordpuzzles.sessions;

import java.time.LocalDateTime;
import java.util.UUID;


public record Sessions(
            UUID sessionID,
            Integer userID,
            String word,
            Integer attempts,
            LocalDateTime expires_at

){}