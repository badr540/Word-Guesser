# Build stage - using Java 17 explicitly
FROM maven:3.8.7-eclipse-temurin-17 AS build
WORKDIR /app

# Copy just the POM file first (for layer caching)
COPY pom.xml .

# Download all dependencies
RUN mvn dependency:go-offline -B

# Copy source files
COPY src ./src

# Build with Java 17 compatibility
RUN mvn package -DskipTests -Dmaven.compiler.release=17

# Runtime stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]