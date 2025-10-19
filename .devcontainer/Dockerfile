# syntax=docker/dockerfile:1

ARG RUBY_VARIANT="3.2-bullseye"
FROM mcr.microsoft.com/devcontainers/ruby:${RUBY_VARIANT}

ARG EMSDK_VERSION="3.1.59"
ENV EMSDK=/opt/emsdk \
    EM_CONFIG=/opt/emsdk/.emscripten \
    EM_CACHE=/opt/emsdk/upstream/emscripten/cache \
    PATH=/opt/emsdk:/opt/emsdk/upstream/emscripten:$PATH

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    ca-certificates \
    cmake \
    git \
    ninja-build \
    python3 \
    python3-pip \
    unzip \
    && rm -rf /var/lib/apt/lists/*

RUN git clone --depth 1 https://github.com/emscripten-core/emsdk.git ${EMSDK} \
    && ${EMSDK}/emsdk install ${EMSDK_VERSION} \
    && ${EMSDK}/emsdk activate ${EMSDK_VERSION} --embedded \
    && rm -rf ${EMSDK}/.git

RUN /bin/bash -lc "source /opt/emsdk/emsdk_env.sh && emcc --version"

RUN gem install bundler \
    && printf 'source /opt/emsdk/emsdk_env.sh >/dev/null 2>&1\n' > /etc/profile.d/emsdk.sh \
    && chmod +x /etc/profile.d/emsdk.sh

USER vscode
RUN cp -f /opt/emsdk/.emscripten ~/.emscripten
USER root
