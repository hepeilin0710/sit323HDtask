const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');
const User = require('../models/User');


router.get('/', async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ message: 'Not logged in' });
        }

        const goals = await Goal.find({ user: req.session.userId });
        res.json(goals);
    } catch (error) {
        console.error('Failed to get goal list:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a New Goal
router.post('/', async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ message: 'Not logged in' });
        }

        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Goal title cannot be empty' });
        }

        const goal = await Goal.create({
            title,
            description,
            user: req.session.userId
        });

        res.status(201).json(goal);
    } catch (error) {
        console.error('Failed to create goal:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a goal
router.delete('/:id', async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ message: 'Not logged in' });
        }

        const goal = await Goal.findOneAndDelete({
            _id: req.params.id,
            user: req.session.userId
        });

        if (!goal) {
            return res.status(404).json({ message: 'Goal does not exist' });
        }

        res.json({ message: 'Goal deleted successfully' });
    } catch (error) {
        console.error('Failed to delete goal:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Check if today's check-in exists
router.get('/:id/checkin/today', async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ message: 'Not logged in' });
        }

        const goal = await Goal.findOne({
            _id: req.params.id,
            user: req.session.userId
        });

        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const hasCheckedIn = goal.checkins.some(checkin => {
            const checkinDate = new Date(checkin.date);
            checkinDate.setHours(0, 0, 0, 0);
            return checkinDate.getTime() === today.getTime();
        });

        res.json({ checked: hasCheckedIn });
    } catch (error) {
        console.error('Failed to check today\'s check-in:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Perform a check-in
router.post('/:id/checkin', async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ message: 'Not logged in' });
        }

        const goal = await Goal.findOne({
            _id: req.params.id,
            user: req.session.userId
        });

        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const hasCheckedIn = goal.checkins.some(checkin => {
            const checkinDate = new Date(checkin.date);
            checkinDate.setHours(0, 0, 0, 0);
            return checkinDate.getTime() === today.getTime();
        });

        if (hasCheckedIn) {
            return res.status(400).json({ message: 'Already checked in today' });
        }

        goal.checkins.push({
            date: new Date(),
            note: req.body.note
        });
        await goal.save();

        await User.findByIdAndUpdate(req.session.userId, { $inc: { checkinCount: 1 } });

        res.json({ message: 'Check-in successful' });
    } catch (error) {
        console.error('Check-in failed:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get statistics
router.get('/stats', async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ message: 'Not logged in' });
        }

        const goals = await Goal.find({ user: req.session.userId });

        const totalGoals = goals.length;
        const totalCheckins = goals.reduce((sum, goal) => sum + goal.checkins.length, 0);

        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);

            const hasCheckedIn = goals.some(goal =>
                goal.checkins.some(checkin => {
                    const checkinDate = new Date(checkin.date);
                    checkinDate.setHours(0, 0, 0, 0);
                    return checkinDate.getTime() === date.getTime();
                })
            );

            if (hasCheckedIn) {
                streak++;
            } else {
                break;
            }
        }

        const goalsStats = goals.map(goal => {
            const totalCheckins = goal.checkins.length;
            const daysSinceCreation = Math.ceil((new Date() - goal.createdAt) / (1000 * 60 * 60 * 24));
            const completionRate = Math.round((totalCheckins / daysSinceCreation) * 100);

            let goalStreak = 0;
            for (let i = 0; i < 30; i++) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);

                const hasCheckedIn = goal.checkins.some(checkin => {
                    const checkinDate = new Date(checkin.date);
                    checkinDate.setHours(0, 0, 0, 0);
                    return checkinDate.getTime() === date.getTime();
                });

                if (hasCheckedIn) {
                    goalStreak++;
                } else {
                    break;
                }
            }

            return {
                title: goal.title,
                totalCheckins,
                streak: goalStreak,
                completionRate: Math.min(completionRate, 100)
            };
        });

        const trend = {
            labels: [],
            data: []
        };

        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);

            const checkinsCount = goals.reduce((sum, goal) =>
                sum + goal.checkins.filter(checkin => {
                    const checkinDate = new Date(checkin.date);
                    checkinDate.setHours(0, 0, 0, 0);
                    return checkinDate.getTime() === date.getTime();
                }).length, 0
            );

            trend.labels.push(date.toLocaleDateString());
            trend.data.push(checkinsCount);
        }

        res.json({
            totalGoals,
            totalCheckins,
            streak,
            goals: goalsStats,
            trend
        });
    } catch (error) {
        console.error('Failed to fetch statistics:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Leaderboard
router.get('/leaderboard', async (req, res) => {
    try {
        const leaderboard = await User.find({}, 'username checkinCount')
            .sort({ checkinCount: -1 })
            .limit(5)
            .lean();
        res.json(leaderboard);
    } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
