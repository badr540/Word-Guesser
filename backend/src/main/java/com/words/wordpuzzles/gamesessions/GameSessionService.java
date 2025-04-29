package com.words.wordpuzzles.gamesessions;

import com.words.wordpuzzles.words.WordRepository;

import com.words.wordpuzzles.words.Word;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class GameSessionService {

    private final GameSessionRepository gameSessionRepository;
    private final WordRepository wordRepository;

    GameSessionService(GameSessionRepository gameSessionRepository, WordRepository wordRepository) {
        this.gameSessionRepository = gameSessionRepository;
        this.wordRepository = wordRepository;        
    }

    public GameSession createSession(Integer userId, Integer wordLength, Integer rarity){

        UUID sessionId = UUID.randomUUID();

        Word word = wordRepository.getWord(wordLength, rarity);
        
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
        outputWord, 
        session.rarity(), 
        session.attempts(), 
        session.expiresAt());

        return outputSession;
    }

    public GameSession status(UUID sessionId){
        GameSession session = gameSessionRepository.read(sessionId);
        
        session = new GameSession(
        session.sessionId(),
        session.userId(),
        session.status(), 
        "*".repeat(session.word().length()),
        session.rarity(), 
        session.attempts(), 
        session.expiresAt());
        
        return session;
    }

    public GameSession guess(GameSession session){
        
        
        String guessedWord = session.word();
        session = gameSessionRepository.read(session.sessionId());
        String realWord = session.word();

        if (session.status() != GameStatus.IN_PROGRESS){
            return session;
        }
        else if(guessedWord.equals(realWord)){
            //whatever needs to be handled here like adding a win to a players record
            GameSession updatedSession = new GameSession(
            session.sessionId(), 
            session.userId(), 
            GameStatus.WON, 
            realWord, 
            session.rarity(), 
            session.attempts()-1, 
            session.expiresAt());
            
            gameSessionRepository.update(updatedSession, session.sessionId());

            return updatedSession;
        }
        else if(session.attempts() == 0){
            GameSession updatedSession = new GameSession(
            session.sessionId(), 
            session.userId(), 
            GameStatus.LOST, 
            realWord, 
            session.rarity(), 
            session.attempts(), 
            session.expiresAt());
           
            gameSessionRepository.update(updatedSession, session.sessionId());
            
            return updatedSession;
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
        
        //figure out a cleaner way to do this 

        GameSession updatedSession = new GameSession(
        session.sessionId(), 
        session.userId(), 
        GameStatus.IN_PROGRESS, 
        session.word(), 
        session.rarity(), 
        session.attempts()-1, 
        session.expiresAt());
        
        gameSessionRepository.update(updatedSession, session.sessionId());

        GameSession returnedSession = new GameSession(
        session.sessionId(), 
        session.userId(), 
        GameStatus.IN_PROGRESS, 
        guessOutput, 
        session.rarity(), 
        session.attempts()-1, 
        session.expiresAt());

        return returnedSession;
    }



    public GameSession giveup(GameSession session){
        
        session = gameSessionRepository.read(session.sessionId());

        GameSession updatedSession = new GameSession(
        session.sessionId(), 
        session.userId(), 
        GameStatus.LOST, 
        session.word(), 
        session.rarity(), 
        session.attempts(), 
        session.expiresAt());
        
        gameSessionRepository.update(updatedSession, session.sessionId());

        return updatedSession;
    }


}
