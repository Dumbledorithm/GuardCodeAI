import { db } from '@/lib/firebase';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { NextRequest, NextResponse } from 'next/server';

// GET: Fetch all reviews for the logged-in user
export async function GET() {
    const session = await getServerSession(authOptions);
    // **FIX:** We now access the user's email directly from the corrected session object.
    const userId = session?.user?.email;

    if (!userId) {
        return NextResponse.json({ error: 'Not authenticated or user ID not found' }, { status: 401 });
    }
    
    try {
        const reviewsSnapshot = await db.collection('reviews')
            .where('userId', '==', userId) // This will now have a valid string value
            .orderBy('createdAt', 'desc')
            .get();
            
        const reviews = reviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return NextResponse.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
}

// POST: Save a new review
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    // **FIX:** We get the userId here as well.
    const userId = session?.user?.email;

    if (!userId) {
        return NextResponse.json({ error: 'Not authenticated or user ID not found' }, { status: 401 });
    }
    
    try {
        const body = await req.json();
        const { repo, prNumber, prTitle, qualityScore, reviewText } = body;
        
        const reviewData = {
            userId: userId, // This will now be a valid string
            repo,
            prNumber,
            prTitle,
            qualityScore,
            reviewText,
            createdAt: new Date().toISOString(),
        };
        
        const docRef = await db.collection('reviews').add(reviewData);
        return NextResponse.json({ id: docRef.id, ...reviewData }, { status: 201 });
    } catch (error) {
        console.error('Error saving review:', error);
        return NextResponse.json({ error: 'Failed to save review' }, { status: 500 });
    }
}