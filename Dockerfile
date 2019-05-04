# Alpine Node Image
FROM node:10-alpine AS builder

# Create app directory
WORKDIR /usr/app

# Copy package info
COPY package.json yarn.lock ./

# Install app dependencies
RUN apk add --no-cache tini bash git openssh
RUN yarn install --frozen-lockfile

# Build source
COPY . .
RUN yarn test && yarn build

# Main Image
FROM node:10-alpine
ENV NODE_ENV=production

# Create app directory
WORKDIR /usr/app

# Copy built source
COPY package.json yarn.lock ./
COPY --from=builder /usr/app/build ./build

# Install prod dependencies
RUN apk add --no-cache tini bash git openssh && \
  yarn install --frozen-lockfile --production && \
  apk del bash git openssh

# Start Node.js
EXPOSE 3000
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "."]
