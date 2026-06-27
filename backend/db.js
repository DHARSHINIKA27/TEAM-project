const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 1. Connection logic
const connectDB = async () => {
  const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/enterprise-it';
  try {
    await mongoose.connect(connUri);
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    await seedData();
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

// 2. Define Schemas
const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now }
});

const ServiceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: 'Settings' },
  details: { type: String, default: '' },
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

const ProjectSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  client: { type: String, default: 'Internal Dev' },
  completionDate: { type: String, default: '' },
  status: { type: String, default: 'completed' },
  image: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const CareerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  department: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String, default: '' },
  requirements: { type: String, default: '' },
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

const ApplicationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  jobId: { type: String, required: true },
  jobTitle: { type: String },
  applicantName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  coverLetter: { type: String, default: '' },
  resumeLink: { type: String, default: '' },
  status: { type: String, default: 'pending' },
  appliedDate: { type: Date, default: Date.now }
});

const BlogSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  excerpt: { type: String, default: '' },
  content: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: String },
  readTime: { type: String, default: '5 min read' },
  category: { type: String, default: 'General' },
  image: { type: String, default: '' },
  status: { type: String, default: 'published' },
  createdAt: { type: Date, default: Date.now }
});

const ContactSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String, default: '' },
  subject: { type: String, default: 'General Inquiry' },
  message: { type: String, required: true },
  status: { type: String, default: 'unread' },
  createdAt: { type: Date, default: Date.now }
});

// Compile Models
const User = mongoose.model('User', UserSchema);
const Service = mongoose.model('Service', ServiceSchema);
const Project = mongoose.model('Project', ProjectSchema);
const Career = mongoose.model('Career', CareerSchema);
const Application = mongoose.model('Application', ApplicationSchema);
const Blog = mongoose.model('Blog', BlogSchema);
const Contact = mongoose.model('Contact', ContactSchema);

// Map collection name to model helper
const getModel = (collection) => {
  switch (collection) {
    case 'users': return User;
    case 'services': return Service;
    case 'projects': return Project;
    case 'careers': return Career;
    case 'applications': return Application;
    case 'blogs': return Blog;
    case 'contacts': return Contact;
    default: throw new Error(`Collection model not found: ${collection}`);
  }
};

