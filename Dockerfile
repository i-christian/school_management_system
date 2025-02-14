# Stage 1: Build the Go application
FROM golang:1.24-alpine as builder

RUN apk add --no-cache curl

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go install github.com/a-h/templ/cmd/templ@latest

RUN curl -sL https://github.com/tailwindlabs/tailwindcss/releases/latest/download/tailwindcss-linux-x64 -o /usr/local/bin/tailwindcss && \
    chmod +x /usr/local/bin/tailwindcss

RUN templ generate
RUN tailwindcss -i cmd/web/styles/input.css -o cmd/web/assets/css/output.css

RUN go build -o main cmd/api/main.go

FROM alpine:latest as runner

RUN addgroup -S myuser && adduser -S myuser -G myuser

COPY --from=builder /app/main /usr/local/bin/main

RUN chown myuser:myuser /usr/local/bin/main

USER myuser

EXPOSE 8080

CMD ["/usr/local/bin/main"]
