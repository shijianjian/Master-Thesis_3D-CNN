rm -rf ./assets && rm -rf ./uploads && cd angular && ng build && cd .. && mv ./angular/dist/* ./ && python app.py
