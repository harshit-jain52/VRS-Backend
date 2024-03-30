import pandas as pd
import numpy as np
from rake_nltk import Rake
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer
import string
from tqdm import tqdm

df = pd.read_csv('movies.csv')
df.dropna(subset=['Plot', 'Genre', 'Actors', 'Director'], inplace=True)
df['Plot'] = df['Plot'].str.translate(str.maketrans('', '', string.punctuation))
r = Rake()
keywords = []
for index, row in df.iterrows():
    r.extract_keywords_from_text(row['Plot'])   # to extract key words
    key_words_dict_scores = r.get_word_degrees()    # to get dictionary with key words and their similarity scores
    keywords.append(list(key_words_dict_scores.keys()))   # to assign it to new column
df['Key_words'] = keywords
df['Genre'] = df['Genre'].map(lambda x: x.split(','))
df['Actors'] = df['Actors'].map(lambda x: x.split(',')[:3])
df['Director'] = df['Director'].map(lambda x: x.split(','))

# create unique names by merging firstname & surname into one word, & convert to lowercase
genres = []; actors = []; directors = []
for index, row in df.iterrows():
    genres.append([x.lower().replace(' ','') for x in row['Genre']])
    actors.append([x.lower().replace(' ','') for x in row['Actors']])
    directors.append([x.lower().replace(' ','') for x in row['Director']])

df['Genre'] = genres
df['Actors'] = actors
df['Director'] = directors

df['Bag_of_words'] = ''
columns = ['Genre', 'Director', 'Actors', 'Key_words']

bows = []
for index, row in df.iterrows():
    words = ''
    for col in columns:
        words += ' '.join(row[col]) + ' '
    bows.append(words)

df['Bag_of_words'] = bows
df = df[['Title','Bag_of_words']]

count = CountVectorizer()
count_matrix = count.fit_transform(df['Bag_of_words'])
cosine_sim = cosine_similarity(count_matrix, count_matrix)

indices = pd.Series(df['Title'])

def recommend(title, cosine_sim = cosine_sim):
    recommended_movies = []
    idx = indices[indices == title].index[0]   # to get the index of the movie title matching the input movie
    score_series = pd.Series(cosine_sim[idx]).sort_values(ascending = False)   # similarity scores in descending order
    top_10_indices = list(score_series.iloc[1:11].index)   # to get the indices of top 6 most similar movies

    for i in top_10_indices :   # to append the titles of top 10 similar movies to the recommended_movies list
        recommended_movies.append(list(df['Title'])[i])

    return recommended_movies

print(recommend('The Dark Knight Rises'))
