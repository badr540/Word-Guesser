package com.words.wordpuzzles.gamesessions;

import com.words.wordpuzzles.words.WordService;
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
    private final WordService wordService;

    GameSessionService(GameSessionRepository gameSessionRepository, WordService wordService) {
        this.gameSessionRepository = gameSessionRepository;
        this.wordService = wordService;        
    }

    public GameSession getSession(UUID uuid){
        if(gameSessionRepository.exists(uuid)){
            GameSession session = gameSessionRepository.read(uuid);
            String outputWord = "*".repeat(session.word().length());

            if(session.status() == GameStatus.LOST){
                outputWord = session.word();
            }

            return new GameSession(
            session.sessionId(), 
            session.userId(), 
            session.status(), 
            session.guesses(),
            session.results(),
            outputWord, 
            session.rarity(), 
            session.attempts(), 
            session.expiresAt());
        }

        return null;
    }

    public Object createSession(Integer userId, Integer wordLength, Integer rarity, String requestWord){

        UUID sessionId = UUID.randomUUID();
        Word word = new Word(1,"",1);
        if(requestWord != null){
            if(!wordService.isWordReal(requestWord)){
                return Map.of();
            }

            word = new Word(-1, requestWord, -1);
        }
        else{
            word = wordService.getRandomWord(wordLength, rarity);
        }

        
        if(userId == null){
            userId = -1;
        }

        gameSessionRepository.create(sessionId, userId, word.word(), word.rarity());

        GameSession session = gameSessionRepository.read(sessionId);

        String outputWord = "*".repeat(session.word().length());

        GameSession outputSession = new GameSession(
        sessionId, 
        userId, 
        session.status(), 
        session.guesses(),
        session.results(),
        outputWord, 
        session.rarity(), 
        session.attempts(), 
        session.expiresAt());

        return outputSession;
    }

    public GameSession status(GameSession session){
        session = gameSessionRepository.read(session.sessionId());

        if(session.status() != GameStatus.IN_PROGRESS){
            return session;
        }

        //hide the word if the game is still in progress
        String outputWord = "*".repeat(session.word().length());
        session = new GameSession(
        session.sessionId(),
        session.userId(),
        session.status(), 
        session.guesses(),
        session.results(),
        outputWord,
        session.rarity(), 
        session.attempts(), 
        session.expiresAt());
        
        return session;
    }

    public GameSession guess(GameSession session){
        String guessedWord = session.word().toLowerCase();
        
        if(!wordService.isWordReal(guessedWord)){
            return session;
        }

        
        session = gameSessionRepository.read(session.sessionId());
        String realWord = session.word().toLowerCase();
        int attempts  = session.attempts()-1;
        if (session.status() != GameStatus.IN_PROGRESS){
            return session;
        }

        String guessOutput = "";   
        for(int i = 0; i < realWord.length(); i ++){
            if(i < guessedWord.length() && 
                guessedWord.charAt(i) == realWord.charAt(i)){

                guessOutput += guessedWord.charAt(i);
            }
            else if(realWord.indexOf(guessedWord.charAt(i)) != -1){
                guessOutput += '!';
            }
            else{
                guessOutput += '*';
            }
        }

        List<String> guesses = new ArrayList<>(session.guesses());
        List<String> results = new ArrayList<>(session.results());
        guesses.add(guessedWord);
        results.add(guessOutput);
        
        if(guessedWord.equals(realWord)){
            //whatever needs to be handled here like adding a win to a players record
            GameSession updatedSession = new GameSession(
            session.sessionId(), 
            session.userId(), 
            GameStatus.WON, 
            guesses,
            results,
            realWord, 
            session.rarity(), 
            attempts, 
            session.expiresAt());
            
            gameSessionRepository.update(updatedSession, session.sessionId());

            return updatedSession;
        }
        else if(attempts <= 0){
            GameSession updatedSession = new GameSession(
            session.sessionId(), 
            session.userId(), 
            GameStatus.LOST, 
            session.guesses(),
            session.results(),
            realWord, 
            session.rarity(), 
            attempts, 
            session.expiresAt());
           
            gameSessionRepository.update(updatedSession, session.sessionId());
            
            return updatedSession;
        }


        //figure out a cleaner way to do this 
        GameSession updatedSession = new GameSession(
        session.sessionId(), 
        session.userId(), 
        GameStatus.IN_PROGRESS, 
        guesses,
        results,
        session.word(), 
        session.rarity(), 
        attempts, 
        session.expiresAt());
        
        gameSessionRepository.update(updatedSession, session.sessionId());

        GameSession returnedSession = new GameSession(
        session.sessionId(), 
        session.userId(), 
        GameStatus.IN_PROGRESS, 
        guesses,
        results,
        guessOutput, 
        session.rarity(), 
        attempts, 
        session.expiresAt());

        return returnedSession;
    }



    public GameSession giveup(GameSession session){
        
        session = gameSessionRepository.read(session.sessionId());

        GameSession updatedSession = new GameSession(
        session.sessionId(), 
        session.userId(), 
        GameStatus.LOST, 
        session.guesses(),
        session.results(),
        session.word(), 
        session.rarity(), 
        session.attempts(), 
        session.expiresAt());
        
        gameSessionRepository.update(updatedSession, session.sessionId());

        return updatedSession;
    }


}
