package com.words.wordpuzzles.gamesessions;

import java.sql.Array;
import java.sql.Connection;
import java.sql.SQLException;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import org.springframework.util.Assert;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.sql.DataSource;

@Repository
public class GameSessionRepository {
    private final JdbcClient jdbcClient;
    private final DataSource dataSource;

    long minutesInMillis(int minutes){
        return minutes * 60 * 1000;
    }

    public GameSessionRepository(JdbcClient jdbcClient, DataSource dataSource) {
        this.jdbcClient = jdbcClient;
        this.dataSource = dataSource;
    }

    
    public void create(UUID sessionId, Integer userId, String word, Integer rarity){
        long unixMillis = System.currentTimeMillis() + minutesInMillis(2);

        jdbcClient.sql("INSERT INTO game_sessions (session_id, user_id, word, rarity, expires_at) VALUES(?,?,?,?,?);")
        .params(List.of(sessionId, userId, word, rarity, unixMillis))
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
        .query(new GameSessionRowMapper())
        .single();
    }

    public void update(GameSession session, UUID sessionId){
        try (Connection conn = dataSource.getConnection()) {
            Array gueses = conn.createArrayOf("text", session.guesses().toArray());
            Array results = conn.createArrayOf("text", session.results().toArray());
            jdbcClient.sql("UPDATE game_sessions SET user_id = ?, status = ? ::game_status, guesses = ?, results = ?, word = ?, rarity = ?, attempts = ?, expires_at = ? WHERE session_id = ? ;")
            .params(List.of(session.userId(), session.status().toString(), gueses, results, session.word(), session.rarity(), session.attempts(), session.expiresAt(), sessionId))
            .update();
        } catch (SQLException e) {
            throw new RuntimeException("Database error while inserting session", e);
        }
    }

    public void delete(UUID sessionId){
        jdbcClient.sql("DELETE game_sessions WHERE session_id = ? ;")
        .param(sessionId)
        .update();
    }

}
