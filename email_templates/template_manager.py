import os
from sendgrid import SendGridAPIClient
import json
from py_w3c.validators.html.validator import HTMLValidator
import re
import getopt
import sys
from html.parser import HTMLParser
from python_http_client.exceptions import HTTPError

tag_stack = []
tag_linenum_stack = []
error_count = 0
error_unclosed_tags = []
error_unclosed_tags_linenum = []
error_unexpected_tags = []
allowed_unclosed_tags = ['area' , 'base' , 'br' , 'col' , 'command' , 'embed' , 'hr' , 'img' , 'input' , 'keygen' , 'link' , 'meta' , 'param' , 'source' , 'track' , 'wbr']
error_data = ''
error_line = 0
error_original_tag_linenum = 0
testfile_only = False

#
# gets all templates from sendgrid and saves them in local files
# each template has three files
#   <template_id>-<template-name>.info
#   <template_id>-<template-name>.subject
#   <template_id>-<template-name>.body
#
def get_templates():
    global testfile_only

    sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
    params = {'generations': 'dynamic', 'page_size': 100}
    response = sg.client.templates.get(
        query_params=params
    )

    if (response.status_code != 200):
        print("Error in API Call")
        exit(0)

    try:
        my_json = response.body.decode('utf8')
        templates = json.loads(my_json)
    except:
        print ("Failed to parse all templates response")

    num = 0
    for template in templates["result"]:
        if (testfile_only and (template["name"] != "ForTestingOnly")):
            continue
        num = num + 1
        try:
            print (template["id"], " ", template["name"] + " " + ".subject")
            template_id = template["id"]
            subject = template["versions"][0]["subject"]
            f = open(template_id + "-" + template["name"] + ".subject", "w")
            f.write(subject)
            f.close()
        except Exception as e: 
            print ("Failed to get subject for ", template["id"], " ", template["name"])
            print(e)
        try:
            print (template["id"], " ", template["name"] + " " + ".info")
            template_id = template["id"]
            info = ""
            info = info + template["updated_at"] + "\n"
            for version_info in template["versions"]:
                info = info + "id:          " + version_info["id"] + "\n"
                info = info + "template_id: " + version_info["template_id"] + "\n"
                info = info + "active:      " + str(version_info["active"]) + "\n"
                info = info + "updated_at:  " + version_info["updated_at"]
            print(info)
            f = open(template_id + "-" + template["name"] + ".info", "w")
            f.write(info)
            f.close()
        except Exception as e: 
            print ("Failed to get subject for ", template["id"], " ", template["name"])
            print(e)
        try:
            print (template["id"], " ", template["name"] + " " + ".body")
            response2 = sg.client.templates._(template_id).get()
            body = response2.body.decode('utf8')
            #body = response2.body.decode('utf8').replace("'", '"')
            body_json = json.loads(body)
            body_html = body_json["versions"][0]["html_content"]
            f = open(template_id + "-" + template["name"] + ".body", "w")
            f.write(body_html)
            f.close()
        except Exception as e: 
            print ("Failed to get body for ", template["id"], " ", template["name"])
            print(e)


class MyHTMLParser(HTMLParser):
    global tag_stack
    global tag_linenum_stack
    global error_unclosed_tags
    global error_unclosed_tags_linenum
    global error_unexpected_tags
    global error_original_tag_linenum
    global error_data

    def handle_starttag(self, tag, attrs):
        global tag_stack
        global tag_linenum_stack
        global error_count
        global error_unclosed_tags
        global error_unclosed_tags_linenum
        global error_unexpected_tags
        global error_original_tag_linenum
        global error_data

        #print("append: ", tag)
        if (tag not in allowed_unclosed_tags):
            tag_stack.append(tag)
            tag_line = self.getpos()
            tag_linenum_stack.append(tag_line)
            #print("Got tag: " + tag + " " + "at line: " + str(tag_line))

    def handle_endtag(self, tag):
        global tag_stack
        global tag_linenum_stack
        global error_count
        global error_unclosed_tags
        global error_unclosed_tags_linenum
        global error_unexpected_tags
        global error_original_tag_linenum
        global error_data
        global error_line

        #print("got: ", tag)
        if (tag not in allowed_unclosed_tags):
            expected_tag = tag_stack.pop()
            error_original_tag_linenum = tag_linenum_stack.pop()
            if (expected_tag != tag):
                error_count = error_count + 1
                error_unclosed_tags.append(expected_tag)
                error_unclosed_tags_linenum.append(error_original_tag_linenum)
                error_line = self.getpos()
                tag_stack.append(expected_tag)
                tag_linenum_stack.append(error_original_tag_linenum)
                error_unexpected_tags.append(tag)

    def handle_data(self, data):
        global error_data
        global tag_stack
        global tag_linenum_stack

        if (not error_count):
            error_data = data
        return

