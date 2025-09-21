import { getDatabase } from './connection';
import { agentRepository, userRepository } from '../repositories';

export async function initializeDatabase() {
  try {
    console.log('Initializing database...');

    // This will create the database and tables
    await getDatabase();

    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
}

export async function seedDatabase() {
  try {
    console.log('Seeding database with sample data...');

    const sampleWalletAddress = 'addr_test1qz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj0vs2f';

    // Check if sample user already exists
    let sampleUser = await userRepository.findByWalletAddress(sampleWalletAddress);

    if (!sampleUser) {
      // Create a sample user only if it doesn't exist
      sampleUser = await userRepository.create({
        walletAddress: sampleWalletAddress,
        username: 'sample_user',
        isCreator: true,
        isAdmin: false,
        purchasedAgents: [],
        createdAgents: []
      });
      console.log('Created sample user:', sampleUser.id);
    } else {
      console.log('Sample user already exists:', sampleUser.id);
    }

    // Check if sample agent already exists
    const existingAgents = await agentRepository.findAll({ creatorWallet: sampleUser.walletAddress });
    let sampleAgent;

    if (existingAgents.length === 0) {
      // Create a sample agent only if none exist for this creator
      sampleAgent = await agentRepository.create({
        name: 'Resume Helper AI',
        description: 'An AI agent that helps you create and improve your resume with personalized suggestions and formatting.',
        shortDescription: 'AI-powered resume creation and improvement tool',
        creator: 'Sample Creator',
        creatorWallet: sampleUser.walletAddress,
        price: 5000000, // 5 ADA in lovelace
        category: 'productivity',
        tags: ['resume', 'career', 'ai', 'writing'],
        demoLimit: 3,
        inputSchema: {
          type: 'object',
          properties: {
            currentResume: { type: 'string', description: 'Your current resume text' },
            targetJob: { type: 'string', description: 'Job title or description you are targeting' }
          },
          required: ['currentResume']
        },
        crewaiConfig: {
          agent_type: 'resume_helper',
          model: 'gpt-3.5-turbo',
          temperature: 0.7
        }
      });

      // Update user with created agent
      await userRepository.addCreatedAgent(sampleUser.id, sampleAgent.id);
      console.log('Created sample agent:', sampleAgent.id);
    } else {
      sampleAgent = existingAgents[0];
      console.log('Sample agent already exists:', sampleAgent.id);
    }

    console.log('Database seeded successfully');
    console.log('Sample user ID:', sampleUser.id);
    console.log('Sample agent ID:', sampleAgent.id);

    return true;
  } catch (error) {
    console.error('Database seeding failed:', error);
    return false;
  }
}

// Test function to verify database operations
export async function testDatabase() {
  try {
    console.log('Testing database operations...');

    // Test agent operations
    const agents = await agentRepository.findAll({ isActive: true, isApproved: true });
    console.log(`Found ${agents.length} active agents`);

    // Test user operations
    const users = await userRepository.findAll();
    console.log(`Found ${users.length} users`);

    console.log('Database test completed successfully');
    return true;
  } catch (error) {
    console.error('Database test failed:', error);
    return false;
  }
}