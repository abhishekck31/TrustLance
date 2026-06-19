import { Request, Response } from 'express';
import { pinToIPFS, prepareMetadataForPinning } from '../services/ipfsService';

/**
 * Endpoint to handle job creation metadata and pin it to IPFS.
 * POST /api/metadata/pin
 */
export const pinJobMetadata = async (req: Request, res: Response) => {
  try {
    const { jobId, metadataPayload } = req.body;

    if (!jobId || !metadataPayload) {
      return res.status(400).json({ error: 'Missing jobId and metadataPayload in request body.' });
    }

    // 1. Prepare the payload for IPFS (serialize it)
    const payloadString = prepareMetadataForPinning(metadataPayload);

    // 2. Pin the payload to IPFS
    const ipfsHash = await pinToIPFS(payloadString);

    // 3. Store the mapping in the database (Assuming Prisma client is accessible globally or injected)
    // In a real application, we would inject the Prisma service here.
    // For this setup, we simulate the DB write:
    console.log(`Successfully pinned metadata for Job ID: ${jobId}. IPFS Hash: ${ipfsHash}`);

    // --- Database Interaction Placeholder ---
    // await prisma.jobMetadataPin.create({
    //     data: {
    //         jobId: jobId,
    //         ipfsHash: ipfsHash,
    //         metadata: metadataPayload, // Storing the payload for quick lookup reference
    //     }
    // });
    // ---------------------------------------

    res.status(200).json({
      message: 'Metadata successfully pinned to IPFS.',
      jobId: jobId,
      ipfsHash: ipfsHash,
    });

  } catch (error) {
    console.error('Error in pinJobMetadata controller:', error);
    res.status(500).json({ error: 'Failed to process metadata pinning.', details: error.message });
  }
};