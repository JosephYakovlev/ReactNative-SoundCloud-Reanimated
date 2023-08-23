from flask import Flask, request, jsonify
from itertools import zip_longest
import re
import calendar
import os
import spacy
import json
import pandas as pd
from tqdm import tqdm
from spacy.tokens import DocBin
# from sbert_punc_case_ru import SbertPuncCase
from natasha import Segmenter, MorphVocab, NewsEmbedding, NewsMorphTagger, Doc
from datetime import datetime, timedelta

app = Flask(__name__)
nlp1 = spacy.load('./output/model-best')
nlp2 = spacy.load('./sen/model-best')
# model = SbertPuncCase()
segmenter = Segmenter()
morph_vocab = MorphVocab()
emb = NewsEmbedding()
morph_tagger = NewsMorphTagger(emb)

months_ru = {
    'январь': 1, 'февраль': 2, 'март': 3, 'апрель': 4,
    'май': 5, 'июнь': 6, 'июль': 7, 'август': 8,
    'сентябрь': 9, 'октябрь': 10, 'ноябрь': 11, 'декабрь': 12
}

# def format_datetime(dt):
#     formatted_date = dt.strftime('%Y-%m-%dT%H:%M:%S.%f') + 'Z'
#     return formatted_date
   

def parse_time(input_dates, dayTimes):
    output_date = [] 
    output_dates_24h = [] 

    minutes_to_add = 0  # Инициализируем переменную для добавления минут
    print('116')
    for date in input_dates:
    # Удаляем пробелы между цифрой и двоеточием
        formatted_date = date.replace(' : ', ':')
        output_date.append(formatted_date)
    print(output_date)

    for date in output_date:
        # Проверяем, содержит ли строка минуты (поиск "минут")
        print(17)
        if 'минута' not in date:
            # Если строка не содержит минут, проверяем, имеет ли она формат "00:00"
            if re.match(r'\d{2}:\d{2}', date):
                # Если имеет формат "00:00", добавляем строку без изменений
                output_dates_24h.append(date)
            else:
                # Если нет формата "00:00", добавляем ":00" к числу
                # и затем добавляем в результирующий массив
                parts = date.split(' ')
                for i, part in enumerate(parts):
                    if part.isdigit():
                        parts[i] += ':00'
                new_date = ' '.join(parts)
                output_dates_24h.append(new_date)
        else:
            # Если строка содержит "минут", добавляем ее в результирующий массив без изменений
            output_dates_24h.append(date)

    print('117')
    print(output_dates_24h)
    output_dates = []

    for index, date in enumerate(output_dates_24h):
        if 'минут' in date:
            # Проверяем, содержит ли строка минуты (поиск "минут")
            print(20)
            match = re.search(r'(\d{2}) минута', date)
            if match:
                mins = int(match.group(1))
                print('145')
                print(mins)
                print(index)
                # Прибавляем минуты к предыдущему элементу списка
                if index > 0:
                    prev_date = output_dates[index - 1]
                    if re.match(r'\d{1,2}', prev_date):
                        # Если предыдущий элемент имеет формат "00 часов", добавляем минуты
                        prev_match = re.match(r'(\d{1,2}):(\d{1,2})', prev_date)
                        print('12312')
                        print(prev_match)
                        prev_hours = int(prev_match.group(1))
                        print(prev_hours)
                        new_hours = prev_hours + mins // 60
                        new_minutes = mins % 60
                        new_date = f'{new_hours:02d}:{new_minutes:02d}'
                        output_dates[index - 1] = new_date
                    else:
                        # Если предыдущий элемент не имеет формат "00 часов", оставляем без изменений
                        output_dates.append(date)
                else:
                    # Если минуты идут первыми, оставляем без изменений
                    output_dates.append(date)
            else:
                # Если не найдены минуты, оставляем без изменений
                output_dates.append(date)
        else:
            # Если строка не содержит "минут", оставляем без изменений
            output_dates.append(date)

    

# Пример использования:







        # for date in output_dates:
        #     # Проверяем, содержит ли строка минуты (поиск "минут")
        #     print(20)
        #     if 'минут',index in date:
        #         let mins = date.match.r'\d{2}: // вычленяем 10 из 10 минут например или 25 изи 25 минут
        #         output_dates(index-1) = output_dates(index-1).match.r'\d{2} + ':' + mins // прибавляем к вычленным часам вычлененные минуты из строки которая находится в массиве перед нашей строкой минуты 

    newTimes = []

    print(112312312312312315777)
    print(output_dates)
    print(dayTimes)
    for t, dt in zip(output_dates, dayTimes):
        # Разбиваем время на часы и минуты
        hours, minutes = t.split(':')
        hours = int(hours)
        print(116422)
        print(output_dates)
        print(t)
        print(dt)
        if 'день' in dt:
            if hours < 10:
                newTimes.append(f'{hours + 12}:{minutes}')
            else:
                newTimes.append(f'{hours}:{minutes}')
        elif 'вечер' in dt:
            if hours < 13:
                newTimes.append(f'{hours + 12}:{minutes}')
            else:
                newTimes.append(f'{hours}:{minutes}')
        elif 'ночь' in dt:
            if 7 <= hours < 13:
                newTimes.append(f'{hours + 12}:{minutes}')
            else:
                newTimes.append(f'{hours}:{minutes}')
        else: 
            newTimes.append(f'{hours}:{minutes}')

    print('118')  
    print(newTimes)  
    answerTime = newTimes if len(newTimes) > 0 else output_dates

    return answerTime



