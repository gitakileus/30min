import os
import re
import json
import time
import argparse
from urllib import request, parse
from dotenv import load_dotenv
from spellchecker import SpellChecker

ignore_words = {
    't',     
    '30mins',     
    'sdk',     
    't',     
    'whitelist',     
    'blacklist',     
    'faq',     
    'optionally',     
    's',     
    'ccs',     
    'url',     
    'inviter',     
    'urls',     
    'licensors',     
    'consultancies',     
    'accredits',     
    'https',     
    '1st',     
    '3rd',     
    'pc',     
    'taxid',     
    'whitepaper',     
    'integration',     
    'integrations',     
    'cvc',     
    '24h',     
    '1mb',     
    'prev',     
    'www',     
    'cc',     
    'sms',     
    'timezone',     
    'ebook',     
    'otp',     
    '30min',     
    '30mins',     
    'webex',     
    'inperson',
    'onphone',
    'linkedin'
}

INDENTATION_DEFAULT = 2

#
# we will load all files in en
#
# we will check if value is spelled right
#
#

groups = ["common.json", "setting.json" , "page.json", "profile.json" , "meeting.json", "event.json"]

if __name__ == "__main__":

# 
# load all english data
#
    spell = SpellChecker()
    en_data = {}
    for group in groups:
        full_file_path = "../locales/" + "en" + "/" + group
        # full_file_path = "en" + "/" + group
        with open(full_file_path) as json_file:
            en_data[group] = json.load(json_file)
        for key in en_data[group].keys():
            text = en_data[group][key]
            misspelled = spell.unknown(spell.split_words(text))
            found_bad_spelling = False
            if misspelled:
                for val in misspelled:
                    if (val not in ignore_words):
                        found_bad_spelling = True
            if found_bad_spelling:
                print("Group: %s Key: %s has Misspelled %s value %s" % (group, key, misspelled, text)) 
