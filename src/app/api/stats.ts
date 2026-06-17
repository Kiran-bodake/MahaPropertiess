   // pages/api/email/stats.ts
   /*
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { EmailLogModel } from '@/models/EmailLog.model';
import { EmailStats } from '@/types/email';
import { connectDB } from "@/lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean; data?: EmailStats; error?: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const session = await getServerSession(req, res);
  if (!session || session.user.role !== 'super_admin') {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  try {
    await connectDB();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Get stats by category
    const categoryStats = await EmailLogModel.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: 1 },
          successful: {
            $sum: { $cond: [{ $eq: ['$status', 'sent'] }, 1, 0] }
          },
          failed: {
            $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
          }
        }
      }
    ]);

    // Get daily trend
    const dailyTrend = await EmailLogModel.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { 
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          sent: { $sum: 1 },
          opened: {
            $sum: { $cond: [{ $eq: ['$status', 'opened'] }, 1, 0] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const totalSent = await EmailLogModel.countDocuments({ 
      createdAt: { $gte: sevenDaysAgo },
      status: { $in: ['sent', 'delivered', 'opened', 'clicked'] }
    });
    
    const failed = await EmailLogModel.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
      status: 'failed'
    });

    const opened = await EmailLogModel.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
      status: 'opened'
    });

    const stats: EmailStats = {
      totalSent,
      successRate: totalSent > 0 ? (totalSent / (totalSent + failed)) * 100 : 0,
      failed,
      openRate: totalSent > 0 ? (opened / totalSent) * 100 : 0,
      byCategory: categoryStats.map(stat => ({
        category: stat._id,
        total: stat.total,
        successful: stat.successful,
        failed: stat.failed
      })),
      dailyTrend: dailyTrend.map(day => ({
        date: day._id,
        sent: day.sent,
        opened: day.opened
      }))
    };

    return res.status(200).json({ success: true, data: stats });

  } catch (error) {
    console.error('Error fetching email stats:', error);
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
}*/