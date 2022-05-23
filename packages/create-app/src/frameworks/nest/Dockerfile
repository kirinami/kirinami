FROM node:16.13-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NODE_OPTIONS --max_old_space_size=4096
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
ENV NODE_ENV production
RUN yarn build
RUN yarn install --production --ignore-scripts --prefer-offline

FROM node:16.13-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.nest ./
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/public public
COPY --from=builder /app/.env* ./
COPY --from=builder /app/nest-cli.json nest-cli.json
COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/typeorm.config.js typeorm.config.js
ENV NODE_ENV production
ENV NODE_OPTIONS --max_old_space_size=4096
CMD ["yarn", "start"]