def parse_date(LEMMADATE, LEMMAPREFIX):

    print('STRTED DATE PARSING')
    print(LEMMAPREFIX)
    weekdays = ['понедельник', 'вторник', 'среду', 'четверг', 'пятницу', 'субботу', 'воскресенье']
    answerDates = []
    print(LEMMADATE)
    for date in LEMMADATE:
        print('STRTED DATE PARSING')
        print(date)
        input_text = date
        print(input_text)
        current_time_UTC = datetime.utcnow()
        current_time = current_time_UTC + timedelta(hours=3)
        if 'день' == input_text:     
            answerDates.append('0 день')
        elif 'сегодня' in input_text:     
            answerDates.append(current_time)
        elif 'месяц' == input_text:
            answerDates.append('1 месяц')
        elif 'год' == input_text:
            answerDates.append('1 год')
        elif 'неделя' == input_text:
            answerDates.append('1 неделя')
        elif 'завтра' == input_text:
            new_date = current_time + timedelta(days=1)
            answerDates.append(new_date.isoformat())
        elif 'послезавтра' == input_text:
            print('16')
            new_date = current_time + timedelta(days=2)
            print(new_date)
            answerDates.append(new_date.isoformat())
        elif any(day in input_text for day in weekdays):
            target_day = next((day for day in weekdays if day in input_text), None)

            if target_day and LEMMAPREFIX != 'следующий':
                print('не следующий')
                weekday_idx = weekdays.index(target_day)
                print(weekday_idx)
                days_until_target_day = (weekday_idx - current_time.weekday()) % 7
                print(days_until_target_day)
                answer_date = current_time + timedelta(days=days_until_target_day)
                print(answer_date)
                answerDates.append(answer_date.isoformat())
            elif target_day and LEMMAPREFIX == 'следующий':
                print('следующий')
                weekday_idx = weekdays.index(target_day)
                print(weekday_idx)
                days_until_target_day = (weekday_idx - current_time.weekday()) % 7
                print(days_until_target_day)
                answer_date = current_time + timedelta(days=days_until_target_day+7)
                print(answer_date)
                answerDates.append(answer_date.isoformat())
        elif re.match(r'^(\d+) (\w+)$', input_text):
            match = re.match(r'^(\d+) (\w+)$', input_text)
            day = int(match.group(1))
            month_name = match.group(2).lower()  # Приводим месяц к нижнему регистру
            if month_name in months_ru:
                month_number = months_ru[month_name]
                current_time = datetime.now()
                current_year = current_time.year
                if current_time.month > month_number:
                    current_year += 1
                target_date = datetime(current_year, month_number, day)
                answerDates.append(target_date.isoformat())
            else:
                answerDates.append(input_text)
        else:
            answerDates.append(input_text)
    return answerDates

@app.route('/process', methods=['POST'])
def process_text():

    data = request.get_json()

    # print(data)
    if data and 'text' in data:
        received_text1 = data['text']

        

        senData = nlp2(received_text1)

        print('232')
        print(senData.ents)

        entities_dict1 = {}

            # Итерация по сущностям в doc и добавление их в entities_dict
        for ent in senData.ents:
            entity_type = ent.label_
            entity_value = ent.text
            print('334')
            print(entity_type)
            print(entity_value)
            # Если ключ сущности уже существует в словаре, добавляем значение в список
            if entity_type in entities_dict1:
                entities_dict1[entity_type].append(entity_value)
            else:
                # Если ключ сущности не существует, создаем новую запись с ключом и значением в виде списка
                entities_dict1[entity_type] = [entity_value]
        print('323')
        print(entities_dict1)

        # # received_text1 = re.sub(r'(\d+:00) и', r'\1 как бы.', received_text1)
        # print
        # # newtext = model.punctuate(entities_dict1)

        # print(newtext)
        # data2 = newtext.split(". ")
        # print(data2)

        lemmatizedSpeeches = []

        for received_text in entities_dict1['SENTENCE']:
            print(received_text)

            # Создание нового объекта Doc для обработки текста
            doc = nlp1(received_text)
            print('515')
            print(doc.ents)
            
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
            if 'LEMMDATE' in entitiesAnswer:
                lemmadate_value = entitiesAnswer['LEMMDATE']  # Получаем значение LEMMDATE из словаря
                lemmadate_prefix = entitiesAnswer['LEMMPREFX'][0] if 'LEMMPREFX' in entitiesAnswer else 'без префикса'  # Получаем значение LEMMAPREFIX из словаря
                parsed_date = parse_date(lemmadate_value, lemmadate_prefix)  # Применяем функцию parse_date
                if parsed_date is not None:  # Проверяем, что parse_date не вернула None
                    entitiesAnswer['DATE'] = parsed_date  # Добавляем полученную дату в словарь
            print('1112')
            if 'LEMMTIME' in entitiesAnswer:
                lemmadate_value = entitiesAnswer['LEMMTIME']  # Получаем значение LEMMDATE из словаря
                lemmadate_daytime = entitiesAnswer['LEMMDAYTIME'] if 'LEMMDAYTIME' in entitiesAnswer else []  # Получаем значение LEMMAPREFIX из словаря
                print('12121235')
                parsed_time = parse_time(lemmadate_value, lemmadate_daytime)  # Применяем функцию parse_date
                print('1212123599')
                if parsed_time is not None:  # Проверяем, что parse_date не вернула None
                    entitiesAnswer['TIME'] = parsed_time  # Добавляем полученную дату в словарь
            print('parsed')
            print(entitiesAnswer)

            lemmatizedSpeeches.append(entitiesAnswer)
            


        return jsonify(lemmatizedSpeeches), 200




if __name__ == '__main__':
    app.run(host='0.0.0.0')
