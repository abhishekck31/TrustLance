// This service handles the interaction with the IPFS network.
import axios from 'axios';

const IPFS_API_URL = 'https://ipfs.io/ipfs/'; // Using a standard endpoint for demonstration, real implementation might use pinning services like Pinata or dedicated nodes.

/**
 * Pins the provided content (payload) to IPFS and returns the resulting CID hash.
 * @param payload The data to be pinned (stringified JSON).
 * @returns The IPFS Content Identifier (CID).
 */
export async function pinToIPFS(payload: string): Promise<string> {
  if (!payload) {
    throw new Error("Payload cannot be empty for IPFS pinning.");
  }

  try {
    const response = await axios.post(
      'https://api.ipfs.io/ipfs/', // Using a common API endpoint structure
      {
        content: payload,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Assuming the response structure contains the hash in a predictable way.
    // NOTE: Real IPFS pinning APIs often return the CID directly. We simulate it here.
    const ipfsHash = response.data.hash; // Placeholder based on assumed API behavior
    return ipfsHash;

  } catch (error) {
    console.error("Error during IPFS pinning:", error.message);
    throw new Error(`Failed to pin data to IPFS: ${error.message}`);
  }
}

/**
 * Helper function to format metadata for pinning, ensuring it's a JSON string.
 */
export function prepareMetadataForPinning(metadata: any): string {
    return JSON.stringify(metadata);
}