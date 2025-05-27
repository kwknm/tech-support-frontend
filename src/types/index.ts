import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type Attachment = {
  bytes: string;
  bytesLength: number;
  contentType: string;
  fileExtension: string;
  fileName: string;
  id: string;
};

export type Ticket = {
  id: number;
  status: number;
  title: string;
  description: string;
  supportId?: string;
  support?: User;
  issueType: IssueType;
  issuerId: string;
  issuer: User;
  createdAt: Date;
  editedAt?: Date;
  closedAt?: Date;
  isClosed: boolean;
  chatId: string;
  attachment: Attachment;
};

export type IssueType = {
  id: string;
  name: string;
};

export type Metadata = {
  resourceId: string;
};

export type Notification = {
  id: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  recipientId: string;
  timestamp: Date;
  metadata?: Metadata;
};

export type MessageType = {
  firstName: string;
  lastName: string;
  content: string;
  isSupport: boolean;
  timestamp: Date;
  userId: string;
  attachment?: Attachment;
};

export type Faq = {
  id: number;
  title: string;
  content: string;
  authorId: string;
  author: User;
  likes: string[];
  createdAt: Date;
  editedAt?: Date;
};

export type GeneralReport = {
  ticketsCount: number;
  completedTickets: number;
  cancelledTickets: number;
  inProgressTickets: number;
  avgResponseTime: number;
  avgResolutionTime: number;
  newTicketsChartData: { name: string; value: number }[];
  ticketsByStatus: { name: string; value: number }[];
  ticketsByIssueType: { name: string; value: number }[];
};

export type PersonalReport = {
  ticketsCount: number;
  completedTickets: number;
  cancelledTickets: number;
  inProgressTickets: number;
  avgResponseTimePersonal: number;
  avgResolutionTimePersonal: number;
  avgResponseTimeGeneral: number;
  avgResolutionTimeGeneral: number;
};
