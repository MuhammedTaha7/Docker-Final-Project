import React, { useState, useEffect } from 'react';
import './portfolio.scss'; // Renamed from settings.scss

const Portfolio = () => { // Renamed from Settings
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  const skills = [
    { name: 'HTML', level: 95 },
    { name: 'CSS', level: 90 },
    { name: 'JavaScript', level: 85 },
    { name: 'React', level: 88 },
    { name: 'Node.js', level: 82 },
    { name: 'Python', level: 78 }
  ];

  const professionalSkills = [
    { name: 'Web Design', level: 92 },
    { name: 'Web Development', level: 88 },
    { name: 'Graphic Design', level: 85 },
    { name: 'SEO Marketing', level: 80 }
  ];

  const experiences = [
    {
      period: '2020 - Present',
      title: 'Senior Frontend Developer',
      company: 'Tech Solutions Inc.',
      description: 'Leading frontend development projects using React, Vue.js and modern web technologies.'
    },
    {
      period: '2018 - 2020',
      title: 'Full Stack Developer',
      company: 'Digital Agency',
      description: 'Developed full-stack applications using MEAN stack and collaborated with design teams.'
    },
    {
      period: '2016 - 2018',
      title: 'Junior Web Developer',
      company: 'StartUp Studio',
      description: 'Built responsive websites and learned modern development practices in an agile environment.'
    }
  ];

  const education = [
    {
      period: '2012 - 2016',
      title: 'Bachelor of Computer Science',
      institution: 'University of Technology',
      description: 'Focused on software engineering, algorithms, and web development fundamentals.'
    },
    {
      period: '2019',
      title: 'React Developer Certification',
      institution: 'Tech Institute',
      description: 'Advanced certification in React.js, Redux, and modern frontend development practices.'
    }
  ];

  return (
    <div className={`portfolio-wrapper ${isLoaded ? 'portfolio-loaded' : ''}`}>
      {/* Navigation */}
      <nav className="portfolio-navbar">
        <div className="portfolio-nav-brand">Jacob</div>
        <ul className="portfolio-nav-menu">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#education">Education</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section id="home" className="portfolio-hero">
        <div className="portfolio-hero-content">
          <div className="portfolio-hero-text">
            <h1 className="portfolio-hero-title">
              Hi, I'm Jacob Aiden
              <span className="portfolio-title-accent">Frontend Developer</span>
            </h1>
            <p className="portfolio-hero-description">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet consectetur 
              adipisicing elit lorem ipsum dolor sit amet consectetur adipisicing elit, 
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="portfolio-hero-buttons">
              <button className="portfolio-btn-primary">Hire Me</button>
              <button className="portfolio-btn-secondary">Let's Talk</button>
            </div>
            <div className="portfolio-social-links">
              <a href="#" className="portfolio-social-link">f</a>
              <a href="#" className="portfolio-social-link">t</a>
              <a href="#" className="portfolio-social-link">in</a>
            </div>
          </div>
          <div className="portfolio-hero-image">
            <div className="portfolio-image-container">
              <div className="portfolio-glow-effect"></div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="portfolio-about">
        <div className="portfolio-container">
          <h2 className="portfolio-section-title">
            About <span className="portfolio-text-accent">Me</span>
          </h2>
          <div className="portfolio-about-content">
            <div className="portfolio-about-image">
              <div className="portfolio-profile-image">
                <div className="portfolio-image-glow"></div>
              </div>
            </div>
            <div className="portfolio-about-text">
              <h3>Frontend Developer</h3>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui quibusdam 
                quaerat exercitationem voluptatem, nam facere sapiente quam numquam, 
                quidem neque earum soluta aperiam ratione nostrum ullam labore 
                voluptatibus expedita. Nam, facere sapiente quam numquam, quidem neque.
              </p>
              <button className="portfolio-btn-primary">Read More</button>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="portfolio-journey">
        <div className="portfolio-container">
          <div className="portfolio-journey-grid">
            <div className="portfolio-journey-column">
              <h3 className="portfolio-column-title">
                My <span className="portfolio-text-accent">Journey</span>
              </h3>
              <div className="portfolio-timeline">
                <h4 className="portfolio-timeline-category">Education</h4>
                {education.map((item, index) => (
                  <div key={index} className="portfolio-timeline-item">
                    <div className="portfolio-timeline-period">{item.period}</div>
                    <div className="portfolio-timeline-content">
                      <h5>{item.title}</h5>
                      <span className="portfolio-institution">{item.institution}</span>
                      <p>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="portfolio-journey-column">
              <h3 className="portfolio-column-title">
                <span className="portfolio-text-accent">Experience</span>
              </h3>
              <div className="portfolio-timeline">
                <h4 className="portfolio-timeline-category">Work Experience</h4>
                {experiences.map((item, index) => (
                  <div key={index} className="portfolio-timeline-item">
                    <div className="portfolio-timeline-period">{item.period}</div>
                    <div className="portfolio-timeline-content">
                      <h5>{item.title}</h5>
                      <span className="portfolio-institution">{item.company}</span>
                      <p>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="portfolio-skills">
        <div className="portfolio-container">
          <h2 className="portfolio-section-title">
            My <span className="portfolio-text-accent">Skills</span>
          </h2>
          <div className="portfolio-skills-grid">
            <div className="portfolio-skills-column">
              <h3>Coding Skills</h3>
              <div className="portfolio-skill-bars">
                {skills.map((skill, index) => (
                  <div key={index} className="portfolio-skill-item">
                    <div className="portfolio-skill-header">
                      <span className="portfolio-skill-name">{skill.name}</span>
                      <span className="portfolio-skill-percent">{skill.level}%</span>
                    </div>
                    <div className="portfolio-skill-bar">
                      <div 
                        className="portfolio-skill-progress" 
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="portfolio-skills-column">
              <h3>Professional Skills</h3>
              <div className="portfolio-skill-bars">
                {professionalSkills.map((skill, index) => (
                  <div key={index} className="portfolio-skill-item">
                    <div className="portfolio-skill-header">
                      <span className="portfolio-skill-name">{skill.name}</span>
                      <span className="portfolio-skill-percent">{skill.level}%</span>
                    </div>
                    <div className="portfolio-skill-bar">
                      <div 
                        className="portfolio-skill-progress" 
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="portfolio-contact">
        <div className="portfolio-container">
          <h2 className="portfolio-section-title">
            Contact <span className="portfolio-text-accent">Me!</span>
          </h2>
          <form className="portfolio-contact-form" onSubmit={handleSubmit}>
            <div className="portfolio-form-row">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                className="portfolio-form-input"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="portfolio-form-input"
                required
              />
            </div>
            <input
              type="text"
              name="subject"
              placeholder="Email Subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="portfolio-form-input"
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleInputChange}
              className="portfolio-form-textarea"
              rows="6"
              required
            ></textarea>
            <button type="submit" className="portfolio-btn-primary portfolio-submit-btn">
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="portfolio-footer">
        <p>Copyright © 2025 by Jacob Aiden | All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Portfolio;