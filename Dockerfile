# Dockerfile — AI Video Editor (Remotion + Express).
# A single container runs the API, serves the built editor UI, and renders
# Remotion videos. Ready for Dokploy (docker-compose.yml) or any Docker host.
#
# Important details:
#  - Rendering shells out to `npx remotion render` at runtime, and the Creator
#    mode shells out to `npx tsc`, so the FULL node_modules (including
#    devDependencies) must stay in the image.
#  - Remotion's headless Chrome is downloaded at BUILD time so renders keep
#    working even when the container has no internet access.
#  - NODE_ENV=production is set only AFTER `npm ci`, so dev tooling
#    (vite/tsx/typescript) is installed for the build.

FROM node:20-bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive

# System libraries Chromium (Remotion's headless browser) needs in order to
# launch, plus fonts so the typography scenes and text posters render
# (Liberation matches Arial/Times/Courier metrics).
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    fonts-liberation \
    fonts-dejavu-core \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpango-1.0-0 \
    libcairo2 \
    libxshmfence1 \
    libx11-xcb1 \
    libxcb1 \
    libxcb-dri3-0 \
    libgl1 \
    libegl1 \
    libxext6 \
    libxrender1 \
    libxtst6 \
    libxi6 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install the exact dependency versions from the lockfile.
COPY package.json package-lock.json ./
RUN npm ci

# Download Remotion's headless Chrome into the image (no runtime download).
RUN npx remotion browser ensure

# Project sources — node_modules / out / public etc. are excluded by
# .dockerignore so user data is never baked into the image.
COPY . .

# Build the editor UI (Vite -> dist-app/), served by Express on :3001.
# NODE_ENV is still unset here so dev tooling is available.
RUN npx vite build

# Runtime data is kept in named volumes (see docker-compose.yml) so it survives
# redeploys:
#   /app/public         -> uploads, project.json, creator-versions.json
#   /app/out            -> rendered video.mp4

ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001

# tsx runs the TypeScript server directly; Remotion renders are bundled
# on demand by `npx remotion render`.
CMD ["npx", "tsx", "server/index.ts"]