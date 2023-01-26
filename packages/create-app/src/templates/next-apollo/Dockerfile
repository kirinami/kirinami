FROM node:18.12-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /builder
COPY .yarn .yarn
COPY .yarnrc.yml package.json yarn.lock ./
RUN yarn workspaces focus --all
COPY . .
RUN yarn build
RUN yarn workspaces focus --all --production

FROM node:18.12-alpine AS runner
WORKDIR /app
COPY --from=builder /builder/.next .next
COPY --from=builder /builder/.yarn .yarn
COPY --from=builder /builder/node_modules node_modules
COPY --from=builder /builder/public public
COPY --from=builder /builder/next.config.js ./
COPY --from=builder /builder/.env ./
COPY --from=builder /builder/.yarnrc.yml /builder/package.json /builder/yarn.lock ./
EXPOSE 4200
CMD ["yarn", "start"]
