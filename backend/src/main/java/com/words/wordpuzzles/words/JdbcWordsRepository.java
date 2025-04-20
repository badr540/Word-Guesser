package com.words.wordpuzzles.words;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class JdbcWordsRepository {

    private final JdbcClient jdbcClient;

    public static final List<String> DIFFICULTIES = List.of("easy", "normal", "hard", "impossible");

    public JdbcWordsRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    public List<Words> getWord(
        @RequestParam(required = false, defaultValue = "50") int size,
        @RequestParam(required = false, defaultValue = "0") int offset,
        @RequestParam(required = false) Integer wordLength,
        @RequestParam(required = false) Integer difficulty){

        StringBuilder sql = new StringBuilder("SELECT * FROM words WHERE 1=1 ");
        List<Object> params = new ArrayList<>();

        if(wordLength != null){
            sql.append("AND LENGTH(word) = ? ");
            params.add(wordLength);
        }

        if(difficulty != null && difficulty >= 0 && difficulty < DIFFICULTIES.size()) {
            sql.append("AND difficulty = ?::word_difficulty ");
            params.add(DIFFICULTIES.get(difficulty));  // Use the string value from DIFFICULTIES list
        }

        sql.append("ORDER BY RANDOM() LIMIT 1");

        Object[] paramArray = params.toArray(new Object[0]);

        return jdbcClient.sql(sql.toString() +";")
                        .params(paramArray) 
                        .query(Words.class)
                        .list();
    }
}
