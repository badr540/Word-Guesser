import csv

sum_frequencies = 0
max_freq = 0
min_freq = 0
# Reading a CSV file
counter = 0
with open('unigram_freq.csv', mode='r') as file:
    csv_reader = csv.reader(file)
    with open("output.txt", "w") as file:

        file.write("INSERT INTO words (word, difficulty) VALUES \n")
        for row in csv_reader:
            counter+= 1
            dif = ''
            if counter < 5000:
                dif = "easy"
            elif counter < 10000:
                dif = "normal"
            elif counter < 15000:
                dif = "hard"
            elif counter < 25000:
                dif = "impossible"
            else:
                break
            
            file.write("(\'" + row[0] + "\',\'" +  dif + "\'),\n")
