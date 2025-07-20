package com.words.wordpuzzles.gamesessions;

public class SessionNotFoundException extends RuntimeException {
    public SessionNotFoundException(UUID sessionId) {
        super("Session not found: " + sessionId);
    }
}