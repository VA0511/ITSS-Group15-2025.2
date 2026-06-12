# Stage 1: Build the Go application
FROM golang:1.23-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy go.mod and go.sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the rest of the source code
COPY . .

# Build the application
# CGO_ENABLED=0 builds a statically-linked binary
RUN CGO_ENABLED=0 GOOS=linux go build -o main cmd/app/main.go

# Stage 2: Run the Go binary
FROM alpine:latest

# Install tzdata for timezone operations (e.g. gym schedules) and ca-certificates
RUN apk --no-cache add tzdata ca-certificates

WORKDIR /app

# Copy the binary from the builder stage
COPY --from=builder /app/main .

# Create uploads folder for static file serving
RUN mkdir -p uploads

# Expose port 8080
EXPOSE 8080

# Command to run the executable
CMD ["./main"]
