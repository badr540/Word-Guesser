package com.words.wordpuzzles.sessions;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import org.springframework.util.Assert;

import java.util.ArrayList;
import java.util.List;

@Repository
public class SessionsRepository {
    private final JdbcClient jdbcClient;

    public SessionsRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    
    public Sessions create(Integer userID, String word, Integer rarity){

        jdbcClient.sql("INSERT INTO sessions (user_id, word, rarity) VALUES(?,?,?);")
        .params(List.of(userID, word, rarity))
        .query(Sessions.class);

        
        Sessions s = new Sessions(null, 0, "fakeword", 0, null);
        return s;
    }
}
