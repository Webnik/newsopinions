import { NextRequest, NextResponse } from 'next/server';
import { getAllTopics, getTopicsByCategory, getTopicWithOpinions, processNewOpinions } from '@/lib/orchestrator';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  const id = searchParams.get('id');

  try {
    // Get single topic with opinions
    if (id) {
      const topicData = getTopicWithOpinions(id);
      if (!topicData) {
        return NextResponse.json(
          { success: false, error: 'Topic not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: topicData });
    }

    // Get topics by category or all
    const topics = category ? getTopicsByCategory(category) : getAllTopics();
    return NextResponse.json({ success: true, data: topics });
  } catch (error) {
    console.error('Topics API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch topics' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // Process new opinions and create topics
    const topics = processNewOpinions();
    return NextResponse.json({
      success: true,
      message: `Created ${topics.length} new topics`,
      data: topics,
    });
  } catch (error) {
    console.error('Topics creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create topics' },
      { status: 500 }
    );
  }
}