// 3. Seeding logic
const seedData = async () => {
  // 1. Seed Users (Admin)
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || adminUsername;
  const adminUser = await User.findOne({ username: adminUsername });
  if (!adminUser && adminPassword) {
    // Delete any old admin accounts
    await User.deleteMany({});
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(adminPassword, salt);
    await User.create({
      id: 'admin-1',
      username: adminUsername,
      password: hashedPassword,
      name: adminName,
      role: 'admin'
    });
    console.log(`Seeded ${adminUsername} admin user in MongoDB.`);
  } else if (!adminUser) {
    console.warn('ADMIN_PASSWORD is not set; skipping default admin user seed.');
  }

  // 2. Seed Services
  const serviceCount = await Service.countDocuments();
  if (serviceCount === 0) {
    const defaultServices = [
      {
        id: 'srv-1',
        name: 'Cloud & Infrastructure Services',
        description: 'Design, build, and optimize enterprise-scale multi-cloud and hybrid environments leveraging modern IaC and DevSecOps.',
        icon: 'Cloud',
        details: 'Our enterprise cloud services cover design, migration, implementation, and operations on Azure, AWS, and Hybrid infrastructure. We utilize automated Terraform pipelines, Kubernetes orchestration, and deep monitoring to ensure 99.99% availability.',
        status: 'active'
      },
      {
        id: 'srv-2',
        name: 'AI & Cognitive Engineering',
        description: 'Embed advanced Machine Learning, Large Language Models, and automated telemetry analytics into core business workflows.',
        icon: 'Cpu',
        details: 'Accelerate digital transformation by training custom models, integrating generative AI applications, and orchestrating massive datasets securely under enterprise compliance rules.',
        status: 'active'
      },
      {
        id: 'srv-3',
        name: 'Zero-Trust Cybersecurity',
        description: 'Enforce strict identity validation, persistent threat intelligence, and next-generation SIEM network protection.',
        icon: 'Shield',
        details: 'We establish modern security operations centers, conduct penetration testing, build incident response playbooks, and architect Zero-Trust policies across networks, endpoints, and identity directories.',
        status: 'active'
      },
      {
        id: 'srv-4',
        name: 'Managed IT & Advisory',
        description: 'Provide persistent 24/7 technical operations support, cost optimization audits, and strategic C-level consulting.',
        icon: 'Globe',
        details: 'Offload daily system updates, helpdesk solutions, and patch management while our consulting specialists design your IT modernization roadmaps and security audits.',
        status: 'active'
      }
    ];
    await Service.insertMany(defaultServices);
    console.log('Seeded default services in MongoDB.');
  }

  // 3. Seed Projects (Case Studies) - check if legacy unsplash url is used
  const sampleProject = await Project.findOne({ id: 'proj-1' });
  const useLegacyProjectImages = sampleProject && sampleProject.image.includes('unsplash.com');
  const projectCount = await Project.countDocuments();
  if (projectCount === 0 || useLegacyProjectImages) {
    if (useLegacyProjectImages) {
      await Project.deleteMany({});
    }
    const defaultProjects = [
      {
        id: 'proj-1',
        title: 'FinTech Cloud Migration',
        description: 'Migrating legacy transactional systems of a major financial client to a secure, PCI-DSS compliant Azure Kubernetes Cluster.',
        category: 'Cloud Architecture',
        client: 'Global Apex Bank',
        completionDate: '2025-11-20',
        status: 'completed',
        image: '/images/project_migration.jpg'
      },
      {
        id: 'proj-2',
        title: 'AI Predictive Supply Chain',
        description: 'Building custom machine learning engines that predict logistics delays and dynamically reschedule vendor routes.',
        category: 'AI & Machine Learning',
        client: 'Logix Global Corp',
        completionDate: '2026-03-15',
        status: 'completed',
        image: '/images/project_ai.jpg'
      },
      {
        id: 'proj-3',
        title: 'Zero-Trust Identity Implementation',
        description: 'Rolling out centralized multi-factor, conditional-access identity parameters to over 45,000 endpoint networks.',
        category: 'Cybersecurity',
        client: 'OmniHealth Medical',
        completionDate: '2026-08-01',
        status: 'ongoing',
        image: '/images/project_security.jpg'
      }
    ];
    await Project.insertMany(defaultProjects);
    console.log('Seeded default projects with local image assets in MongoDB.');
  }

  // 4. Seed Careers
  const careerCount = await Career.countDocuments();
  if (careerCount === 0) {
    const defaultCareers = [
      {
        id: 'car-1',
        title: 'Senior Cloud Solutions Architect',
        department: 'Infrastructure & DevOps',
        location: 'Redmond, WA (Hybrid)',
        type: 'Full-time',
        description: 'Join our enterprise solutions division to design robust multi-cloud systems for Fortune 500 organizations.',
        requirements: '8+ years of cloud architecture experience; Certification in Azure (Solutions Architect Expert) or AWS (Solutions Architect Professional); Terraform expertise.',
        status: 'active'
      },
      {
        id: 'car-2',
        title: 'AI/ML Engineering Specialist',
        department: 'Cognitive Engineering',
        location: 'Remote (US/Canada)',
        type: 'Full-time',
        description: 'Develop, deploy, and scale machine learning pipelines and integrate Large Language Models with client systems.',
        requirements: 'Strong coding proficiency in Python and C++; Expertise in PyTorch, HuggingFace transformers, and vector databases (Pinecone, ChromaDB); 4+ years ML experience.',
        status: 'active'
      },
      {
        id: 'car-3',
        title: 'Security Operations Analyst',
        department: 'Cybersecurity',
        location: 'New York, NY (On-site)',
        type: 'Full-time',
        description: 'Monitor networks, analyze security logs, investigate security alerts, and execute incident response procedures.',
        requirements: 'CompTIA Security+, CEH, or equivalent; Proficiency with SIEM platforms (Splunk, Microsoft Sentinel); 2+ years of cybersecurity experience.',
        status: 'active'
      }
    ];
    await Career.insertMany(defaultCareers);
    console.log('Seeded default careers in MongoDB.');
  }

  // 5. Seed Applications
  const applicationCount = await Application.countDocuments();
  if (applicationCount === 0) {
    const defaultApplications = [
      {
        id: 'app-1',
        jobId: 'car-1',
        jobTitle: 'Senior Cloud Solutions Architect',
        applicantName: 'Sarah Jenkins',
        email: 'sarah.jenkins@example.com',
        phone: '+1 555-0199',
        coverLetter: 'I am an AWS and Azure Certified Architect with 9 years of experience. I would love to build next-generation enterprise solutions with your team.',
        resumeLink: 'https://example.com/resumes/sarah_jenkins_resume.pdf',
        status: 'pending'
      }
    ];
    await Application.insertMany(defaultApplications);
    console.log('Seeded default applications in MongoDB.');
  }

  // 6. Seed Blogs - check if legacy unsplash url is used
  const sampleBlog = await Blog.findOne({ id: 'blog-1' });
  const useLegacyBlogImages = sampleBlog && sampleBlog.image.includes('unsplash.com');
  const blogCount = await Blog.countDocuments();
  if (blogCount === 0 || useLegacyBlogImages) {
    if (useLegacyBlogImages) {
      await Blog.deleteMany({});
    }
    const defaultBlogs = [
      {
        id: 'blog-1',
        title: 'Navigating the Shift to Hybrid Multi-Cloud Platforms',
        excerpt: 'As enterprises scale, single-cloud solutions present vendor lock-in risks. Here is how we design resilient hybrid cloud topologies.',
        content: 'Hybrid and multi-cloud configurations are no longer just optional contingencies; they are key tactical necessities for scaling global enterprises. Leveraging a combination of public cloud features (Azure/AWS) and private servers helps businesses lower operating expenditures, isolate secure customer data databases, and secure zero downtime during global routing outages.\n\nIn this article, we outline best practices for planning networks, implementing Infrastructure as Code (IaC) with Terraform, and orchestrating containers across disparate cloud zones.',
        author: 'Marcus Vance (VP of Infrastructure)',
        date: '2026-05-12',
        readTime: '6 min read',
        category: 'Cloud Strategy',
        image: '/images/blog_cloud.jpg',
        status: 'published'
      },
      {
        id: 'blog-2',
        title: 'Deploying LLMs Safely in Enterprise Environments',
        excerpt: 'Integrating AI with private database files requires thorough compliance, audit logs, and strict access controls.',
        content: 'AI integrations bring immense automation capabilities to modern customer portals, internal documents indexing, and tech support chats. However, corporate compliance requires that sensitive financial, patient, or client databases are never leaked to open public model API calls.\n\nTo safely capitalize on GenAI tools, organizations must implement enterprise AI gateways, configure secure vector caches, and establish role-based telemetry audits.',
        author: 'Dr. Elena Rostova (Chief AI Scientist)',
        date: '2026-06-08',
        readTime: '8 min read',
        category: 'AI & Data Science',
        image: '/images/blog_ai.jpg',
        status: 'published'
      }
    ];
    await Blog.insertMany(defaultBlogs);
    console.log('Seeded default blogs with local image assets in MongoDB.');
  }

  // 7. Seed Contacts
  const contactCount = await Contact.countDocuments();
  if (contactCount === 0) {
    const defaultContacts = [
      {
        id: 'cnt-1',
        name: 'Robert Chen',
        email: 'r.chen@logitech-global.com',
        company: 'Logitech Global',
        subject: 'Migration RFP inquiry',
        message: 'Hello, we are interested in scheduling a consultation regarding our database migration roadmap. We would appreciate a response within the week.',
        status: 'unread'
      }
    ];
    await Contact.insertMany(defaultContacts);
    console.log('Seeded default contacts in MongoDB.');
  }
};

// 4. Asynchronous CRUD API exports mapping to Mongo
module.exports = {
  connectDB,
  
  // Custom query tools
  readData: async (collection) => {
    const model = getModel(collection);
    return await model.find({}).lean();
  },
  
  getAll: async (collection) => {
    const model = getModel(collection);
    return await model.find({}).lean();
  },
  
  getById: async (collection, id) => {
    const model = getModel(collection);
    return await model.findOne({ id }).lean();
  },
  
  insert: async (collection, item) => {
    const model = getModel(collection);
    const generatedId = `${collection.slice(0,3)}-${Date.now()}-${Math.floor(Math.random()*1000)}`;
    const newItem = new model({
      id: generatedId,
      ...item
    });
    await newItem.save();
    return newItem.toObject();
  },
  
  update: async (collection, id, updatedFields) => {
    const model = getModel(collection);
    const updated = await model.findOneAndUpdate(
      { id },
      { $set: updatedFields },
      { new: true }
    );
    return updated ? updated.toObject() : null;
  },
  
  delete: async (collection, id) => {
    const model = getModel(collection);
    const res = await model.deleteOne({ id });
    return res.deletedCount > 0;
  }
};
