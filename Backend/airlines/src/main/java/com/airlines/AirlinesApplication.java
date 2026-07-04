package com.airlines;

import com.airlines.entity.ApplicationUser;
import com.airlines.entity.Role;
import com.airlines.repository.RoleRepository;
import com.airlines.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.ArrayList;
import java.util.List;

@SpringBootApplication
public class AirlinesApplication {

	public static void main(String[] args) {
		SpringApplication.run(AirlinesApplication.class, args);
	}

	@Bean
	CommandLineRunner run(RoleRepository roleRepository, UserRepository userRepository) {
		return args -> {
			if (roleRepository.findByAuthority("ADMIN").isPresent())
				return;
			Role adminRole = roleRepository.save(new Role("ADMIN"));
			if (roleRepository.findByAuthority("MANAGER").isPresent())
				return;
			Role managerRole = roleRepository.save(new Role("MANAGER"));
			roleRepository.save(new Role("USER"));
			
			List<Role> roles = new ArrayList<>();
			roles.add(adminRole);
			
			List<Role> roless = new ArrayList<>();
			roless.add(managerRole);
			
			ApplicationUser admin = new ApplicationUser((long) 1, "admin", "rraakesh570@gmail.com", "9876543289", roles);
			ApplicationUser manager = new ApplicationUser((long) 2, "manager", "manager@gmail.com", "1234567890", roless);
			
			userRepository.save(admin);
			userRepository.save(manager);
		};
	}
}
