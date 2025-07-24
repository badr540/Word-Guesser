package com.badrm.wordguesser.words;
import java.util.Optional;

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

    public Word getRandomWord(Integer wordLength, Integer rarity){

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
        Object[] paramArray = params.toArray(new Object[0]);

        return jdbcClient.sql(sql.toString() + "ORDER BY RANDOM() LIMIT 1 ;")
        .params(paramArray) 
        .query(Word.class)
        .single();
    }


    public boolean isWordReal(String word){

        Optional<Word> output =  jdbcClient.sql("SELECT * FROM words WHERE word = ? LIMIT 1 ;")
        .param(word) 
        .query(Word.class)
        .optional();

        return output.isPresent();
    }
}
