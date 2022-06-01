FROM node:16.13-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NODE_OPTIONS --max_old_space_size=4096
COPY patches patches
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
RUN yarn build
RUN yarn install --frozen-lockfile --prefer-offline --production

FROM node:16.13-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next .next
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/public public
COPY --from=builder /app/.env* ./
COPY --from=builder /app/next.config.js next.config.js
COPY --from=builder /app/package.json /app/yarn.lock ./
ENV NODE_ENV production
ENV NODE_OPTIONS --max_old_space_size=4096
ENV NEXT_TELEMETRY_DISABLED 1
EXPOSE 3000
CMD ["yarn", "start"]
