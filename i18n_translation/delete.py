import os
import re
import json
import time
import argparse
from urllib import request, parse
from dotenv import load_dotenv

DEEPL_API_ENDPOINT = 'https://api-free.deepl.com/v2/translate'
SLEEP_BETWEEN_API_CALLS = 0.2 # Seconds
INDENTATION_DEFAULT = 2

def translate_string(text, target_locale):
    """
    test with curl:
    $ curl https://api-free.deepl.com/v2/translate -d auth_key=YOUR-API-KEY-HERE -d "text=Hello, world!" -d "target_lang=ES"
    """
    if type(text) != type(str()):
        return text

    data = parse.urlencode({
        'target_lang' : target_locale,  
        'auth_key' : os.environ.get('DEEPL_AUTH_KEY'),
        'text': text,
    }).encode()
    req = request.Request(DEEPL_API_ENDPOINT, data=data)
    response = request.urlopen(req)

    if response.status != 200:
        print(f'{text}  ->  ERROR (response status {response.status})')
        return text

    response_data = json.loads(response.read())

    if not 'translations' in response_data:
        print(f'{text}  ->  ERROR (response empty {response_data})')
        return text

    print(text, ' -> ', response_data['translations'][0]['text'])

    if len(response_data['translations']) > 1:
        print(f"({text}) More than 1 translation: {response_data['translations']}")
    
    return decode_text(response_data['translations'][0]['text'])

def decode_text(text):
    return str(text)

def save_results_file(data, output_file, indent):
    """
    Write output file
    """
    with open(output_file, 'w') as file:
        json.dump(data, file, indent=indent)
    
    print(f"Results saved on {output_file}")


#
# we will load all files except en
#
# we will delete all keys that match the "tobedeleted" 
#

groups = ["common.json", "setting.json" , "page.json", "profile.json" , "meeting.json", "event.json"]
locales = ["es", "pt", "it", "ro"]

if __name__ == "__main__":
    load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env'))

    if not os.environ.get('DEEPL_AUTH_KEY', False):
        raise Exception('Environment variables not loaded')
# 
# load all to be deleted data
#
    en_data = {}
    for group in groups:
        full_file_path = "./tobedeleted" + "/" + group
        with open(full_file_path) as json_file:
            print ("Loading %s %s" % (group, full_file_path))
            en_data[group] = json.load(json_file)

    for locale in locales:
        for group in groups:
            full_file_path = "./locale/" + locale + "/" + group
            full_file_path = "../locales/" + locale + "/" + group
            with open(full_file_path) as json_file:
                locale_data = json.load(json_file)
                for key in en_data[group].keys():
                    if not key in locale_data:
                        print("%s %s is already missing in %s" % (group, key, locale))
                    else:
                        print("Deleting %s %s from %s" % (group, key, locale))
                        locale_data.pop(key)
            with open(full_file_path, 'w') as file:
                json.dump(locale_data, file, indent=INDENTATION_DEFAULT)


