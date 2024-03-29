FROM node:18-alpine
ARG CONTRAST_INSTALL=OFF
ENV WORKDIR /usr/src/app/
WORKDIR $WORKDIR
COPY package*.json $WORKDIR
RUN npm install --no-cache

# Conditional installation of Contrast based on CONTRAST_INSTALL
RUN if [ "$CONTRAST_INSTALL" = "ASSESS" ]; then \
        npm install @contrast/agent; \
    elif [ "$CONTRAST_INSTALL" = "PROTECT" ]; then \
        npm install @contrast/protect-agent; \
    fi

FROM node:18-alpine
RUN apk update and apk add netcat
ENV USER node
ENV WORKDIR /home/$USER/app
WORKDIR $WORKDIR
COPY --from=0 /usr/src/app/node_modules node_modules

RUN chown $USER:$USER $WORKDIR
COPY --chown=node . $WORKDIR
# In production environment uncomment the next line
#RUN chown -R $USER:$USER /home/$USER && chmod -R g-s,o-rx /home/$USER && chmod -R o-wrx $WORKDIR
# Then all further actions including running the containers should be done under non-root user.
USER $USER
EXPOSE 4000