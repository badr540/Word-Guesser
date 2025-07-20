package com.words.wordpuzzles.gamesessions;

public class InvalidWordException extends RuntimeException {
    public InvalidWordException(String word) {
        super("The word '" + word + "' is not valid");
    }
}