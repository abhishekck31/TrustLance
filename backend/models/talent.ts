// TypeScript model for the Talent entity used in services and API layer.
export interface TalentModel {
    id: number;
    name: string;
    description: string;
    isFeatured: boolean;
}

export interface CreatedTalentData {
    name: string;
    description: string;
    isFeatured: boolean;
}

export function mapToModel(data: CreatedTalentData): TalentModel {
    return {
        id: data.id,
        name: data.name,
        description: data.description,
        isFeatured: data.isFeatured,
    };
}