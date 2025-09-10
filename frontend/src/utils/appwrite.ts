import { Client, Databases, Query, ID, Permission, Role } from 'appwrite';

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const databases = new Databases(client);


// Create a user in Appwrite
export async function createUserInAppwrite(user: {
  id: string;
  fullName?: string;
  email?: string;
  imageUrl?: string;
}) {
  try {
    await databases.createDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_USER_COLLECTION_ID,
      user.id,
      {
        userId: user.id,
        name: user.fullName,
        email: user.email,
        avatarUrl: user.imageUrl,
        createdAt: new Date().toISOString()
      }
    );
  } catch (err) {
    // Handle duplicate user or other errors
    console.error(err);
  }
}

// Save detection history to Appwrite
export async function saveDetectionHistory({
  userId,
  detectedText,
  confidence,
  alternatives
}: {
  userId: string;
  detectedText: string;
  confidence: number;
  alternatives?: any;
}) {
  try {
    const response = await databases.createDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_DETECTION_COLLECTION_ID,
      ID.unique(),
      {
        userId,
        detectedText,
        confidence,
        alternatives: JSON.stringify(alternatives),
        createdAt: new Date().toISOString()
      },
      [
        Permission.read(Role.any()),
        Permission.write(Role.any())
      ]
    );
    console.log('Detection history saved:', response);
    return true;
  } catch (err) {
    console.error('Failed to save detection history:', err);
    return false;
  }
}

// Fetch detection history from Appwrite
export async function fetchDetectionHistory(userId: string) {
  const response = await databases.listDocuments(
    import.meta.env.VITE_APPWRITE_DATABASE_ID,
    import.meta.env.VITE_APPWRITE_DETECTION_COLLECTION_ID,
    [Query.equal('userId', userId)]
  );
  return response.documents;
}