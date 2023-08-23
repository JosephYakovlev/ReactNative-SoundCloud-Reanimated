# !pip install spacy
# !python -m spacy download ru_core_news_sm
# !pip install spacy-legacy
# !pip install tqdm

import json
import pandas as pd
import os
from tqdm import tqdm
import spacy
from spacy.tokens import DocBin
from spacy import displacy
# from google.colab import drive


# drive.mount('/content/drive')

text = "можешь пожалуйста перенести задачу василия петровича помыть полы завтра в 12:00 на послезавтра на 10:00"


training_data_path = './annotations-4.json'
with open(training_data_path, 'r') as f:
    training_data = json.load(f)

print(training_data)


train_data = training_data['annotations']
train_data = [tuple(i) for i in train_data]

#nlp = spacy.blank("en") # load a new spacy model
nlp = spacy.load("ru_core_news_sm") # load other spacy model

db = DocBin() # create a DocBin object

for text, annot in tqdm(train_data): # data in previous format
    doc = nlp.make_doc(text) # create doc object from text
    ents = []
    for start, end, label in annot["entities"]: # add character indexes
        span = doc.char_span(start, end, label=label, alignment_mode="contract")
        if span is None:
            print("Skipping entity")
        else:
            ents.append(span)
    doc.ents = ents # label the text with the ents
    db.add(doc)

db.to_disk("./new/train.spacy") # save the docbin object

# %cd /content/drive/MyDrive/AI
# !python -m spacy train config.cfg --output ./output --paths.train ./train.spacy --paths.dev ./train.spacy

nlp1 = spacy.load('./output/model-best') #load the best model
doc = nlp1("можешь пожалуйста перенести задачу василия петровича помыть полы завтра в 12:00 дня на послезавтра на 10:00 вечера позже")

print(doc)

# Create an empty list to store the entities
entities_list2 = []

# Iterate through the entities in the doc
for ent in doc.ents:
    # Append a dictionary with the entity type and its value to the list
    entities_list2.append({
        'entity_type': ent.label_,
        'value': ent.text
    })

# Print the list of entities
print(entities_list2)

entities_list2 = []

# Iterate through the entities in the doc
for ent in doc.ents:
    # Append a list [entity_type, value] to the entities_list
    entities_list2.append([ent.label_, ent.text])

# Print the list of entities
print(entities_list2)

entities_list = []

# Iterate through the entities in the doc and append to entities_list
for ent in doc.ents:
    entities_list.append([ent.label_, ent.text])

# Create counters for each field
per_count = 0
date_count = 0
time_count = 0
act_count = 0
prefx_count = 0
create_count = 0
task_count = 0
daytime_count = 0

# Count how many times each field appears in the entities_list
for entity in entities_list:
    if entity[0] == "PER":
        per_count += 1
    elif entity[0] == "DATE":
        date_count += 1
    elif entity[0] == "TIME":
        time_count += 1
    elif entity[0] == "ACT":
       act_count += 1
    elif entity[0] == "PREFX":
        prefx_count += 1
    elif entity[0] == "CREATE":
        create_count += 1
    elif entity[0] == "TASK":
        task_count += 1
    elif entity[0] == "DAYTIME":
        daytime_count += 1
        "PER","DATE","TIME","ACT","PREFX","CREATE","TASK","DAYTIME"

# Print the counts for each field
print("ACT count:", act_count)
print("PER count:", per_count)
print("TASK count:", task_count)
print("DATE count:", date_count)
print("TIME count:", time_count
print("PREFX count:", prefx_count)
print("CREATE count:", create_count)
print("DAYTIME count:", daytime_count))


displacy.render(doc, style="ent")
spacy.displacy.render(doc, style="ent", jupyter=True)
