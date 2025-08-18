# FROM maven:3.8.5-openjdk-17 AS build

# WORKDIR /app
# COPY . /app

# RUN mvn clean package

# FROM eclipse-temurin:17
# WORKDIR /app

# COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar /app/app.jar

# ENTRYPOINT ["java", "-jar", "/app/app.jar"]

FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY . /app
RUN mvn clean package

# Use a different base image with better SSL support
FROM openjdk:17-jdk-slim
# Install ca-certificates for SSL support
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar /app/app.jar
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
