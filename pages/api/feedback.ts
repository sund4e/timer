import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const toEmail = process.env.FEEDBACK_EMAIL_TO;

const sanitize = (text: string) => text.replace(/<[^>]*>?/gm, '');

const MAX_RATING_LENGTH = 10;
const MAX_COMMENT_LENGTH = 5000;

type FeedbackData = {
  rating?: string;
  comment?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  if (!toEmail || !process.env.RESEND_API_KEY) {
    console.error(
      'Required environment variables (RESEND_API_KEY, FEEDBACK_EMAIL_TO) are not set.'
    );
    return res.status(500).json({ message: 'Server configuration error.' });
  }

  try {
    const { rating, comment } = req.body as FeedbackData;

    if (rating && typeof rating !== 'string') {
      return res.status(400).json({ message: 'Invalid rating format.' });
    }

    if (comment && typeof comment !== 'string') {
      return res.status(400).json({ message: 'Invalid comment format.' });
    }

    const sanitizedRating = rating ? sanitize(rating).trim() : '';
    const sanitizedComment = comment ? sanitize(comment).trim() : '';

    if (!sanitizedRating && !sanitizedComment) {
      return res.status(400).json({ message: 'Cannot submit empty feedback.' });
    }

    if (sanitizedRating.length > MAX_RATING_LENGTH) {
      return res.status(400).json({ message: 'Rating is too long.' });
    }

    if (sanitizedComment.length > MAX_COMMENT_LENGTH) {
      return res.status(400).json({ message: 'Comment is too long.' });
    }

    const subject = sanitizedRating
      ? `New Feedback Received: ${sanitizedRating}`
      : 'New Feedback Received';

    const html = `
      ${sanitizedRating ? `<p><strong>Rating:</strong> ${sanitizedRating}</p>` : ''}
      <p><strong>Comment:</strong></p><p>${
        sanitizedComment || 'No comment provided.'
      }</p>
    `;

    const { error } = await resend.emails.send({
      from: 'Feedback Bot <feedback@resend.dev>', // This domain is required by Resend for the free tier
      to: [toEmail],
      subject,
      html,
    });

    if (error) {
      console.error('Resend API Error:', error);
      return res.status(500).json({ message: 'Error sending email.' });
    }

    return res.status(200).json({ message: 'Feedback sent successfully.' });
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return res
      .status(500)
      .json({ message: 'An internal server error occurred.' });
  }
}
