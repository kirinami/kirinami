FROM node:22.11-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /builder
COPY .yarn .yarn
COPY .yarnrc.yml package.json yarn.lock ./
RUN yarn workspaces focus --all
COPY . .
ENV NODE_ENV production
RUN yarn build
RUN yarn workspaces focus --all --production

FROM node:22.11-alpine AS runner
WORKDIR /app
COPY --from=builder /builder .
ENV NODE_ENV production
EXPOSE 3000
CMD ["yarn", "start"]
