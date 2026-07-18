package com.truerank.config;

import com.truerank.model.Job;
import com.truerank.model.Student;
import com.truerank.repository.JobRepository;
import com.truerank.repository.StudentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;

/**
 * Seeds the H2 database with realistic demo data on startup.
 * Creates sample students and diverse job/internship postings.
 */
@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(StudentRepository studentRepo, JobRepository jobRepo) {
        return args -> {

            // ========== STUDENTS ==========

            Student s1 = new Student(
                    "Arjun Mehta", "arjun.mehta@stanford.edu",
                    "Stanford University", "Computer Science",
                    3.85, 2025,
                    "Java,Spring Boot,Angular,TypeScript,Python,React,SQL,Docker,Git,REST APIs",
                    "Java,Angular,Spring Boot",
                    "F1_OPT"
            );
            s1.setBio("Full-stack developer passionate about scalable systems and clean architecture. " +
                    "Built 3 production apps and contributed to open-source projects.");
            s1.setProfileImageUrl("https://api.dicebear.com/7.x/avataaars/svg?seed=arjun");
            studentRepo.save(s1);

            Student s2 = new Student(
                    "Emily Chen", "emily.chen@mit.edu",
                    "MIT", "Data Science",
                    3.92, 2025,
                    "Python,TensorFlow,PyTorch,SQL,R,Pandas,NumPy,Scikit-Learn,Tableau,Git",
                    "Python,TensorFlow,PyTorch",
                    "US_CITIZEN"
            );
            s2.setBio("Data science enthusiast focused on NLP and recommendation systems. " +
                    "Published 2 research papers in top-tier conferences.");
            s2.setProfileImageUrl("https://api.dicebear.com/7.x/avataaars/svg?seed=emily");
            studentRepo.save(s2);

            Student s3 = new Student(
                    "Rahul Sharma", "rahul.sharma@berkeley.edu",
                    "UC Berkeley", "Electrical Engineering & CS",
                    3.45, 2026,
                    "C++,Python,MATLAB,Verilog,Embedded Systems,Linux,Git",
                    "C++,Python",
                    "F1_CPT"
            );
            s3.setBio("Hardware-software interface enthusiast with experience in embedded systems and IoT.");
            s3.setProfileImageUrl("https://api.dicebear.com/7.x/avataaars/svg?seed=rahul");
            studentRepo.save(s3);

            Student s4 = new Student(
                    "Sofia Rodriguez", "sofia.r@gatech.edu",
                    "Georgia Tech", "Computer Science",
                    3.67, 2025,
                    "JavaScript,React,Node.js,CSS,HTML,MongoDB,Express,Git,Figma",
                    "React,JavaScript,Figma",
                    "PERMANENT_RESIDENT"
            );
            s4.setBio("Frontend engineer and UI/UX enthusiast. Designed and built 5+ web apps " +
                    "with focus on accessibility and user experience.");
            s4.setProfileImageUrl("https://api.dicebear.com/7.x/avataaars/svg?seed=sofia");
            studentRepo.save(s4);

            Student s5 = new Student(
                    "James Wilson", "james.w@cmu.edu",
                    "Carnegie Mellon University", "Software Engineering",
                    3.78, 2025,
                    "Java,Python,Go,Kubernetes,Docker,AWS,Terraform,CI/CD,Microservices,SQL",
                    "Go,Kubernetes,AWS",
                    "US_CITIZEN"
            );
            s5.setBio("DevOps and cloud infrastructure enthusiast. Built CI/CD pipelines serving " +
                    "100K+ daily users.");
            s5.setProfileImageUrl("https://api.dicebear.com/7.x/avataaars/svg?seed=james");
            studentRepo.save(s5);

            // ========== JOBS ==========

            Job j1 = new Job(
                    "Software Engineer Intern", "Google", "Mountain View, CA", "INTERNSHIP",
                    "Java,Python,Data Structures,Algorithms,SQL",
                    "Angular,Spring Boot,Cloud,Kubernetes",
                    3.5, "ANY", true,
                    "Join Google's core search team to work on distributed systems that serve billions of queries daily. " +
                    "You'll design and implement backend services using Java and Python, optimize database queries, and " +
                    "collaborate with cross-functional teams. Strong algorithmic thinking required.",
                    "$55/hr"
            );
            j1.setPostedDate(LocalDate.now().minusDays(3));
            j1.setDeadline(LocalDate.now().plusDays(30));
            j1.setOpenings(50);
            j1.setWorkMode("ONSITE");
            jobRepo.save(j1);

            Job j2 = new Job(
                    "Full Stack Developer", "Microsoft", "Redmond, WA", "FULL_TIME",
                    "Angular,TypeScript,Java,Spring Boot,REST APIs,SQL",
                    "Azure,Docker,Agile,CI/CD",
                    3.3, "ANY", true,
                    "Build next-generation enterprise tools in the Azure DevOps team. " +
                    "Full-stack role working with Angular frontend and Spring Boot microservices. " +
                    "You'll own features end-to-end from design to deployment.",
                    "$120,000 - $145,000"
            );
            j2.setPostedDate(LocalDate.now().minusDays(5));
            j2.setDeadline(LocalDate.now().plusDays(21));
            j2.setOpenings(12);
            j2.setWorkMode("HYBRID");
            jobRepo.save(j2);

            Job j3 = new Job(
                    "Backend Engineer", "Stripe", "San Francisco, CA", "FULL_TIME",
                    "Java,Python,Ruby,Distributed Systems,SQL,REST APIs",
                    "Go,Microservices,Event-Driven Architecture",
                    3.5, "US_CITIZEN", false,
                    "Work on Stripe's payments infrastructure processing millions of transactions. " +
                    "Design highly available, fault-tolerant systems with strict latency requirements. " +
                    "Deep backend expertise required.",
                    "$140,000 - $180,000"
            );
            j3.setPostedDate(LocalDate.now().minusDays(1));
            j3.setDeadline(LocalDate.now().plusDays(45));
            j3.setOpenings(8);
            j3.setWorkMode("ONSITE");
            jobRepo.save(j3);

            Job j4 = new Job(
                    "ML Engineer Intern", "Meta", "Menlo Park, CA", "INTERNSHIP",
                    "Python,TensorFlow,PyTorch,Machine Learning,Linear Algebra,Statistics",
                    "NLP,Computer Vision,Distributed Training,Spark",
                    3.6, "ANY", true,
                    "Join Meta AI to work on cutting-edge machine learning models for content recommendation " +
                    "and integrity. Apply deep learning at unprecedented scale. Research-oriented role " +
                    "with publication opportunities.",
                    "$60/hr"
            );
            j4.setPostedDate(LocalDate.now().minusDays(7));
            j4.setDeadline(LocalDate.now().plusDays(14));
            j4.setOpenings(25);
            j4.setWorkMode("HYBRID");
            jobRepo.save(j4);

            Job j5 = new Job(
                    "Frontend Engineer", "Airbnb", "San Francisco, CA", "FULL_TIME",
                    "JavaScript,React,CSS,HTML,TypeScript,Responsive Design",
                    "Next.js,GraphQL,Accessibility,Performance Optimization",
                    3.0, "ANY", true,
                    "Create world-class user experiences for Airbnb's marketplace. " +
                    "Work with designers and product managers to build beautiful, performant interfaces. " +
                    "Strong emphasis on accessibility and cross-browser compatibility.",
                    "$130,000 - $160,000"
            );
            j5.setPostedDate(LocalDate.now().minusDays(2));
            j5.setDeadline(LocalDate.now().plusDays(28));
            j5.setOpenings(6);
            j5.setWorkMode("REMOTE");
            jobRepo.save(j5);

            Job j6 = new Job(
                    "Cloud Infrastructure Intern", "Amazon", "Seattle, WA", "INTERNSHIP",
                    "Python,AWS,Linux,Docker,Networking",
                    "Terraform,Kubernetes,CI/CD,Go",
                    3.2, "ANY", true,
                    "Help build and maintain AWS infrastructure serving millions of customers worldwide. " +
                    "Work on automation, monitoring, and scaling challenges at AWS scale. " +
                    "Great opportunity to learn cloud architecture.",
                    "$50/hr"
            );
            j6.setPostedDate(LocalDate.now().minusDays(4));
            j6.setDeadline(LocalDate.now().plusDays(35));
            j6.setOpenings(40);
            j6.setWorkMode("ONSITE");
            jobRepo.save(j6);

            Job j7 = new Job(
                    "Data Scientist", "Netflix", "Los Gatos, CA", "FULL_TIME",
                    "Python,SQL,Statistics,Machine Learning,A/B Testing",
                    "Spark,Scala,Deep Learning,Recommendation Systems",
                    3.5, "US_CITIZEN", false,
                    "Drive data-informed decisions for Netflix's content and product teams. " +
                    "Design experiments, build predictive models, and analyze user behavior " +
                    "at scale. Strong statistical background required.",
                    "$150,000 - $200,000"
            );
            j7.setPostedDate(LocalDate.now().minusDays(6));
            j7.setDeadline(LocalDate.now().plusDays(20));
            j7.setOpenings(4);
            j7.setWorkMode("HYBRID");
            jobRepo.save(j7);

            Job j8 = new Job(
                    "DevOps Engineer", "Spotify", "New York, NY", "FULL_TIME",
                    "Docker,Kubernetes,CI/CD,Python,Linux,Terraform",
                    "Go,AWS,GCP,Monitoring,Helm",
                    3.0, "ANY", true,
                    "Keep the music playing! Build and maintain Spotify's deployment pipeline " +
                    "and infrastructure. Ensure 99.99% uptime for 500M+ users. " +
                    "Automation-first mindset required.",
                    "$125,000 - $155,000"
            );
            j8.setPostedDate(LocalDate.now().minusDays(8));
            j8.setDeadline(LocalDate.now().plusDays(25));
            j8.setOpenings(5);
            j8.setWorkMode("REMOTE");
            jobRepo.save(j8);

            Job j9 = new Job(
                    "Embedded Systems Intern", "Tesla", "Palo Alto, CA", "INTERNSHIP",
                    "C++,Embedded Systems,MATLAB,Linux,Python",
                    "RTOS,Verilog,FPGA,CAN Bus",
                    3.4, "US_CITIZEN", false,
                    "Work on Tesla's vehicle firmware and embedded control systems. " +
                    "Program microcontrollers, debug hardware-software interfaces, and " +
                    "optimize real-time performance for autonomous driving systems.",
                    "$45/hr"
            );
            j9.setPostedDate(LocalDate.now().minusDays(10));
            j9.setDeadline(LocalDate.now().plusDays(18));
            j9.setOpenings(15);
            j9.setWorkMode("ONSITE");
            jobRepo.save(j9);

            Job j10 = new Job(
                    "Product Engineer", "Figma", "San Francisco, CA", "FULL_TIME",
                    "JavaScript,TypeScript,React,CSS,WebGL",
                    "Rust,WebAssembly,Canvas API,Performance",
                    3.2, "ANY", true,
                    "Build the future of collaborative design tools. Work on Figma's web-based " +
                    "design editor, pushing the boundaries of what's possible in the browser. " +
                    "Performance-critical role with emphasis on creative engineering.",
                    "$135,000 - $170,000"
            );
            j10.setPostedDate(LocalDate.now().minusDays(3));
            j10.setDeadline(LocalDate.now().plusDays(40));
            j10.setOpenings(8);
            j10.setWorkMode("REMOTE");
            jobRepo.save(j10);

            Job j11 = new Job(
                    "Security Engineer Intern", "CrowdStrike", "Austin, TX", "INTERNSHIP",
                    "Python,Linux,Networking,Security,SQL",
                    "Malware Analysis,Threat Intelligence,Cloud Security",
                    3.3, "US_CITIZEN", false,
                    "Join CrowdStrike's threat detection team. Analyze security incidents, " +
                    "develop detection rules, and build tools to protect enterprises from " +
                    "cyber threats. Background in cybersecurity preferred.",
                    "$42/hr"
            );
            j11.setPostedDate(LocalDate.now().minusDays(5));
            j11.setDeadline(LocalDate.now().plusDays(22));
            j11.setOpenings(10);
            j11.setWorkMode("ONSITE");
            jobRepo.save(j11);

            Job j12 = new Job(
                    "Mobile Developer", "Uber", "San Francisco, CA", "FULL_TIME",
                    "Java,Kotlin,Android,iOS,Swift,REST APIs",
                    "React Native,Flutter,CI/CD,Testing",
                    3.4, "ANY", true,
                    "Build and maintain Uber's rider and driver apps used by millions daily. " +
                    "Work on real-time location, payments, and mapping features. " +
                    "Cross-platform mobile experience preferred.",
                    "$130,000 - $165,000"
            );
            j12.setPostedDate(LocalDate.now().minusDays(2));
            j12.setDeadline(LocalDate.now().plusDays(30));
            j12.setOpenings(7);
            j12.setWorkMode("HYBRID");
            jobRepo.save(j12);

            Job j13 = new Job(
                    "Platform Engineer", "Databricks", "San Francisco, CA", "FULL_TIME",
                    "Java,Scala,Spark,Distributed Systems,SQL,Python",
                    "Kubernetes,Delta Lake,Cloud,Terraform",
                    3.6, "ANY", true,
                    "Work on the Databricks Lakehouse Platform powering the world's largest data workloads. " +
                    "Design distributed data processing systems with strict performance SLAs. " +
                    "Strong computer science fundamentals required.",
                    "$145,000 - $190,000"
            );
            j13.setPostedDate(LocalDate.now().minusDays(4));
            j13.setDeadline(LocalDate.now().plusDays(38));
            j13.setOpenings(10);
            j13.setWorkMode("ONSITE");
            jobRepo.save(j13);

            Job j14 = new Job(
                    "UI/UX Engineer Intern", "Adobe", "San Jose, CA", "INTERNSHIP",
                    "JavaScript,React,CSS,HTML,Figma,Design Systems",
                    "Angular,TypeScript,Accessibility,Motion Design",
                    3.0, "ANY", true,
                    "Help shape Adobe's next-generation creative tools. Work with designers " +
                    "to build component libraries and design systems. Strong visual sense " +
                    "and frontend skills required.",
                    "$48/hr"
            );
            j14.setPostedDate(LocalDate.now().minusDays(1));
            j14.setDeadline(LocalDate.now().plusDays(42));
            j14.setOpenings(20);
            j14.setWorkMode("REMOTE");
            jobRepo.save(j14);

            Job j15 = new Job(
                    "API Engineer", "Twilio", "Denver, CO", "FULL_TIME",
                    "Java,REST APIs,Microservices,SQL,Docker",
                    "Spring Boot,GraphQL,Event-Driven Architecture,AWS",
                    3.3, "ANY", true,
                    "Build APIs that power communication for millions of businesses. " +
                    "Design RESTful services with focus on developer experience, " +
                    "reliability, and scalability. API design expertise valued.",
                    "$115,000 - $145,000"
            );
            j15.setPostedDate(LocalDate.now().minusDays(6));
            j15.setDeadline(LocalDate.now().plusDays(26));
            j15.setOpenings(6);
            j15.setWorkMode("HYBRID");
            jobRepo.save(j15);

            System.out.println("===========================================");
            System.out.println("  TrueRank — Database seeded successfully");
            System.out.println("  Students: " + studentRepo.count());
            System.out.println("  Jobs:     " + jobRepo.count());
            System.out.println("===========================================");
        };
    }
}
