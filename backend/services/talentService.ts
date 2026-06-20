// Service layer to handle business logic for talent management.
import { PrismaClient } from '@prisma/client';
import { TalentModel, CreatedTalentData, mapToModel } from '../models/talent';

const prisma = new PrismaClient();

export class TalentService {
    /**
     * Creates a new talent entry in the database.
     */
    async createTalent(data: CreatedTalentData): Promise<TalentModel> {
        const newTalent = await prisma.talent.create({
            data: {
                name: data.name,
                description: data.description,
                isFeatured: data.isFeatured || false,
            },
        });
        return mapToModel(newTalent);
    }

    /**
     * Retrieves a specific talent by ID.
     */
    async getTalentById(id: number): Promise<TalentModel | null> {
        const talent = await prisma.talent.findUnique({ where: { id } });
        if (!talent) return null;
        return mapToModel(talent);
    }

    /**
     * Finds all featured talents.
     */
    async getFeaturedTalents(): Promise<TalentModel[]> {
        const talents = await prisma.talent.findMany({
            where: { isFeatured: true },
        });
        return talents.map(talent => mapToModel(talent));
    }

    /**
     * Updates the featured status of a talent.
     */
    async updateFeatureStatus(id: number, isFeatured: boolean): Promise<boolean> {
        const updated = await prisma.talent.update({
            where: { id },
            data: { isFeatured: isFeatured },
        });
        return !!updated;
    }
}

// Export a singleton instance or methods if needed for dependency injection in API routes
export const talentService = new TalentService();