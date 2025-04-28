package com.words.wordpuzzles.sessions;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import org.springframework.util.Assert;

import com.words.wordpuzzles.sessions.Sessions;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Repository
public class SessionsRepository {
    private final JdbcClient jdbcClient;

    public SessionsRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    
    public UUID create(Integer userID, String word, Integer rarity){
        
        UUID session_id = UUID.randomUUID();
        jdbcClient.sql("INSERT INTO sessions (session_id, user_id, word, rarity) VALUES(?,?,?,?);")
        .params(List.of(session_id, userID, word, rarity))
        .update();      
        
        return session_id;
    }

    public Sessions sessionStatus(UUID sessionId){
        Sessions session = jdbcClient.sql("SELECT * FROM sessions WHERE session_id = ? ;")
        .param(sessionId)
        .query(Sessions.class)
        .single();  
        
        Sessions s = new Sessions(session.sessionId(), session.userId(), null, session.rarity(), session.attempts(), session.expiresAt());
        return s;
    }


    public Sessions guess(UUID sessionId, String guessedWord){
        Sessions session = jdbcClient.sql("SELECT * FROM sessions WHERE session_id = ? ;")
        .param(sessionId)
        .query(Sessions.class)
        .single();
        
        
        String realWord = session.word();
        if(guessedWord == realWord){
            //whatever needs to be handled here like adding a win to a players record
            return session;
        }

        String guessOutput = "";   
        for(int i = 0; i < guessedWord.length(); i ++){
            if(guessedWord.charAt(i) == realWord.charAt(i)){
                guessOutput += guessedWord.charAt(i);
            }
            else{
                guessOutput += '*';
            }
        }
        
        Sessions updatedSession = new Sessions(session.sessionId(), session.userId(), guessOutput, session.rarity(), session.attempts()-1, session.expiresAt());
        
        jdbcClient.sql("UPDATE sessions SET max_tries = ? WHERE session_id = ? ;")
        .params(List.of(updatedSession.attempts(), updatedSession.sessionId()))
        .update();

        return updatedSession;
    }


}
