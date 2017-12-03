rm -rf ./assets && rm -rf ./uploads && cd angular && ng build --aot=true && cd .. && mv ./angular/dist/* ./ && python app.py
