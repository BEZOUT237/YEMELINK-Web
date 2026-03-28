import { pool } from './config.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function seedDatabase() {
  const connection = await pool.getConnection();

  try {
    console.log('🌱 Seeding database with demo data...');

    // Create admin user
    const adminPasswordHash = await bcrypt.hash('Yemelink123!', 10);
    await connection.execute(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, is_verified, bio)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ['admin@yemelink.test', adminPasswordHash, 'Stéphane', 'Yemeli', 'admin', true, 'Founder & CEO of YEMELINK']
    );

    // Create demo user
    const userPasswordHash = await bcrypt.hash('Demo123!', 10);
    await connection.execute(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, is_verified)
       VALUES (?, ?, ?, ?, ?, ?)`,
      ['demo@yemelink.test', userPasswordHash, 'Demo', 'User', 'user', true]
    );

    // Create services
    const services = [
      {
        title: 'Web Full Stack Development',
        slug: 'web-fullstack-development',
        description: 'Complete web development solutions from backend to frontend. We build scalable, secure, and performant web applications using modern technologies.',
        category: 'development',
        icon: 'code',
        turnaround_time: '4-8 weeks'
      },
      {
        title: 'Mobile App Development (Android)',
        slug: 'mobile-app-android',
        description: 'Native Android app development with cutting-edge technologies. We create responsive, fast, and user-friendly mobile applications.',
        category: 'mobile',
        icon: 'smartphone',
        turnaround_time: '6-10 weeks'
      },
      {
        title: 'Graphic Design',
        slug: 'graphic-design',
        description: 'Professional graphic design services including logos, UI/UX design, branding, and visual identity. Creative solutions tailored to your brand.',
        category: 'design',
        icon: 'palette',
        turnaround_time: '2-4 weeks'
      },
      {
        title: 'Content Creation',
        slug: 'content-creation',
        description: 'High-quality content creation for social media, blogs, and marketing campaigns. Engaging, creative, and SEO-optimized content.',
        category: 'marketing',
        icon: 'pencil',
        turnaround_time: '1-2 weeks'
      },
      {
        title: 'Digital Marketing & Social Media',
        slug: 'digital-marketing-social',
        description: 'Complete digital marketing strategy and execution. Social media management, SEO, PPC, and brand growth through data-driven strategies.',
        category: 'marketing',
        icon: 'trending-up',
        turnaround_time: 'Ongoing'
      },
      {
        title: 'Persuasive Copywriting',
        slug: 'persuasive-copywriting',
        description: 'Compelling copy that converts. Sales pages, email campaigns, product descriptions, and marketing materials that drive results.',
        category: 'content',
        icon: 'type',
        turnaround_time: '3-5 days'
      }
    ];

    for (const service of services) {
      await connection.execute(
        `INSERT INTO services (title, slug, description, category, icon, turnaround_time)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [service.title, service.slug, service.description, service.category, service.icon, service.turnaround_time]
      );
    }

    // Create projects
    const projects = [
      {
        title: 'YEMELINK AI Automation Agency',
        slug: 'yemelink-ai-automation',
        description: 'Advanced AI automation platform for agencies. Streamlines workflows, automates repetitive tasks, and enhances client delivery.',
        client_name: 'YEMELINK',
        technologies: ['React', 'Node.js', 'AI/ML', 'Automation'],
        live_url: 'https://symphonious-pony-88095a.netlify.app',
        case_study: 'Built a comprehensive AI automation platform that reduces manual workflow time by 70%.',
        testimonial: 'A game-changer for our agency operations. Highly recommended!',
        testimonial_author: 'Client Team',
        featured: true
      },
      {
        title: 'Networker - Professional Network Platform',
        slug: 'networker-platform',
        description: 'Professional networking platform connecting entrepreneurs and freelancers globally. Built with modern technologies for scalability.',
        client_name: 'Networker Team',
        technologies: ['React', 'Node.js', 'PostgreSQL', 'Real-time'],
        live_url: 'https://preview--networker.lovable.app/',
        case_study: 'Developed a robust networking platform with real-time messaging and profile matching.',
        testimonial: 'Excellent development team. Delivered on time and exceeded expectations.',
        testimonial_author: 'Networker CEO',
        featured: true
      },
      {
        title: 'E-Commerce Platform',
        slug: 'ecommerce-platform',
        description: 'Full-featured e-commerce solution with payment integration, inventory management, and analytics dashboard.',
        client_name: 'Digital Shop Co.',
        technologies: ['React', 'Node.js', 'MySQL', 'Stripe'],
        case_study: 'Developed a complete e-commerce solution that increased client sales by 300%.',
        testimonial: 'Professional, responsive, and delivered exactly what we needed.',
        testimonial_author: 'Shop Director',
        featured: true
      },
      {
        title: 'SaaS Dashboard Application',
        slug: 'saas-dashboard',
        description: 'Enterprise SaaS dashboard with real-time analytics, user management, and advanced reporting features.',
        client_name: 'Tech Startup XYZ',
        technologies: ['React', 'TypeScript', 'API Integration'],
        case_study: 'Built scalable dashboard serving thousands of concurrent users.',
        testimonial: 'Outstanding code quality and great communication throughout the project.',
        testimonial_author: 'Product Manager'
      }
    ];

    for (const project of projects) {
      await connection.execute(
        `INSERT INTO projects (title, slug, description, client_name, technologies, live_url, case_study, testimonial, testimonial_author, featured)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          project.title,
          project.slug,
          project.description,
          project.client_name,
          JSON.stringify(project.technologies),
          project.live_url || null,
          project.case_study,
          project.testimonial,
          project.testimonial_author,
          project.featured ? true : false
        ]
      );
    }

    // Create articles
    const articles = [
      {
        title: 'Web Development Best Practices in 2024',
        slug: 'web-dev-best-practices-2024',
        excerpt: 'Learn the essential best practices for modern web development.',
        body: 'Web development continues to evolve rapidly. In 2024, staying current with best practices is crucial...',
        category: 'development',
        tags: ['web', 'development', 'best-practices'],
        reading_time: 8,
        is_published: true
      },
      {
        title: 'How to Build a Scalable Mobile App',
        slug: 'scalable-mobile-app',
        excerpt: 'Tips and tricks for building mobile applications that scale.',
        body: 'Building a mobile app that can handle millions of users requires careful planning...',
        category: 'mobile',
        tags: ['mobile', 'scalability', 'architecture'],
        reading_time: 10,
        is_published: true
      },
      {
        title: 'Digital Marketing Trends 2024',
        slug: 'digital-marketing-trends',
        excerpt: 'The hottest digital marketing trends you need to know about.',
        body: 'Digital marketing is experiencing significant changes. Here are the top trends...',
        category: 'marketing',
        tags: ['marketing', 'trends', 'digital'],
        reading_time: 7,
        is_published: true
      },
      {
        title: 'Design Systems: Building Better Products',
        slug: 'design-systems',
        excerpt: 'Why design systems are essential for product teams.',
        body: 'A well-designed system can improve consistency, speed up development...',
        category: 'design',
        tags: ['design', 'systems', 'ui-ux'],
        reading_time: 9,
        is_published: true
      },
      {
        title: 'AI in Business: The Future is Now',
        slug: 'ai-in-business',
        excerpt: 'How artificial intelligence is transforming business operations.',
        body: 'Artificial intelligence is no longer a future concept. It\'s reshaping how businesses operate...',
        category: 'technology',
        tags: ['ai', 'business', 'automation'],
        reading_time: 12,
        is_published: true
      },
      {
        title: 'Content Marketing Strategies That Work',
        slug: 'content-marketing-strategies',
        excerpt: 'Proven content marketing strategies for business growth.',
        body: 'Content is king. Here are strategies that will amplify your content marketing efforts...',
        category: 'marketing',
        tags: ['content', 'marketing', 'strategy'],
        reading_time: 11,
        is_published: true
      },
      {
        title: 'The Complete Guide to UX Design',
        slug: 'complete-guide-ux-design',
        excerpt: 'Master the fundamentals of user experience design.',
        body: 'User experience design is critical for product success. This comprehensive guide covers...',
        category: 'design',
        tags: ['ux', 'design', 'guide'],
        reading_time: 15,
        is_published: true
      },
      {
        title: 'Cybersecurity Best Practices for Businesses',
        slug: 'cybersecurity-best-practices',
        excerpt: 'Protect your business with essential cybersecurity measures.',
        body: 'In today\'s digital landscape, cybersecurity is paramount. Follow these best practices...',
        category: 'technology',
        tags: ['security', 'cybersecurity', 'business'],
        reading_time: 10,
        is_published: true
      }
    ];

    // Get admin user ID (should be 1)
    const [adminResult] = await connection.execute(
      `SELECT id FROM users WHERE email = ?`,
      ['admin@yemelink.test']
    );
    const adminId = (adminResult as any)[0].id;

    for (const article of articles) {
      await connection.execute(
        `INSERT INTO articles (title, slug, excerpt, body, author_id, category, tags, reading_time, is_published, published_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          article.title,
          article.slug,
          article.excerpt,
          article.body,
          adminId,
          article.category,
          JSON.stringify(article.tags),
          article.reading_time,
          article.is_published
        ]
      );
    }

    // Create demo posts for community feed
    const [demoUserResult] = await connection.execute(
      `SELECT id FROM users WHERE email = ?`,
      ['demo@yemelink.test']
    );
    const demoUserId = (demoUserResult as any)[0].id;

    const posts = [
      {
        author_id: adminId,
        type: 'text',
        content: 'Excited to announce that YEMELINK is now offering AI-powered automation services! 🚀',
      },
      {
        author_id: demoUserId,
        type: 'text',
        content: 'Just completed an amazing project with the YEMELINK team. Highly recommended! 👍',
      },
      {
        author_id: adminId,
        type: 'text',
        content: 'New blog post is live: "Web Development Best Practices in 2024". Check it out!',
      },
      {
        author_id: demoUserId,
        type: 'text',
        content: 'Looking for a talented development team? YEMELINK delivers excellence! 💯',
      },
      {
        author_id: adminId,
        type: 'text',
        content: '16 projects delivered, 16 happy clients, and counting! Thank you all! 🙏',
      },
      {
        author_id: demoUserId,
        type: 'text',
        content: 'Digital transformation is no longer optional. Let\'s innovate together!',
      },
      {
        author_id: adminId,
        type: 'text',
        content: 'Join our community and share your ideas about tech and digital services.',
      },
      {
        author_id: demoUserId,
        type: 'text',
        content: 'Great experience working with a professional and responsive team. Would definitely hire again!',
      },
      {
        author_id: adminId,
        type: 'text',
        content: '2+ years of excellence in web development, mobile apps, and digital marketing.',
      },
      {
        author_id: demoUserId,
        type: 'text',
        content: 'YEMELINK just launched their new services page. Really comprehensive offerings!',
      },
      {
        author_id: adminId,
        type: 'text',
        content: 'AI is transforming how we build solutions. Excited about the future!',
      },
      {
        author_id: demoUserId,
        type: 'text',
        content: 'Had an amazing consultation with the YEMELINK team. Very knowledgeable! 😊',
      }
    ];

    for (const post of posts) {
      await connection.execute(
        `INSERT INTO posts (author_id, type, content, is_approved)
         VALUES (?, ?, ?, ?)`,
        [post.author_id, post.type, post.content, true]
      );
    }

    console.log('✅ Database seeded successfully');
    console.log('\n📝 Demo Credentials:');
    console.log('  Admin: admin@yemelink.test / Yemelink123!');
    console.log('  User: demo@yemelink.test / Demo123!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await connection.release();
  }
}

seedDatabase()
  .then(() => {
    console.log('✨ Seed setup complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
