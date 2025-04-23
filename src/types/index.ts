import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
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
  support?: { id: string; firstName: string; lastName: string; email: string };
  issueType: IssueType;
  issuerId: string;
  issuer: { id: string; firstName: string; lastName: string; email: string };
  createdAt: Date;
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
  createdAt: Date;
  editedAt?: Date;
};
