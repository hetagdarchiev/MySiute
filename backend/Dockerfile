FROM golang:1.25-alpine AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /portfolio .
FROM alpine:3.22
RUN apk add --no-cache ca-certificates && adduser -D -u 10001 portfolio
USER portfolio
COPY --from=build /portfolio /portfolio
EXPOSE 8080
ENTRYPOINT ["/portfolio"]
