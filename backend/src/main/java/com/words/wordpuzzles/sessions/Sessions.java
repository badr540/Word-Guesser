package com.words.wordpuzzles.sessions;

import java.time.LocalDateTime;
import java.util.UUID;


public record Sessions(
            UUID sessionId,
            Integer userId,
            String word,
            Integer rarity,
            Integer attempts,
            LocalDateTime expiresAt

){}