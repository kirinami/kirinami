FROM node:22.22-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /builder
COPY package.json package-lock.json ./
RUN npm install
COPY . .
ENV NODE_ENV production
RUN npm run build
RUN npm install --production

FROM node:22.22-alpine AS runner
WORKDIR /app
COPY --from=builder /builder .
ENV NODE_ENV production
EXPOSE 5173
CMD ["npm", "start"]
