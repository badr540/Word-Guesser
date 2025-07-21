package com.words.wordpuzzles.gamesessions;

import com.words.wordpuzzles.words.WordRepository;
import com.words.wordpuzzles.words.Word;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class GameSessionService {

    private final GameSessionRepository gameSessionRepository;
    private final WordRepository wordRepository;

    GameSessionService(GameSessionRepository gameSessionRepository, WordRepository wordRepository) {
        this.gameSessionRepository = gameSessionRepository;
        this.wordRepository = wordRepository;        
    }

    public GameSession getSession(UUID sessionId){
        GameSession session = gameSessionRepository.findById(sessionId);
        return maskWordIfInProgress(session);
    }

    public GameSession createSession(Integer wordLength, Integer rarity, String requestWord) {
        if (requestWord != null && !wordRepository.isWordReal(requestWord)) {
            throw new InvalidWordException(requestWord);
        }

        Word word = requestWord != null 
            ? new Word(-1, requestWord, -1) 
            : wordRepository.getRandomWord(wordLength, rarity);


        UUID sessionId = UUID.randomUUID();
        gameSessionRepository.create(sessionId, word.word(), word.rarity());
        
        return gameSessionRepository.findById(sessionId);
    }

    public GameSession guess(GameSession session){
        if (session == null || session.word() == null) {
            throw new IllegalArgumentException("Invalid session");
        }

        String guessedWord = session.word().toLowerCase();
        session = gameSessionRepository.findById(session.sessionId());

        if(session.status() != GameStatus.IN_PROGRESS || !wordRepository.isWordReal(guessedWord)){
            return session;
        }

        String realWord = session.word().toLowerCase();
        int remainingAttempts   = session.attempts()-1;
        String feedback = generateFeedback(guessedWord, realWord);   
        GameStatus newStatus = determineNewStatus(guessedWord, realWord, remainingAttempts);
        List<String> guesses = new ArrayList<>(session.guesses());
        guesses.add(guessedWord);
        List<String> results = new ArrayList<>(session.results());
        results.add(feedback);
        
        GameSession updatedSession = new GameSession(
        session.sessionId(), newStatus, 
        guesses, results, session.word(), 
        session.rarity(), remainingAttempts, session.expiresAt());

        gameSessionRepository.update(updatedSession, session.sessionId());
        return maskWordIfInProgress(updatedSession);
    }

    public GameSession giveup(UUID sessionId){
        GameSession session = gameSessionRepository.findById(sessionId);
        session = gameSessionRepository.markAsLost(session);
        gameSessionRepository.update(session, sessionId);
        return session;
    }

    private GameSession maskWordIfInProgress(GameSession session) {
        if (session.status() == GameStatus.IN_PROGRESS) {
            String maskedWord = maskWord(session.word());
            return new GameSession(
                session.sessionId(), 
                session.status(),
                session.guesses(),
                session.results(),
                maskedWord,  // Hide word
                session.rarity(),
                session.attempts(),
                session.expiresAt()
            );
        }
        return session;
    }
    
    private GameStatus determineNewStatus(String guessedWord, String targetWord, int remainingAttempts) {
        if (guessedWord.equals(targetWord)) {
            return GameStatus.WON;
        }
        if (remainingAttempts <= 0) {
            return GameStatus.LOST;
        }
        return GameStatus.IN_PROGRESS;
    }

    private String generateFeedback(String guessedWord, String targetWord) {
        StringBuilder feedback = new StringBuilder(targetWord.length());
        for (int i = 0; i < targetWord.length(); i++) {
            char guessedChar = (i < guessedWord.length()) ? guessedWord.charAt(i) : ' ';
            char targetChar = targetWord.charAt(i);
            
            if (guessedChar == targetChar) {
                feedback.append(guessedChar);  // Correct letter and position
            } else if (targetWord.indexOf(guessedChar) != -1) {
                feedback.append('!');  // Correct letter, wrong position
            } else {
                feedback.append('*');  // Letter not in word
            }
        }
        return feedback.toString();
    }

    private String maskWord(String word) {
        return "*".repeat(word.length());
    }
}
