import csv

word_freq = {}

with open('ngram_freq.csv', encoding='utf-8', mode='r') as file:
    csv_reader = csv.reader(file)
    counter = 0
    for row in csv_reader:
        counter+= 1
        if counter < 15000:
            rarity = 0
        elif counter < 25000:
            rarity = 1
        elif counter < 50000:
            rarity = 2
        else:
            rarity = 3

        word_freq[row[0]] = rarity


with open('dict.csv',encoding='utf-8', mode='r') as file:
    csv_reader = csv.reader(file)
    with open("output.txt", "w") as file:

        file.write("INSERT INTO words (word, rarity) VALUES \n")
        for row in csv_reader:
            if row[0] in word_freq:
                file.write("(\'" + row[0] + "\'," +  str(word_freq[row[0]]) + "),\n")
