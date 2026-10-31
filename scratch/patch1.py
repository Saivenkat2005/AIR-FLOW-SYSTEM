import os
import re

base_dir = r"c:\Resume\ECommerce\Airline-Booking 2 - Copy"
backend_dir = os.path.join(base_dir, "Backend", "airlines")
frontend_dir = os.path.join(base_dir, "Frontend")
java_dir = os.path.join(backend_dir, "src", "main", "java", "com", "airlines")

def patch_pom():
    pom_path = os.path.join(backend_dir, "pom.xml")
    with open(pom_path, "r", encoding="utf-8") as f:
        content = f.read()

    deps = """
        <!-- OpenPDF -->
        <dependency>
            <groupId>com.github.librepdf</groupId>
            <artifactId>openpdf</artifactId>
            <version>1.3.30</version>
        </dependency>
        <!-- Spring Security -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.11.5</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.11.5</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>0.11.5</version>
            <scope>runtime</scope>
        </dependency>
"""
    if "openpdf" not in content:
        content = content.replace("</dependencies>", deps + "\n\t</dependencies>")
        with open(pom_path, "w", encoding="utf-8") as f:
            f.write(content)

patch_pom()
print("Patched pom.xml")
