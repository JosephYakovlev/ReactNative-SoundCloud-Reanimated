from flask import Flask, request, jsonify
import re
import calendar
import os
import spacy
import json
import pandas as pd
from tqdm import tqdm
from spacy.tokens import DocBin
from sbert_punc_case_ru import SbertPuncCase
from natasha import Segmenter, MorphVocab, NewsEmbedding, NewsMorphTagger, Doc
from datetime import datetime, timedelta

app = Flask(__name__)
nlp1 = spacy.load('./output/model-best')
model = SbertPuncCase()
segmenter = Segmenter()
morph_vocab = MorphVocab()
emb = NewsEmbedding()
morph_tagger = NewsMorphTagger(emb)


# def format_datetime(dt):
#     formatted_date = dt.strftime('%Y-%m-%dT%H:%M:%S.%f') + 'Z'
#     return formatted_date

# def parse_time(input_text, prefix):
#     current_time = datetime.utcnow()
#     if 'день' in input_text:     
#         return '0 день'
#     elif 'сегодня' in input_text:     
#         return current_time
#     elif 'месяц' in input_text:
#         return '1 месяц'
#     elif 'год' in input_text:
#         return '1 год'
#     elif 'неделя' in input_text:
#         return '1 неделя'
#     elif 'завтра' in input_text:
#         return current_time + timedelta(days=1)
#     elif 'послезавтра' in input_text:
#         return current_time + timedelta(days=2)
#     #    если на следующей то вернем массив
#     #    если через раньше или позже 
#     #    если до конца то вернем массив
#     # elif 'раньше' in input_text:
#     #     hours_offset = int(input_text.split(' ')[0])
#     #     return current_time - timedelta(hours=hours_offset)
#     # elif 'позже' in input_text:
#     #     hours_offset = int(input_text.split(' ')[0])
#     #     return current_time + timedelta(hours=hours_offset)
#     elif any(day in input_text for day in ['понедельник', 'вторник', 'среду', 'четверг', 'пятницу', 'субботу', 'воскресенье']) and LEMMAPREFIX != 'следующий':
#         match = re.match(r'^в (.*?)([а-яё]+)$', input_text)
#         target_day = match.group(1)
#         weekdays = ['понедельник', 'вторник', 'среду', 'четверг', 'пятницу', 'субботу', 'воскресенье']
#         weekday_idx = weekdays.index(target_day)
#         days_until_target_day = (weekday_idx - current_time.weekday()) % 7
#         return current_time + timedelta(days=days_until_target_day)
#     elif any(day in input_text for day in ['понедельник', 'вторник', 'среду', 'четверг', 'пятницу', 'субботу', 'воскресенье']) and LEMMAPREFIX == 'следующий':
#         match = re.match(r'^в (.*?)([а-яё]+)$', input_text)
#         target_day = match.group(1)
#         weekdays = ['понедельник', 'вторник', 'среду', 'четверг', 'пятницу', 'субботу', 'воскресенье']
#         weekday_idx = weekdays.index(target_day)
#         days_until_target_day = (weekday_idx - current_time.weekday()+ 7) % 7
#         return current_time + timedelta(days=days_until_target_day)
#     elif re.match(r'^(\d+) (\w+)$', input_text):
#         match = re.match(r'^(\d+) (\w+)$', input_text)
#         day = int(match.group(1))
#         month_name = match.group(2)
#         month_number = list(calendar.month_abbr).index(month_name.capitalize())
#         current_year = current_time.year
#         if current_time.month > month_number:
#             current_year += 1
#         target_date = datetime(current_year, month_number, day)
#         return target_date
#     else:
#         return None