#
# parses all templates in local files to see if html tags are proper
#
# verifies following files for each:
#   <template_id>-<template-name>.subject
#   <template_id>-<template-name>.body
#
def localparse_templates():
    global tag_stack
    global tag_linenum_stack
    global error_count
    global error_unclosed_tags
    global error_unclosed_tags_linenum
    global error_unexpected_tags
    global error_data
    global error_original_tag_linenum
    global testfile_only

    # iterating over all files
    dirname = '.'
    ext = ('.subject', 'body')
    num = 0
    for filename in os.listdir(dirname):
        if (testfile_only and ((filename != "d-b909e9ca11d142d78f6313b08e63e0e8-ForTestingOnly.body") and (filename != "d-b909e9ca11d142d78f6313b08e63e0e8-ForTestingOnly.subject"))):
            continue
        if ((not testfile_only) and (not filename.endswith(ext))):
            continue
        print("File: ", filename)
        try:
            text_file = open(filename, "r")
            data = text_file.read()
            text_file.close()
            tag_stack = []
            tag_linenum_stack = []
            error_count = 0
            error_unclosed_tags = []
            error_unclosed_tags_linenum = []
            error_unexpected_tags = []
            error_data = ''
            parser = MyHTMLParser()
            parser.feed(data)
            error_original_tag_linenum = 0
            if (error_count):
                num = num + 1
                print (filename + " has ERRORS")
                print("    First Unclosed Tag: ", error_unclosed_tags[0] + " at line: " + str(error_unclosed_tags_linenum[0]))
                unexpected_tag = error_unexpected_tags[0].strip()
                print("    First Unexpected Tag: /%s at line: %s" % (unexpected_tag, error_line))
            else:
                print (filename + " is GOOD. No errors")
        except Exception as e: 
            print("File: ", filename, " Errors: Failed to parse")
            print (e)
    return

#
# parses all templates in sendgrid directly to see if html tags are proper
#
# verifies following for each template:
#   subject
#   versions[0].html-content
#
def remoteparse_templates():
    global tag_stack
    global tag_linenum_stack
    global error_count
    global error_unclosed_tags
    global error_unclosed_tags_linenum
    global error_unexpected_tags
    global error_data
    global error_original_tag_linenum
    global testfile_only

    sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
    params = {'generations': 'dynamic', 'page_size': 100}
    response = sg.client.templates.get(
        query_params=params
    )

    if (response.status_code != 200):
        print("Error in API Call")
        exit(0)

    try:
        my_json = response.body.decode('utf8')
        templates = json.loads(my_json)
    except:
        print ("Failed to parse all templates response")

    num = 0
    for template in templates["result"]:
        if (testfile_only and (template["name"] != "ForTestingOnly")):
            continue
        num = num + 1
        try:
            template_id = template["id"]
            subject = template["versions"][0]["subject"]
            tag_stack = []
            tag_linenum_stack = []
            error_count = 0
            error_unclosed_tags = []
            error_unclosed_tags_linenum = []
            error_unexpected_tags = []
            error_data = ''
            parser = MyHTMLParser()
            parser.feed(subject)
            error_original_tag_linenum = 0
            if (error_count):
                num = num + 1
                print (template["id"], " ", template["name"] + " " + ".subject" + " has ERRORS")
                print("First Unclosed Tag: ", error_unclosed_tags[0] + " at line: " + str(error_unclosed_tags_linenum[0]))
                unexpected_tag = error_unexpected_tags[0].strip()
                print("First Unexpected Tag: /%s at line: %s" % (unexpected_tag, error_line))
                print (template["id"], " ", template["name"] + " " + ".subject" + " has ERRORS")
            else:
                print (template["id"], " ", template["name"] + " " + ".subject" + " is GOOD. No errors")
        except Exception as e: 
            print (template["id"], " ", template["name"] + " " + ".subject" + " FAILED TO PARSE")
            print (e)
            
        try:
            response2 = sg.client.templates._(template_id).get()
            body = response2.body.decode('utf8')
            #body = response2.body.decode('utf8').replace("'", '"')
            body_json = json.loads(body)
            body_html = body_json["versions"][0]["html_content"]

            tag_stack = []
            tag_linenum_stack = []
            error_count = 0
            error_unclosed_tags = []
            error_unclosed_tags_linenum = []
            error_unexpected_tags = []
            error_data = ''
            parser = MyHTMLParser()
            parser.feed(body_html)
            error_original_tag_linenum = 0
            if (error_count):
                num = num + 1
                print (template["id"], " ", template["name"] + " " + ".body" + " has ERRORS")
                print("First Unclosed Tag: ", error_unclosed_tags[0] + " at line: " + str(error_unclosed_tags_linenum[0]))
                unexpected_tag = error_unexpected_tags[0].strip()
                print("First Unexpected Tag: /%s at line: %s" % (unexpected_tag, error_line))
            print (template["id"], " ", template["name"] + " " + ".body" + " is GOOD. No errors")
            
        except Exception as e: 
            print (template["id"], " ", template["name"] + " " + ".body" + " FAILED TO PARSE")
            print (e)


