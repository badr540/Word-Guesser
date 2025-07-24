package com.badrm.wordguesser.gamesessions;
import java.util.List;
import java.util.UUID;

public record GameSession(
    UUID sessionId,
    GameStatus status,
    List<String> guesses,
    List<String> results,
    String word,
    Integer rarity,
    Integer attempts,
    Long expiresAt
){}