From node

# Create app directory
RUN mkdir -p /MTS
WORKDIR /MTS

# Install app dependencies
COPY package*.json ./

RUN apt-get update && apt-get install -y ffmpeg
RUN npm install


COPY . /MTS

EXPOSE 3000

CMD ["npm", "start"]


