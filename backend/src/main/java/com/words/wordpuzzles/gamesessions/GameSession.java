package com.words.wordpuzzles.gamesessions;

import java.time.LocalDateTime;
import java.util.UUID;

public record GameSession(
            UUID sessionId,
            Integer userId,
            GameStatus status,
            String word,
            Integer rarity,
            Integer attempts,
            LocalDateTime expiresAt

){}