#
# check for a template file, compare with the content in the sendgrid and display the ones that are different
# 
def compare_templates():
    global testfile_only

    sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
    params = {'generations': 'dynamic', 'page_size': 100}
    response = sg.client.templates.get(
        query_params=params
    )

    if (response.status_code != 200):
        print("Error in API Call")
        exit(0)

    try:
        my_json = response.body.decode('utf8')
        templates = json.loads(my_json)
    except:
        print ("Failed to parse all templates response")

    num = 0
    for template in templates["result"]:
        if (testfile_only and (template["name"] != "ForTestingOnly")):
            continue
        template_id = template["id"]
        filename = template_id + "-" + template["name"] + ".body"
        num = num + 1
        try:
            subject_sendgrid = template["versions"][0]["subject"]
            # compare subject
            f = open(template_id + "-" + template["name"] + ".subject", "r")
            subject_localfile = f.read()
            f.close()
            if (subject_sendgrid != subject_localfile):
                print (template["id"], " ", template["name"] + " " + ".subject" + " are DIFFERENT **************")
            else:
                print (template["id"], " ", template["name"] + " " + ".subject" + " are IDENTICAL")

        except Exception as e: 
            print ("Failed to get subject for ", template["id"], " ", template["name"])
            print(e)
        try:
            response2 = sg.client.templates._(template_id).get()
            body = response2.body.decode('utf8')
            #body = response2.body.decode('utf8').replace("'", '"')
            body_json = json.loads(body)
            body_html_sendgrid = body_json["versions"][0]["html_content"]
            # compare body
            f = open(template_id + "-" + template["name"] + ".body", "r")
            body_html_localfile = f.read()
            f.close()
            if (body_html_sendgrid != body_html_localfile):
                print (template["id"], " ", template["name"] + " " + ".body" + " are DIFFERENT **************")
            else:
                print (template["id"], " ", template["name"] + " " + ".body" + " are IDENTICAL")
        except Exception as e: 
            print ("Failed to get body for ", template["id"], " ", template["name"])
            print(e)

