package com.badrm.wordguesser.gamesessions;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Array;

import java.util.UUID;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.jdbc.core.RowMapper;


public class GameSessionRowMapper implements RowMapper<GameSession> {
    @Override
    public GameSession mapRow(ResultSet rs, int rowNum) throws SQLException{
        UUID sessionId = rs.getObject("session_id", UUID.class);
        GameStatus status = GameStatus.valueOf(rs.getString("status"));

        Array guessesArray = rs.getArray("guesses");
        List<String> guesses = (guessesArray!= null) ? Arrays.asList((String[]) guessesArray.getArray()) : new ArrayList<>();
        Array resultsArray = rs.getArray("results");
        List<String> results = (resultsArray!= null) ? Arrays.asList((String[]) resultsArray.getArray()) : new ArrayList<>();

        String word = rs.getString("word");
        Integer rarity = rs.getInt("rarity");
        Integer attempts = rs.getInt("attempts");
        Long expiresAt = rs.getLong("expires_at");

        return new GameSession(sessionId, 
            status, 
            guesses,
            results,
            word,
            rarity,
            attempts,
            expiresAt);
    }
    
}
