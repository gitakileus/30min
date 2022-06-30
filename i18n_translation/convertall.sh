# /Users/ajaymalik/30mins.com/30minfrontend/locales/en

#for LOCALE in es ro pt it
for LOCALE in it ro pt
do
for LANGFILE in common event meeting page profile setting
do
   echo "======================================================="
   Filename=/Users/ajaymalik/30mins.com/30minfrontend/locales/en/${LANGFILE}.json
   echo ${Filename}
   echo "======================================================="
   cmd="python main.py "${Filename}" --locale "${LOCALE}" --output "/Users/ajaymalik/30mins.com/30minfrontend/i18n_translation/${LOCALE}/${LANGFILE}.json
   eval $cmd
done
curl -H "Authorization: DeepL-Auth-Key 0b5f89ba-6222-a6f4-5dd8-c57a48a3ed43:fx" https://api-free.deepl.com/v2/usage
done

