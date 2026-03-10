import { db } from '@/lib/firebase';
import admin from 'firebase-admin';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { NextRequest, NextResponse } from 'next/server';

// GET: Fetch all reviews for the logged-in user
export async function GET() {
    let session;
    try {
        session = await getServerSession(authOptions);
    } catch (err) {
        console.error('Error getting session in GET /api/reviews:', err);
        return NextResponse.json({ error: 'Session retrieval failed' }, { status: 500 });
    }

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
    let session;
    try {
        session = await getServerSession(authOptions);
    } catch (err) {
        console.error('Error getting session in POST /api/reviews:', err);
        return NextResponse.json({ error: 'Session retrieval failed' }, { status: 500 });
    }

    const userId = session?.user?.email;

    if (!userId) {
        return NextResponse.json({ error: 'Not authenticated or user ID not found' }, { status: 401 });
    }
    
    try {
        const body = await req.json();
        const { repo, prNumber, prTitle, qualityScore, reviewText } = body;
        
        const reviewData = {
            userId: userId,
            repo,
            prNumber,
            prTitle,
            qualityScore,
            reviewText,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        } as any;

        const docRef = await db.collection('reviews').add(reviewData);
        return NextResponse.json({ id: docRef.id, ...reviewData }, { status: 201 });
    } catch (error) {
        console.error('Error saving review:', error);
        return NextResponse.json({ error: 'Failed to save review' }, { status: 500 });
    }
}