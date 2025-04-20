# Use OpenJDK 24 with Maven installed (via a custom setup)
FROM openjdk:24-jdk AS build

# Install Maven manually (because official Maven images use Temurin)
RUN apt-get update && \
    apt-get install -y maven && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy project files
COPY ./pom.xml /app
COPY ./src /app/src

# Build the application
RUN mvn clean package -DskipTests

# Final runtime image
FROM openjdk:24-jdk

# Set working directory
WORKDIR /app

# Copy built JAR from previous stage
COPY --from=build /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Run app
CMD ["java", "-jar", "app.jar"]