def parse_date(LEMMADATE, LEMMAPREFIX):
    input_text = LEMMADATE
    current_time = datetime.utcnow()
    if 'день' == input_text:     
        return '0 день'
    elif 'сегодня' in input_text:     
        return current_time
    elif 'месяц' in input_text:
        return '1 месяц'
    elif 'год' in input_text:
        return '1 год'
    elif 'неделя' in input_text:
        return '1 неделя'
    elif 'завтра' in input_text:
        return (current_time + timedelta(days=1)).isoformat()
    elif 'послезавтра' in input_text:
        return (current_time + timedelta(days=1)).isoformat()
    elif any(day in input_text for day in ['понедельник', 'вторник', 'среду', 'четверг', 'пятницу', 'субботу', 'воскресенье']) and LEMMAPREFIX != 'следующий':
        match = re.match(r'^в (.*?)([а-яё]+)$', input_text)
        target_day = match.group(1)
        weekdays = ['понедельник', 'вторник', 'среду', 'четверг', 'пятницу', 'субботу', 'воскресенье']
        weekday_idx = weekdays.index(target_day)
        days_until_target_day = (weekday_idx - current_time.weekday()) % 7
        return (current_time + timedelta(days=1)).isoformat()
    elif any(day in input_text for day in ['понедельник', 'вторник', 'среду', 'четверг', 'пятницу', 'субботу', 'воскресенье']) and LEMMAPREFIX == 'следующий':
        match = re.match(r'^в (.*?)([а-яё]+)$', input_text)
        target_day = match.group(1)
        weekdays = ['понедельник', 'вторник', 'среду', 'четверг', 'пятницу', 'субботу', 'воскресенье']
        weekday_idx = weekdays.index(target_day)
        days_until_target_day = (weekday_idx - current_time.weekday()+ 7) % 7
        return (current_time + timedelta(days=1)).isoformat()
    elif re.match(r'^(\d+) (\w+)$', input_text):
        match = re.match(r'^(\d+) (\w+)$', input_text)
        day = int(match.group(1))
        month_name = match.group(2)
        if month_name.capitalize() in calendar.month_abbr:
            month_number = list(calendar.month_abbr).index(month_name.capitalize())
            current_year = current_time.year
            if current_time.month > month_number:
                current_year += 1
            target_date = datetime(current_year, month_number, day)
            return target_date.isoformat()
        else:
            return input_text(current_time + timedelta(days=1)).isoformat()
    else:
        return input_text


@app.route('/process', methods=['POST'])
def process_text():

    data = request.get_json()

    # print(data)
    if data and 'text' in data:
        received_text1 = data['text']
        received_text1 = re.sub(r'(\d+:00) и', r'\1 как бы.', received_text1)
        print
        newtext = model.punctuate(received_text1)

        print(newtext)
        data2 = newtext.split(". ")
        print(data2)

        lemmatizedSpeeches = []

        for received_text in data2:
            print(received_text)

            # Создание нового объекта Doc для обработки текста
            doc = nlp1(received_text)
            
            # Создание пустого словаря
            entities_dict = {}

            # Итерация по сущностям в doc и добавление их в entities_dict
            for ent in doc.ents:
                entity_type = ent.label_
                entity_value = ent.text

                # Если ключ сущности уже существует в словаре, добавляем значение в список
                if entity_type in entities_dict:
                    entities_dict[entity_type].append(entity_value)
                else:
                    # Если ключ сущности не существует, создаем новую запись с ключом и значением в виде списка
                    entities_dict[entity_type] = [entity_value]
            print('323')
            print(entities_dict)
            print('414')
            lemmatized_entities = {}
            for entity_type, entity_values in entities_dict.items():
                lemmatized_values = []
                for entity_value in entity_values:
                    entity_doc = Doc(entity_value)
                    entity_doc.segment(segmenter)
                    entity_doc.tag_morph(morph_tagger)
                    for token in entity_doc.tokens:
                        token.lemmatize(morph_vocab)
                    lemmatized_value = " ".join(token.lemma for token in entity_doc.tokens)
                    lemmatized_values.append(lemmatized_value)
                lemmatized_entities[f"LEMM{entity_type}"] = lemmatized_values

            print('777')
            print(entities_dict)
            print('888')
            print(lemmatized_entities)
  
            entitiesAnswer = entities_dict.copy()  # Создаем копию исходного словаря
            entitiesAnswer.update(lemmatized_entities)  
            print('999')
            print(entitiesAnswer)
            entitiesAnswer['PREFIX'] = ['через']
            entitiesAnswer['LEMMPREFIX'] = ['через']
            if 'LEMMDATE' in entitiesAnswer:
                lemmadate_value = entitiesAnswer['LEMMDATE'][0]  # Получаем значение LEMMDATE из словаря
                lemmadate_prefix = entitiesAnswer['LEMMPREFIX'][0] if 'LEMMPREFIX' in entitiesAnswer else 'без префикса'  # Получаем значение LEMMAPREFIX из словаря
                parsed_date = parse_date(lemmadate_value, lemmadate_prefix)  # Применяем функцию parse_date
                if parsed_date is not None:  # Проверяем, что parse_date не вернула None
                    entitiesAnswer['DATE'] = [parsed_date]  # Добавляем полученную дату в словарь
            print('parsed')
            print(entitiesAnswer)

            lemmatizedSpeeches.append(entitiesAnswer)
            


        return jsonify(lemmatizedSpeeches), 200




if __name__ == '__main__':
    app.run(host='0.0.0.0')
