FROM node:13.12.0

WORKDIR /usr/src/smart-brain-api

COPY ./ ./

RUN npm install

RUN npm install nodemon -g

EXPOSE 3000

CMD ["/bin/bash"]
