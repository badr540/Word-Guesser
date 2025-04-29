package com.words.wordpuzzles.words;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.List;

@Repository
public class WordRepository {

    private final JdbcClient jdbcClient;

    public WordRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    public Word getWord(Integer wordLength, Integer rarity){

        StringBuilder sql = new StringBuilder("SELECT * FROM words WHERE 1=1 ");
        List<Object> params = new ArrayList<>();

        if(wordLength != null){
            sql.append("AND LENGTH(word) = ? ");
            params.add(wordLength);
        }

        if(rarity != null) {
            sql.append("AND rarity = ? ");
            params.add(rarity);
        }

        sql.append("ORDER BY RANDOM() LIMIT 1");

        Object[] paramArray = params.toArray(new Object[0]);

        return jdbcClient.sql(sql.toString() + ";")
                        .params(paramArray) 
                        .query(Word.class)
                        .single();
    }
}
