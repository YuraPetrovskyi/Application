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
You have access to the current user's events listed below.
Answer questions about events concisely and helpfully.
If asked about events not in the list, say you don't have information about them.
If the question is unclear, off-topic, or cannot be answered based on the events data, you MUST respond with exactly: "Sorry, I didn't understand that. Please try rephrasing your question."
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
    const [organizedEvents, participations] = await Promise.all([
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
    ]);

    const formatEvent = (e: any) => {
      const tags = e.tags?.map((et: any) => et.tag.name).join(', ') || 'none';
      const joined = e._count?.participants ?? 0;
      const capacity = e.capacity
        ? `${joined}/${e.capacity} participants`
        : `${joined} participants (unlimited)`;
      return `- "${e.title}" | ${fmt(e.dateTime)} | ${e.location} | tags: ${tags} | ${capacity}`;
    };

    const organized = organizedEvents.map(formatEvent).join('\n') || '  (none)';

    const joinedIds = new Set(organizedEvents.map((e) => e.id));
    const joinedEvents =
      participations
        .filter((p) => !joinedIds.has(p.event.id))
        .map((p) => formatEvent(p.event))
        .join('\n') || '  (none)';

    return `=== USER'S EVENTS ===\n[Organized by user]\n${organized}\n\n[Joined by user]\n${joinedEvents}`;
  }
}
