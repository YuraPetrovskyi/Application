import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto, UpdateEventDto } from './dto/event.dto';
import { Visibility } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId?: string, tagIds?: string[]) {
    const events = await this.prisma.event.findMany({
      where: {
        visibility: Visibility.PUBLIC,
        ...(tagIds?.length && {
          tags: { some: { tagId: { in: tagIds } } },
        }),
      },
      include: {
        organizer: { select: { id: true, name: true, email: true } },
        participants: {
          include: { user: { select: { id: true, name: true } } },
        },
        tags: { include: { tag: true } },
        _count: { select: { participants: true } },
      },
      orderBy: { dateTime: 'asc' },
    });

    return events.map((event) => this.formatEvent(event, userId));
  }

  async findOne(id: string, userId?: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        organizer: { select: { id: true, name: true, email: true } },
        participants: {
          include: { user: { select: { id: true, name: true } } },
        },
        tags: { include: { tag: true } },
        _count: { select: { participants: true } },
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (
      event.visibility === Visibility.PRIVATE &&
      event.organizerId !== userId
    ) {
      throw new ForbiddenException('This event is private');
    }

    return this.formatEvent(event, userId);
  }

  async create(dto: CreateEventDto, userId: string) {
    const dateTime = new Date(dto.dateTime);

    if (dateTime < new Date()) {
      throw new BadRequestException('Cannot create events in the past');
    }

    const event = await this.prisma.event.create({
      data: {
        title: dto.title,
        description: dto.description,
        dateTime,
        location: dto.location,
        capacity: dto.capacity ?? null,
        visibility: dto.visibility ?? Visibility.PUBLIC,
        organizerId: userId,
        ...(dto.tagIds?.length && {
          tags: {
            create: dto.tagIds.map((tagId) => ({
              tag: { connect: { id: tagId } },
            })),
          },
        }),
      },
      include: {
        organizer: { select: { id: true, name: true, email: true } },
        participants: {
          include: { user: { select: { id: true, name: true } } },
        },
        tags: { include: { tag: true } },
        _count: { select: { participants: true } },
      },
    });

    return this.formatEvent(event, userId);
  }

  async update(id: string, dto: UpdateEventDto, userId: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });

    if (!event) throw new NotFoundException('Event not found');
    if (event.organizerId !== userId)
      throw new ForbiddenException('Only organizer can edit the event');

    if (dto.dateTime && new Date(dto.dateTime) < new Date()) {
      throw new BadRequestException('Cannot set event date in the past');
    }

    if ('tagIds' in dto) {
      await this.prisma.eventTag.deleteMany({ where: { eventId: id } });
    }

    const updated = await this.prisma.event.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.description && { description: dto.description }),
        ...(dto.dateTime && { dateTime: new Date(dto.dateTime) }),
        ...(dto.location && { location: dto.location }),
        ...('capacity' in dto && { capacity: dto.capacity ?? null }),
        ...(dto.visibility && { visibility: dto.visibility }),
        ...('tagIds' in dto && {
          tags: {
            create: (dto.tagIds ?? []).map((tagId) => ({
              tag: { connect: { id: tagId } },
            })),
          },
        }),
      },
      include: {
        organizer: { select: { id: true, name: true, email: true } },
        participants: {
          include: { user: { select: { id: true, name: true } } },
        },
        tags: { include: { tag: true } },
        _count: { select: { participants: true } },
      },
    });

    return this.formatEvent(updated, userId);
  }

  async remove(id: string, userId: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });

    if (!event) throw new NotFoundException('Event not found');
    if (event.organizerId !== userId)
      throw new ForbiddenException('Only organizer can delete the event');

    await this.prisma.event.delete({ where: { id } });
    return { message: 'Event deleted successfully' };
  }

  async join(eventId: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { _count: { select: { participants: true } } },
    });

    if (!event) throw new NotFoundException('Event not found');

    if (event.organizerId === userId) {
      throw new BadRequestException('Organizer cannot join their own event');
    }

    if (event.capacity && event._count.participants >= event.capacity) {
      throw new BadRequestException('Event is full');
    }

    const existing = await this.prisma.eventParticipant.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });

    if (existing) {
      throw new ConflictException('Already joined this event');
    }

    await this.prisma.eventParticipant.create({
      data: { userId, eventId },
    });

    return this.findOne(eventId, userId);
  }

  async leave(eventId: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) throw new NotFoundException('Event not found');

    const participant = await this.prisma.eventParticipant.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });

    if (!participant) {
      throw new BadRequestException('You are not a participant of this event');
    }

    await this.prisma.eventParticipant.delete({
      where: { userId_eventId: { userId, eventId } },
    });

    return this.findOne(eventId, userId);
  }

  async findUserEvents(userId: string) {
    const participations = await this.prisma.eventParticipant.findMany({
      where: { userId },
      include: {
        event: {
          include: {
            organizer: { select: { id: true, name: true, email: true } },
            participants: {
              include: { user: { select: { id: true, name: true } } },
            },
            tags: { include: { tag: true } },
            _count: { select: { participants: true } },
          },
        },
      },
    });

    const organizedEvents = await this.prisma.event.findMany({
      where: { organizerId: userId },
      include: {
        organizer: { select: { id: true, name: true, email: true } },
        participants: {
          include: { user: { select: { id: true, name: true } } },
        },
        tags: { include: { tag: true } },
        _count: { select: { participants: true } },
      },
    });

    const participatedEvents = participations.map((p) =>
      this.formatEvent(p.event, userId),
    );

    const ownEvents = organizedEvents.map((e) => this.formatEvent(e, userId));

    // merge and deduplicate by id
    const allEvents = [...ownEvents];
    for (const e of participatedEvents) {
      if (!allEvents.find((ae) => ae.id === e.id)) {
        allEvents.push(e);
      }
    }

    return allEvents.sort(
      (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime(),
    );
  }

  private formatEvent(event: any, userId?: string) {
    const participantCount =
      event._count?.participants ?? event.participants?.length ?? 0;
    const isFull = event.capacity ? participantCount >= event.capacity : false;
    const isJoined = userId
      ? event.participants?.some(
          (p: any) => p.userId === userId || p.user?.id === userId,
        )
      : false;
    const isOrganizer = userId ? event.organizerId === userId : false;

    return {
      id: event.id,
      title: event.title,
      description: event.description,
      dateTime: event.dateTime,
      location: event.location,
      capacity: event.capacity,
      visibility: event.visibility,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
      organizer: event.organizer,
      participants: event.participants?.map((p: any) => p.user) ?? [],
      tags: event.tags?.map((et: any) => et.tag) ?? [],
      participantCount,
      isFull,
      isJoined,
      isOrganizer,
    };
  }
}
