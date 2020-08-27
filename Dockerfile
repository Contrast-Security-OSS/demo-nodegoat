FROM cypress/base:10 
ENV WORKDIR /usr/src/app/
WORKDIR $WORKDIR
COPY package*.json $WORKDIR
RUN npm install 
RUN npm install @contrast/agent --save

FROM cypress/base:10 
RUN apt-get update && apt-get install -y netcat
ENV USER node
ENV WORKDIR /home/$USER/app
WORKDIR $WORKDIR
COPY --from=0 /usr/src/app/node_modules node_modules
RUN chown $USER:$USER $WORKDIR
COPY --chown=node . $WORKDIR

USER $USER
EXPOSE 4000
