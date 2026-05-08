export interface InternalUser {
  internalUserId: string;
}

export interface UploadedPath {
  id: string;
  path: string;
  originalname: string;
}

export interface JobData {
  notificationId: string;
  internalUser: InternalUser;
  filePaths: string[];
  uploadedPaths: UploadedPath[];
}

export interface JobOpts {
  attempts: number;
  removeOnFail: {
    age: number;
  };
  removeOnComplete: {
    age: number;
    count: number;
  };
  backoff: {
    delay: number;
    type: string;
  };
}

export interface BullMQJob {
  name: string;
  data: JobData;
  opts: JobOpts;
  id: string;
  progress: number;
  returnvalue: unknown | null;
  stacktrace: string[];
  delay: number;
  priority: number;
  attemptsStarted: number;
  attemptsMade: number;
  stalledCounter: number;
  timestamp: number;
  queueQualifiedName: string;
  finishedOn?: number;
  processedOn?: number;
}
