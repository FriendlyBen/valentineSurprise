import { Request, Response } from 'express';
import Result from '../models/resultModel';

// Save quiz result
export const saveResult = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, score } = req.body;

    if (!username || score === undefined) {
      res.status(400).json({ message: 'Username and score are required' });
      return;
    }

    // Save new result
    const newResult = new Result({ username, score });
    await newResult.save();

    // Fetch top 10 results
    const topResults = await Result.find()
      .sort({ score: -1, timestamp: -1 }) // Sort by highest score, then latest timestamp
      .limit(10);

    res.status(201).json({
      message: 'Result saved successfully!',
      result: newResult,
      topResults
    });
  } catch (error) {
    res.status(500).json({ message: 'Error saving result', error });
  }
};

