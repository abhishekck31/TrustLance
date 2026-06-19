import prisma from './db';
import { Milestone, MilestoneStatus } from '@prisma/client';

interface NewMilestoneData {
  title: string;
  description: string | null;
  progress: number;
}

export async function createMilestone(data: NewMilestoneData): Promise<Milestone> {
  const newMilestone = await prisma.milestone.create({
    data: {
      title: data.title,
      description: data.description,
      progress: data.progress,
      status: MilestoneStatus.PENDING,
    },
  });
  return newMilestone;
}

export async function getMilestones(statusFilter?: MilestoneStatus): Promise<Milestone[]> {
  const whereClause: any = {};
  if (statusFilter) {
    whereClause.status = statusFilter;
  }

  return prisma.milestone.findMany({
    where: whereClause,
    orderBy: { submittedAt: 'desc' },
  });
}

export async function updateMilestoneStatus(milestoneId: string, newStatus: MilestoneStatus, approverId?: string): Promise<Milestone> {
  return prisma.milestone.update({
    where: { id: milestoneId },
    data: {
      status: newStatus,
      approverId: approverId,
    },
  });
}

export async function getMilestoneById(id: string): Promise<Milestone | null> {
  return prisma.milestone.findUnique({ where: { id } });
}

export default {
  createMilestone,
  getMilestones,
  updateMilestoneStatus,
  getMilestoneById,
};