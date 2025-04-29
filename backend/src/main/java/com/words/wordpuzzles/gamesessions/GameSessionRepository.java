package com.words.wordpuzzles.gamesessions;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import org.springframework.util.Assert;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Repository
public class GameSessionRepository {
    private final JdbcClient jdbcClient;

    public GameSessionRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    
    public void create(UUID sessionId, Integer userId, String word, Integer rarity){
        
        jdbcClient.sql("INSERT INTO game_sessions (session_id, user_id, word, rarity) VALUES(?,?,?,?);")
        .params(List.of(sessionId, userId, word, rarity))
        .update();      

        //Sessions session = jdbcClient.sql("SELECT * FROM sessions WHERE session_id = ? ;")
        //.param(session_id)
        //.query(Sessions.class)
        //.single();
//
        //String returnedWord = "*".repeat(word.length());
        //Sessions returnedSession = new Sessions(session.sessionId(), session.userId(), returnedWord, session.rarity(), session.attempts(), session.expiresAt());

    }


    public GameSession read(UUID sessionId){
        return jdbcClient.sql("SELECT * FROM game_sessions WHERE session_id = ? ;")
        .param(sessionId)
        .query(GameSession.class)
        .single();
    }

    public void update(GameSession session, UUID sessionId){
        jdbcClient.sql("UPDATE game_sessions SET user_id = ?, status = ? ::game_status, word = ?, rarity = ?, attempts = ?, expires_at = ? WHERE session_id = ? ;")
        .params(List.of(session.userId(), session.status().toString(), session.word(), session.rarity(), session.attempts(), session.expiresAt(), sessionId))
        .update();
    }

    public void delete(UUID sessionId){
        jdbcClient.sql("DELETE game_sessions WHERE session_id = ? ;")
        .param(sessionId)
        .update();
    }

}
