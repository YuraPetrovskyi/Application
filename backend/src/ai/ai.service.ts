import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
import { PrismaService } from '../prisma/prisma.service';

const fmt = (d: Date) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(d));

const today = () =>
  new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

@Injectable()
export class AiService {
  private groq: Groq;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.groq = new Groq({ apiKey: this.config.get<string>('GROQ_API_KEY') });
  }

  async ask(question: string, userId: string): Promise<string> {
    const context = await this.buildContext(userId);

    const completion = await this.groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant for an event management platform.
You have access to two data sources provided below:
1. USER'S EVENTS — events the current user organized or joined (past and future).
2. UPCOMING PUBLIC EVENTS — all public events from all users, upcoming only.

Use both sections to answer questions. Examples of what you can answer:
- Questions about the user's own events (organized, joined, upcoming, past)
- Questions about public events, including filtering by tag (e.g. "tech events", "music events this weekend")
- Participant counts for any listed event
- Dates, locations, organizers of any listed event

Response rules — follow strictly:
1. ALWAYS give a complete, direct answer. Never ask the user a follow-up question.
2. If an event name is mentioned but not found in the data, respond: "I don't have any information about an event with that name. Please double-check the event name, or browse the events list."
3. If the question is off-topic or unrelated to events, respond with exactly: "Sorry, I didn't understand that. Please try rephrasing your question."
Today's date is ${today()}.

${context}`,
        },
        {
          role: 'user',
          content: question,
        },
      ],
      max_tokens: 512,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content ?? 'No response from AI.';
  }

  private async buildContext(userId: string): Promise<string> {
    const now = new Date();

    const [organizedEvents, participations, publicEvents] = await Promise.all([
      this.prisma.event.findMany({
        where: { organizerId: userId },
        include: {
          tags: { include: { tag: true } },
          _count: { select: { participants: true } },
        },
        orderBy: { dateTime: 'asc' },
      }),
      this.prisma.eventParticipant.findMany({
        where: { userId },
        include: {
          event: {
            include: {
              tags: { include: { tag: true } },
              _count: { select: { participants: true } },
            },
          },
        },
        orderBy: { event: { dateTime: 'asc' } },
      }),
      this.prisma.event.findMany({
        where: {
          visibility: 'PUBLIC',
          dateTime: { gte: now },
        },
        include: {
          tags: { include: { tag: true } },
          _count: { select: { participants: true } },
          organizer: { select: { name: true } },
        },
        orderBy: { dateTime: 'asc' },
        take: 50,
      }),
    ]);

    const formatEvent = (e: any) => {
      const tags = e.tags?.map((et: any) => et.tag.name).join(', ') || 'none';
      const joined = e._count?.participants ?? 0;
      const capacity = e.capacity
        ? `${joined} joined (capacity: ${e.capacity})`
        : `${joined} joined (capacity: unlimited)`;
      return `- "${e.title}" | ${fmt(e.dateTime)} | ${e.location} | tags: ${tags} | ${capacity}`;
    };

    const formatPublicEvent = (e: any) => {
      const tags = e.tags?.map((et: any) => et.tag.name).join(', ') || 'none';
      const joined = e._count?.participants ?? 0;
      const capacity = e.capacity
        ? `${joined} joined (capacity: ${e.capacity})`
        : `${joined} joined (capacity: unlimited)`;
      return `- "${e.title}" | ${fmt(e.dateTime)} | ${e.location} | tags: ${tags} | ${capacity} | organizer: ${e.organizer.name}`;
    };

    const organized = organizedEvents.map(formatEvent).join('\n') || '  (none)';

    const joinedIds = new Set(organizedEvents.map((e) => e.id));
    const joinedEvents =
      participations
        .filter((p) => !joinedIds.has(p.event.id))
        .map((p) => formatEvent(p.event))
        .join('\n') || '  (none)';

    const publicSection =
      publicEvents.map(formatPublicEvent).join('\n') || '  (none)';

    return [
      `=== USER'S EVENTS ===`,
      `[Organized by user]\n${organized}`,
      `[Joined by user]\n${joinedEvents}`,
      ``,
      `=== UPCOMING PUBLIC EVENTS (all users) ===`,
      publicSection,
    ].join('\n\n');
  }
}
