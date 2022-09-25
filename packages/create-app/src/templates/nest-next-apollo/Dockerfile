FROM node:16.13-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY .yarn .yarn
COPY .yarnrc.yml package.json yarn.lock ./
ENV NODE_OPTIONS --max_old_space_size=4096
RUN yarn workspaces focus --all

FROM node:16.13-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=deps /app/ ./
COPY . .
ENV NODE_ENV production
ENV NODE_OPTIONS --max_old_space_size=4096
ENV NEXT_TELEMETRY_DISABLED 1
RUN yarn build
RUN yarn workspaces focus --all --production
RUN rm -rf .yarn/cache && rm -rf .yarn/install-state.gz && rm -rf src

FROM node:16.13-alpine AS runner
WORKDIR /app
COPY --from=builder /app/ ./
ENV NODE_ENV production
ENV NODE_OPTIONS --max_old_space_size=4096
ENV NEXT_TELEMETRY_DISABLED 1
EXPOSE 3000
CMD ["yarn", "start"]
