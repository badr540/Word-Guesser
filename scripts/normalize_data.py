import csv
import re

dictionary_rarities = {}

#(rank, rarity level)
RARITY_THRESHOLDS = [
    (5000, 0),   
    (10000, 1),
    (20000, 2),  
    (float('inf'), 3) 
]

MAX_WORDS_TO_PROCESS = 50000 #only using the 50k most common words

def get_rarity(rank):
    for threshold, rarity in RARITY_THRESHOLDS:
      if rank < threshold:
        return rarity
    return 3  

pattern = re.compile(r'^[a-z]+$')
#read and add all english words into our map and initalize all words with -1 (unscored)
with open('english_dictionary.csv',encoding='utf-8', mode='r') as file:
    csv_reader = csv.reader(file)
    for row in csv_reader:
        word = row[0].lower()
        if(pattern.fullmatch(word)): #making sure to fulfil the check in our db table
            dictionary_rarities[word] = -1

#score all the words that exist in the frequency list
with open('english_word_frequency.csv', encoding='utf-8', mode='r') as file:
    csv_reader = csv.reader(file)
    rank = 0
    for row in csv_reader:
        rank+= 1
        if rank > MAX_WORDS_TO_PROCESS: break
        rarity = get_rarity(rank)
        word = row[0].lower()
        if(word in dictionary_rarities):
            dictionary_rarities[row[0]] = rarity

#store both the scored and unscored words
#unscored words are still needed to determine legal words in the app
sql_values = [
    f"('{word}', {rarity})" 
    for word, rarity in dictionary_rarities.items()
]

with open("data.sql", "w", encoding='utf-8') as file:
    file.write("INSERT INTO words (word, rarity) VALUES\n")
    file.write(",\n".join(sql_values) + ";")