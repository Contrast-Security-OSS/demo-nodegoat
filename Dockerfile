FROM cypress/base:12
ENV WORKDIR /usr/src/app/
WORKDIR $WORKDIR
COPY package*.json $WORKDIR
RUN npm install --production --no-cache

FROM cypress/base:12
RUN apt-get update && apt-get install -y netcat
ENV USER node
ENV WORKDIR /home/$USER/app
WORKDIR $WORKDIR
COPY --from=0 /usr/src/app/node_modules node_modules
RUN npm install @contrast/agent --no-save

RUN chown $USER:$USER $WORKDIR
COPY --chown=node . $WORKDIR
# In production environment uncomment the next line
#RUN chown -R $USER:$USER /home/$USER && chmod -R g-s,o-rx /home/$USER && chmod -R o-wrx $WORKDIR
# Then all further actions including running the containers should be done under non-root user.
USER $USER
EXPOSE 4000