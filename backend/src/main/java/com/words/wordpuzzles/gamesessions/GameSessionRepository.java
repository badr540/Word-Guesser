package com.words.wordpuzzles.gamesessions;

import java.sql.Array;
import java.sql.Connection;
import java.sql.SQLException;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import org.springframework.util.Assert;

import main.java.com.words.wordpuzzles.gamesessions.GameSessionRowMapper;
import main.java.com.words.wordpuzzles.gamesessions.GameStatus;
import main.java.com.words.wordpuzzles.gamesessions.SessionNotFoundException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import javax.sql.DataSource;

@Repository
public class GameSessionRepository {
    private static final int MILLIS_PER_MINUTE = 60_000;
    public static final int DEFAULT_GAME_DURATION_MINUTES = 3;

    private final JdbcClient jdbcClient;
    private final DataSource dataSource;
    
    public GameSessionRepository(JdbcClient jdbcClient, DataSource dataSource) {
        this.jdbcClient = jdbcClient;
        this.dataSource = dataSource;
    } 
    
    public void create(UUID sessionId, Integer userId, String word, Integer rarity){
        long expirationTimeMillis = System.currentTimeMillis() + convertMinutesToMillis(DEFAULT_GAME_DURATION_MINUTES);

        jdbcClient.sql("INSERT INTO game_sessions (session_id, user_id, word, rarity, expires_at) VALUES(?,?,?,?,?);")
        .params(List.of(sessionId, userId, word, rarity, expirationTimeMillis))
        .update();      
    }

    public GameSession findById(UUID sessionId) {
        try {
            GameSession session = jdbcClient.sql("SELECT * FROM game_sessions WHERE session_id = ?")
                .param(sessionId)
                .query(new GameSessionRowMapper())
                .single();  // Throws EmptyResultDataAccessException if not found

            if (isExpired(session)) {
                session = markAsLost(session);
                update(session, session.sessionId());
            }

            return session;
        } catch (EmptyResultDataAccessException ex) {
            throw new SessionNotFoundException(sessionId);
        }
    }

    public void update(GameSession session, UUID sessionId){

        if(isExpired(session)){
            session = markAsLost(session);
        }

        try (Connection conn = dataSource.getConnection()) {
            
            Array guesses = conn.createArrayOf("text", session.guesses().toArray());
            Array results = conn.createArrayOf("text", session.results().toArray());

            jdbcClient
            .sql("""
                UPDATE game_sessions 
                SET user_id = ?, status = ? ::game_status, 
                guesses = ?, results = ?, word = ?, 
                rarity = ?, attempts = ?, expires_at = ? 
                WHERE session_id = ? ; 
            """)
            .params(List.of(
                session.userId(), session.status().toString(), 
                guesses, results, session.word(), 
                session.rarity(), session.attempts(), 
                session.expiresAt(), sessionId)
            )
            .update();

        } catch (SQLException e) {
            throw new DataAccessException("Failed to update session: " + sessionId, e);
        }
    }

    public void delete(UUID sessionId){
        jdbcClient.sql("DELETE FROM game_sessions WHERE session_id = ? ;")
        .param(sessionId)
        .update();
    }

    public GameSession markAsLost(GameSession session) {
        return new GameSession(session.sessionId(),
            session.userId(),
            GameStatus.LOST, 
            session.guesses(),
            session.results(),
            session.word(),
            session.rarity(), 
            session.attempts(), 
            session.expiresAt()
        );
    }

    private static long convertMinutesToMillis(int minutes) {
        return minutes * MILLIS_PER_MINUTE;
    }

    private boolean isExpired(GameSession session) {
        return session.expiresAt() < System.currentTimeMillis();
    }

}