#
# check for a template file, compare with the content in the sendgrid and save local to sendgrid if different
# 
def save_templates():
    global testfile_only

    sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
    params = {'generations': 'dynamic', 'page_size': 100}
    response = sg.client.templates.get(
        query_params=params
    )

    if (response.status_code != 200):
        print("Error in API Call")
        exit(0)

    try:
        my_json = response.body.decode('utf8')
        templates = json.loads(my_json)
    except:
        print ("Failed to parse all templates response")

    num = 0
    for template in templates["result"]:
        if (testfile_only and (template["name"] != "ForTestingOnly")):
            continue
        template_id = template["id"]
        filename = template_id + "-" + template["name"] + ".body"
        for version_info in template["versions"]:
            version_id = version_info["id"]
        to_save = False
        try:
            subject_sendgrid = template["versions"][0]["subject"]
            # compare subject
            f = open(template_id + "-" + template["name"] + ".subject", "r")
            subject_localfile = f.read()
            f.close()
            if (subject_sendgrid != subject_localfile):
                print (template["id"], " ", template["name"] + " " + ".subject" + " are DIFFERENT **************")
                to_save = True
            else:
                print (template["id"], " ", template["name"] + " " + ".subject" + " are IDENTICAL")

        except Exception as e: 
            print ("Failed to get subject for ", template["id"], " ", template["name"])
            print(e)
        try:
            response2 = sg.client.templates._(template_id).get()
            body = response2.body.decode('utf8')
            #body = response2.body.decode('utf8').replace("'", '"')
            body_json = json.loads(body)
            body_html_sendgrid = body_json["versions"][0]["html_content"]
            # compare body
            f = open(template_id + "-" + template["name"] + ".body", "r")
            body_html_localfile = f.read()
            f.close()
            if (body_html_sendgrid != body_html_localfile):
                print (template["id"], " ", template["name"] + " " + ".body" + " are DIFFERENT **************")
                to_save = True
            else:
                print (template["id"], " ", template["name"] + " " + ".body" + " are IDENTICAL")
        except Exception as e: 
            print ("Failed to get body for ", template["id"], " ", template["name"])
            print(e)
        if (to_save):
            print("Will update template")
            print(template_id)
            print(version_id)
            print(template["name"])
            sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
            data = {
                "active": 1,
                "name": template["name"],
                "generate_plain_content": True,
                "html_content": body_html_localfile,
                "subject": subject_localfile
            }
            print(data)
            try:
                response = sg.client.templates._(template_id).versions._(version_id).patch(
                    request_body=data
                )
            except HTTPError as e:
                print(e.to_dict)

            if (response.status_code == 200):
                print("Template ", template_id, " ", template["name"], " updated SUCCESSFULLY")
            else:
                print("Template ", template_id, " ", template["name"], " ERROR updating")


def usage():
    print("Syntax is:")
    print("python3 template_manager.py [-h] [-g] [-l] [-s]")
    print("")
    print("Where,")
    print("     -g, --get                          Use this to get templates rom sendgrid")
    print("     -l, --localparse                   Use this to parse templates in local files")
    print("     -r, --remoteparse                  Use this to parse templates in sendgrid")
    print("     -c, --compare                      Use this to compare local templates with sendgrid")
    print("     -s, --save                         Use this to save templates to sendgrid")
    print("     -t, --testing                      Use this to test only one one file")
    print("     -h, --help                         print this help")
    print("")

#
# main function with command line parsing
#
def main():
    global testfile_only
    get_templates_option = False
    localparse_templates_option = False
    remoteparse_templates_option = False
    compare_templates_option = False
    save_templates_option = False

    try:
        opts, args = getopt.getopt(sys.argv[1:], "cglrsht", ["compare", "get", "localparse", "remoteparse", "save", "help", "testing"])
    except getopt.GetoptError as err:
        # print help information and exit:
        print ("")
        print ("ERROR!")
        print(err)  # will print something like "option -a not recognized"
        print("")
        usage()
        sys.exit(2)
    for o, a in opts:
        if o in ("-h", "--help"):
            usage()
            sys.exit(0)
        elif o in ("-g", "--get"):
            get_templates_option = True
        elif o in ("-l", "--localparse"):
            localparse_templates_option = True
        elif o in ("-t", "--testing"):
            testfile_only = True
        elif o in ("-r", "--remoteparse"):
            remoteparse_templates_option = True
        elif o in ("-c", "--compare"):
            compare_templates_option = True
        elif o in ("-s", "--save"):
            save_templates_option = True
        else:
            assert False, "unhandled option"
            sys.exit(1)
    if (get_templates_option):
        get_templates()
        sys.exit(0)
    if (compare_templates_option):
        compare_templates()
        sys.exit(0)
    if (localparse_templates_option):
        localparse_templates()
        sys.exit(0)
    if (remoteparse_templates_option):
        remoteparse_templates()
        sys.exit(0)
    if (save_templates_option):
        save_templates()
        sys.exit(0)
    usage()
    sys.exit(1)

#
# main
#
main()

